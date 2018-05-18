'use strict';

const crypto = require('crypto');
const disableAllMethods = require('../utils/disableAllMethods');

const unauthorizedErrorDict = {
  name: 'Unauthorized',
  status: 401,
  message: 'You are not authorized to perform this action'
};

const ipCountry = require('ip-country');
const deviceNames = require('../../server/assets/deviceStrings.json');
const ua = require('universal-analytics');

// Initiate the module with custom options.
ipCountry.init({
  // You can specify the path to a custom MMDb file if you want
  // more details about IP addresses (like, city, zipcode, population).
  // Note: For most cases the default MMDb file should be enough.
  // Note: You can find free Dbs here: http://dev.maxmind.com/geoip/geoip2/geolite2/
  // Note: Big MMDb files will use more memory and lookups will be slower.
  mmdb: 'server/assets/geoip.mmdb',

  // Return a default country when the country can not be detected from the IP.
  fallbackCountry: 'US',

  // Expose full IP lookup info in the request (`res.locals.IPInfo`).
  exposeInfo: false
});

const clientTypeHeaderNames = ['X-Machine','x-machine', 'HTTP_X_MACHINE'];

const clientTypeForHeaders = async (headers, needsType) => {
  for (let headerName of clientTypeHeaderNames) {
    if (headers[headerName] && headers[headerName].length > 0) {
      return headers[headerName].toLowerCase();
    }
  }
  if (needsType) {
    console.log(headers);
    return Promise.reject(new Error('Client Type Not Defined in Request Headers'));
  } else {
    return "UNKNOWN";
  }
};

const clientVersionHeaderNames = ['X-Firmware','x-firmware', 'HTTP_X_FIRMWARE'];

const clientVersionForHeaders = async (headers, needsVersion) => {
  for (let headerName of  clientVersionHeaderNames) {
    if (headers[headerName] && headers[headerName].length > 0) {
      return headers[headerName].toLowerCase();
    }
  }
  if (needsVersion) {
    return Promise.reject(new Error('Client Version Not Defined in Request Headers'));
  } else {
    return 'UNKNOWN';
  }
 // return Promise.reject(new Error('Client Version Not Defined in Request Headers'));
};

const clientUDIDHeaderNames = ['X-Unique-ID','x-unique-id', 'HTTP_X_UNIQUE_ID'];

const clientUDIDForHeaders = async (headers, needsResult) => {
  for (let headerName of clientUDIDHeaderNames) {
    if (headers[headerName] && headers[headerName].length > 0) {
      return crypto.createHash('sha256').update(headers[headerName].toLowerCase()).digest('base64');
    }
  }
  if (needsResult) {
    return Promise.reject(new Error('Client UDID Not Defined in Request Headers'));
  } else {
    return "UNKNOWN";
  }
};

const clientInfoForRequest = async (req, needsUDID, needsVersion, needsType) => {
  try {
    const headers = req.headers;
    let ip = headers['x-forwarded-for'] || req.connection.remoteAddress;
    const countryCode = ipCountry.country(ip);
    ip = crypto.createHash('sha256').update(ip).digest('base64');

    let headerPromises = [
      clientTypeForHeaders(headers, needsType),
      clientVersionForHeaders(headers, needsVersion),
      clientUDIDForHeaders(headers, needsUDID)
    ];

    if (needsUDID) {
      headerPromises.push(clientUDIDForHeaders(headers));
    }

    const clientResults = await Promise.all(headerPromises);

    return {
      "type": clientResults[0],
      "version": clientResults[1],
      "ip": ip,
      "country": countryCode,
      "udid": clientResults[2]

    };
  } catch (err) {
    return Promise.reject(err);
  }
};


const sanitizeString = (value) => {
  return value
    .replace(/&/, "&amp;")
    .replace(/</, "&lt;")
    .replace(/>/, "&gt;")
    .replace(/"/, "&quot;")
    .replace(/'/, "&apos;");
}




module.exports = function(Packageversion) {

  const PACKAGES_CONTAINER_NAME = process.env['PACKAGES_CONTAINER_NAME']
  const baseURL = process.env['HOST_URL'];
  const path = require('path');
  const GOOGLE_ANYLT_ID=String(process.env['GOOGLE_ANALYTICS_TRACKING_ID']);

  Packageversion.downloadPackage = (packageVersion, clientInfo, res, cb) => {
    let visitor = ua(GOOGLE_ANYLT_ID, clientInfo['udid'], {strictCidFormat: false, https: true});
    visitor.event("Package Download", packageVersion['package']['identifier'], packageVersion['version']).send();

    Packageversion.app.models.Container.download(PACKAGES_CONTAINER_NAME, packageVersion.file.fileDownloadId, res, cb);

    var downloadInfo = {};
    downloadInfo['packageId'] = packageVersion['packageId'];
    downloadInfo['packageVersionId'] = packageVersion.id;
    downloadInfo['clientIp'] = clientInfo['ip'];
    downloadInfo['clientUDID'] = clientInfo['udid'];
    downloadInfo['clientType'] = clientInfo['type'];
    downloadInfo['clientVersion'] = clientInfo['version'];
    downloadInfo['clientCountry'] =  clientInfo['country'];

    let findInfo = {};
    findInfo['clientUDID'] = clientInfo['udid'];
    findInfo['packageId'] = packageVersion['packageId'];
    findInfo['packageVersionId'] = packageVersion.id;

    Packageversion.app.models.PackageDownload.findOrCreate({
      where: findInfo
    },downloadInfo, function (downloadStatErr, downloadStat, created) {
      if (downloadStatErr) {
        console.log(downloadStatErr);
      }
    });
  };

  Packageversion.handleCanDownloadPackage = async (req,packageVersionId) => {
    let reqObj = req;
    return new Promise(async (resolve, reject) => {
      try {

        await Packageversion.app.models.Device.linkDevice(req);
        let packageVersionObj = await Packageversion.findById(packageVersionId, {
          include: [{
            relation: 'file'
          }, {
            relation: 'package',
            scope: {
              include: ['downloadRestrictions']
            }
          }]
        });

        if (packageVersionObj.toJSON) {
          packageVersionObj = packageVersionObj.toJSON();
        }

        if (!packageVersionObj.package) {
          packageVersionObj.package = await Packageversion.app.models.Package.findById(String(packageVersionObj.packageId), {
            include: ['downloadRestrictions']
          });

          if (packageVersionObj.package.toJSON) packageVersionObj.package = packageVersionObj.package.toJSON();

          console.log(packageVersionObj);
        }

        if (packageVersionObj.visible === false || packageVersionObj.package.visible === false) {
          const clientInfo = await clientInfoForRequest(req,false, false,false);
          return resolve({
            canDownload: false,
            clientInfo: clientInfo,
            packageVersionObj: packageVersionObj,
            deviceLinked: true
          });
        }

        if (packageVersionObj.package.downloadRestrictions && packageVersionObj.package.downloadRestrictions.length > 0) {

          const clientInfo = await clientInfoForRequest(req, true, false, true);
          let deviceCount = await Packageversion.app.models.Device.count({
            udid: clientInfo['udid']
          });

          if (deviceCount < 1) {
            return resolve({
              canDownload: false,
              clientInfo: clientInfo,
              packageVersionObj: packageVersionObj,
              deviceLinked: false
            });
          }
          let restrictions = packageVersionObj.package.downloadRestrictions;
          let canDownload = await Packageversion.app.models.PackageDownloadRestriction.processRestrictions(restrictions, reqObj, packageVersionObj.package.id);
          if (canDownload === "true") {
            return resolve({
              canDownload: true,
              clientInfo: clientInfo,
              packageVersionObj: packageVersionObj,
              deviceLinked: true
            });
          } else {
            return resolve({
              canDownload: false,
              clientInfo: clientInfo,
              packageVersionObj: packageVersionObj,
              deviceLinked: true
            });
          }
        } else {
          const clientInfo = await clientInfoForRequest(req,false, false,false);
          resolve({
            canDownload: true,
            clientInfo: clientInfo,
            packageVersionObj: packageVersionObj,
            deviceLinked: true
          });
          //return Packageversion.downloadPackage(packageVersionObj, clientInfo, res,cb);
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  Packageversion.prototype.download = function(req,res, cb) {

    const versionObjId = this.id;

    Packageversion.handleCanDownloadPackage(req, versionObjId).then((result) => {
      if (result.canDownload === true) {
        return Packageversion.downloadPackage(result.packageVersionObj, result.clientInfo, res, cb);
      } else {
        if (result.deviceLinked === false) {
          res.statusMessage = 'This device is not currently linked to any Packix Accounts. See https://' + baseURL + '/account';
        } else {
          res.statusMessage = 'You either haven\'t Purchased this package, Linked your Device to your Packix Account, Linked your Patreon Account, or Linked the Device tied with the related Cydia Store Purchase. See https://' + baseURL + '/account';
        }
        return res.status(402).end();
      }
    }, (err) => {
      console.log(err);
      res.statusMessage = 'You either haven\'t Purchased this package, Linked your Device to your Packix Account, Linked your Patreon Account, or Linked the Device tied with the related Cydia Store Purchase. See https://' + baseURL + '/account';
      return res.status(402).end();
      // return cb({ error: {
      //   name: 'Server Error',
      //   statusCode: 400,
      //   message: 'An error occured on the server, please contact the repo maintainer'
      // }});
    });
  };

  Packageversion.getDownloadCount = async (packageVersionObj) => {
    try {
      let downloadCount = Packageversion.app.models.PackageDownload.count({
        packageVersionId: packageVersionObj.id
      });

      return downloadCount;
    } catch (err) {
     return Promise.reject(err);
    }
  };

  Packageversion.computeDownloadCount = async function(packageVersionObj) {
    return await Packageversion.getDownloadCount(packageVersionObj);
  };

  Packageversion.remoteMethod(
    'download',
    {
      isStatic: false,
      accepts: [
        {arg: 'req', type: 'object', http: {source: 'req'}},
        {arg: 'res', type: 'object', 'http': {source: 'res'}}
      ],
      http: {path:'/download', verb: 'get'},
      returns: {}
    }
  );

  Packageversion.handleRate = async (packageVersionObj, req, rating) => {
    return new Promise(async (resolve, reject) => {
      try {
        const clientInfo = await clientInfoForRequest(req, false, false, true);
        const data = {
          packageId: packageVersionObj.packageId,
          packageVersionId: packageVersionObj.id,
          clientIp: clientInfo['ip'],
          clientType: clientInfo['type']
        };

        let createData = Object.assign({}, data);
        createData['value'] = rating;

        let previousRatingResult = await Packageversion.app.models.PackageVersionRating.findOrCreate({
          where: data
        }, createData);

        let previousRating = previousRatingResult[0];
        if (previousRatingResult[1] === false) {
          previousRating = await previousRating.updateAttribute('value', rating);
        }
        resolve(previousRating);
      } catch (err) {
        reject(err);
      }
    });
  };


  Packageversion.prototype.rate = function(req, rating, cb) {
    if (rating >= 4 && rating <= 5 && (rating % 1 === 0)) {
      const packageVersionObj = this;
      Packageversion.handleRate(packageVersionObj, req, rating).then((result) => {
        return cb(null,result);
      }, (err) => {
        return cb(err);
      });
    } else {
     return cb(400,'Not a valid Rating');
    }
  };

  Packageversion.remoteMethod(
    'rate',
    {
      isStatic: false,
      accepts: [
        {arg: 'req', type: 'object', http: {source: 'req'}},
        {arg: 'rating', type: 'string', http: { source: 'query' } },
      ],
      http: {path:'/rate', verb: 'get'},
      returns: {type: 'any', root: true}
    }
  );

  Packageversion.handleReview = async (packageVersionObj, req, title, description) => {
    return new Promise(async (resolve, reject) => {
      try {
        const clientInfo = await clientInfoForRequest(req, false, false, true);
        const data = {
          packageId: packageVersionObj.packageId,
          packageVersionId: packageVersionObj.id,
          clientIp: clientInfo['ip'],
          clientType: clientInfo['type'],
          versionName: packageVersionObj.version
        };

        let createData = Object.assign({}, data);
        createData['title'] = title;
        createData['description'] = description;

        let previousReviewResult = await Packageversion.app.models.PackageVersionReview.findOrCreate({
          where: data
        }, createData);

        let previousReview = previousReviewResult[0];
        if (previousReviewResult[1] === false) {
          previousReview = await previousReview.updateAttributes({
            title: title,
            description: description
          });
        }
        resolve(previousReview);
      } catch (err) {
        reject(err);
      }
    });
  };


  Packageversion.prototype.review = function(req, title, description, rating, cb) {
    if (title && description) {
      title = sanitizeString(title);
      description = sanitizeString(description);
      const packageVersionObj = this;

      if (rating >= 1 && rating <= 5 && (rating % 1 === 0)) {
        Packageversion.handleRate(packageVersionObj, req, rating).then((result) => {
        }, (err) => {
          console.log(err);
        });
      }

      Packageversion.handleReview(packageVersionObj, req, title, description).then((result) => {
        return cb(null,result);
      }, (err) => {
        return cb(err);
      });
    } else {
      cb(400, 'Invalid');
    }
  };

  Packageversion.remoteMethod(
    'review',
    {
      isStatic: false,
      accepts: [
        {arg: 'req', type: 'object', http: {source: 'req'}},
        {arg: 'title', type: 'string'},
        {arg: 'description', type: 'string'},
        {arg: 'rating', type: 'number' }
      ],
      http: {path:'/review', verb: 'post'},
      returns: {type: 'any', root: true}
    }
  );

  Packageversion.getDownloadStats = async (packageVersionObj) => {
    return new Promise(async (resolve, reject) => {
      try {
        const versionId = packageVersionObj.id;
        let downloads = await Packageversion.app.models.PackageDownload.find({
          where: {
            packageVersionId: versionId
          }
        });

        let deviceTypeStats = {};
        let deviceVersionStats = {};
        let deviceLocationStats = {};

        for (let download of downloads) {
          let deviceType = download['clientType'] || 'UNKNOWN';
          let deviceVersion = download['clientVersion'] || 'UNKNOWN';
          let deviceLocation = download['clientCountry'] || 'UNKNOWN';

          if (!deviceTypeStats[deviceType]) deviceTypeStats[deviceType] = 0;
          if (!deviceVersionStats[deviceVersion]) deviceVersionStats[deviceVersion] = 0;
          if (!deviceLocationStats[deviceLocation]) deviceLocationStats[deviceLocation] = 0;

          deviceTypeStats[deviceType] += 1;
          deviceVersionStats[deviceVersion] += 1;
          deviceLocationStats[deviceLocation] += 1;
        }

        let deviceTypeStatsNormal = {};
        for (let deviceType in deviceTypeStats) {
          let deviceName = deviceNames[deviceType] || 'Unknown';
          if (!deviceTypeStatsNormal[deviceName]) deviceTypeStatsNormal[deviceName] = 0;
          deviceTypeStatsNormal[deviceName] += deviceTypeStats[deviceType];
        }

        let deviceTypeStatsArray = [];
        let deviceTypeStatsGeneral = {
          'iPhone': 0,
          'iPad': 0,
          'iPod': 0,
          'Unknown': 0
        };
        for (let deviceName in deviceTypeStatsNormal) {
          if (deviceName.indexOf('iPhone') !== -1) {
            deviceTypeStatsGeneral['iPhone'] += deviceTypeStatsNormal[deviceName];
          } else if (deviceName.indexOf('iPad') !== -1) {
            deviceTypeStatsGeneral['iPad'] += deviceTypeStatsNormal[deviceName];
          } else if (deviceName.indexOf('iPod') !== -1) {
            deviceTypeStatsGeneral['iPod'] += deviceTypeStatsNormal[deviceName];
          } else {
            deviceTypeStatsGeneral['Unknown'] += deviceTypeStatsNormal[deviceName];
          }

          deviceTypeStatsArray.push({
            name: deviceName,
            value: deviceTypeStatsNormal[deviceName]
          });
        }

        let deviceTypeStatsGeneralArray = [];

        for (let deviceName in deviceTypeStatsGeneral) {
          if (deviceTypeStatsGeneral[deviceName] > 0) {
            deviceTypeStatsGeneralArray.push({
              name: deviceName,
              value: deviceTypeStatsGeneral[deviceName]
            })
          }
        }


        let deviceLocationStatsArray = [];
        for (let countryCode in deviceLocationStats) {
          deviceLocationStatsArray.push({
            name: countryCode,
            value: deviceLocationStats[countryCode]
          });
        }

        let deviceVersionStatsArray = [];
        for (let deviceVersion in deviceVersionStats) {
          let deviceVersionString = deviceVersion;
          if (deviceVersion === 'UNKNOWN') deviceVersionString = 'Unknown';
          deviceVersionStatsArray.push({
            name: deviceVersionString,
            value: deviceVersionStats[deviceVersion]
          });
        }

        resolve({
          'deviceTypeStats': deviceTypeStatsArray,
          'deviceTypeGeneralStats': deviceTypeStatsGeneralArray,
          'deviceLocationStats': deviceLocationStatsArray,
          'deviceVersionStats': deviceVersionStatsArray
        });
      } catch (err) {
        reject(err);
      }
    });
  };

  Packageversion.prototype.downloadStats = function(req, cb) {
    const packageVersionObj = this;
    Packageversion.getDownloadStats(packageVersionObj).then((result) => {
      return cb(null,result);
    }, (err) => {
      return cb(err);
    });
  };

  Packageversion.remoteMethod(
    'downloadStats',
    {
      isStatic: false,
      accepts: [
        {arg: 'req', type: 'object', http: {source: 'req'}}
      ],
      http: {path:'/downloadStats', verb: 'get'},
      returns: {type: 'any', root: true}
    }
  );

  Packageversion.checkProtoAccess = async (ctx,data) => {
    //if (ctx.args && ctx.args.data && ctx.args.data.package) delete ctx.args.data.packageId;
    console.log("Checking Proto Access");
    const accountId = ctx.req.accessToken ? ctx.req.accessToken.userId : null;
    if (!accountId) {
      return false
    }

    let instanceId = ctx.instance ? ctx.instance.id : null;
    if (!instanceId) instanceId = ctx.args ? ctx.args.id : null;
    if (!instanceId) instanceId = ctx.where ? ctx.where.id : null;
    console.log('Instance Id' + instanceId);

    let versionObj = await Packageversion.findById(instanceId, {
      include: ['package']
    });
    if (versionObj.toJSON) versionObj = versionObj.toJSON();

    const otherAccountId = versionObj.package.accountId ? versionObj.package.accountId : null;
    if ((!accountId || !otherAccountId) || otherAccountId.toString() != accountId.toString()) {
      return false;
    }
    return true;
  };
  //
  Packageversion.beforeRemote('prototype.patchAttributes', function (ctx,data, next) {
    console.log("checking proto access");
    Packageversion.checkProtoAccess(ctx,data).then((value) => {
      if (value === true) return next();
      else return next(unauthorizedErrorDict);
    }).catch((err) => {
      return next(unauthorizedErrorDict);
    })
  });
  //
  // Packageversion.beforeRemote('create',  async (ctx, data, next) => {
  //   let accountId = ctx.req.accessToken ? ctx.req.accessToken.userId : null;
  //   let packageId = ctx.args.data.packageId;
  //   if (!packageId) {
  //     return next(unauthorizedErrorDict);
  //   }
  //
  //   let packageObj = await Packageversion.app.models.Package.findById(packageId);
  //   if ((!packageObj || !packageObj.accountId) || accountId.toString() !== packageObj.accountId.toString()) {
  //     return next(unauthorizedErrorDict);
  //   }
  //
  //   return next();
  // });
  //
  // Packageversion.beforeRemote('prototype.downloadStats', Packageversion.checkProtoAccess);

  disableAllMethods(Packageversion, []);
};
