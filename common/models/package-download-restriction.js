'use strict';

// Patreon
/* {
 type: 'patreon',
 packageId: string
 data: {
 'rewardAmount': number.
 'campaignId': string,
 'rewardId': string
 }
 } */

// Cydia Store
/*
{
  type: 'cydia-store',
  packageId: string
  data: {
    'packageIdentifier': string
  }
}
*/

const patreonAPI = require('patreon').patreon;
const jsonApiURL = require('patreon').jsonApiURL;
const crypto = require('crypto');
const TokenProvider = require('refresh-token');
const cydiaStoreApi = require('../utils/cydiaStore');


const PATREON_CLIENT_ID =  process.env['PATREON_LOGIN_CLIENT_ID'];
const PATREON_CLIENT_SECRET = process.env['PATREON_LOGIN_CLIENT_SECRET'];
const clientTypeHeaderNames = ['X-Machine','x-machine', 'HTTP_X_MACHINE', 'X-MACHINE'];

const unauthorizedErrorDict = {
  name: 'Unauthorized',
  status: 401,
  message: 'You are not authorized to perform this action'
};

const disableAllMethods = require('../utils/disableAllMethods');

const clientTypeForHeaders = async (headers, needsType) => {
  for (let headerName of clientTypeHeaderNames) {
    if (headers.hasOwnProperty(headerName) && headers[headerName].length > 0) {
      return headers[headerName];
    }
  }
  if (needsType) {
   // console.log(headers);
    return Promise.reject(new Error('Client Type Not Defined in Request Headers'));
  } else {
    return "UNKNOWN";
  }
};

const clientVersionHeaderNames = ['X-Firmware','x-firmware', 'HTTP_X_FIRMWARE'];

const clientVersionForHeaders = async (headers, needsVersion) => {
  for (let headerName of  clientVersionHeaderNames) {
    if (headers.hasOwnProperty(headerName) && headers[headerName].length > 0) {
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

const refreshToken = async (refreshToken) => {
  console.log('REFRESH TOKEN: ');
  //console.log(refreshToken);
  return new Promise(async (resolve, reject) => {
    try {
      let tokenProvider = new TokenProvider('https://api.patreon.com/oauth2/token', {
        refresh_token: refreshToken,
        client_id: PATREON_CLIENT_ID,
        client_secret: PATREON_CLIENT_SECRET
        /* you can pass an access token optionally
         access_token:  'fdlaksd',
         expires_in:    2133
         */
      });

      tokenProvider.getToken(function (err, token) {
        console.log(err);
        if (err) return reject(err);
        return resolve(token);
      });
    } catch (err) {
      return reject(err);
    }
  });
};

const clientUDIDHeaderNames = ['X-Unique-ID','x-unique-id', 'HTTP_X_UNIQUE_ID'];

const clientUDIDForHeaders = async (headers, needsResult) => {
  for (let headerName of clientUDIDHeaderNames) {
    if (headers.hasOwnProperty(headerName) && headers[headerName].length > 0) {
      return crypto.createHash('sha256').update(headers[headerName].toLowerCase()).digest('base64');
    }
  }
  if (needsResult) {
    return Promise.reject(new Error('Client UDID Not Defined in Request Headers'));
  } else {
    return "UNKNOWN";
  }
};

const clientDecryptedUDIDForHeaders = async (headers, needsResult) => {
  for (let headerName of clientUDIDHeaderNames) {
    if (headers.hasOwnProperty(headerName) && headers[headerName].length > 0) {
      return headers[headerName].toLowerCase();
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
    ip = crypto.createHash('sha256').update(ip).digest('base64');

    let headerPromises = [
      clientTypeForHeaders(headers, needsType),
      clientVersionForHeaders(headers, needsVersion),
      clientUDIDForHeaders(headers, needsUDID),
      clientDecryptedUDIDForHeaders(headers, needsUDID)
    ];

    if (needsUDID) {
      headerPromises.push(clientUDIDForHeaders(headers));
    }

    const clientResults = await Promise.all(headerPromises);

    return {
      "type": clientResults[0],
      "version": clientResults[1],
      "ip": ip,
      "udid": clientResults[needsUDID ? 4 : 1],
      "decryptedUDID": clientResults[3]

    };
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports = function(Packagedownloadrestriction) {

  const rTypesToMethodN = {
    'patreon': 'patreonTierSatisfied',
    'paypal-payment': 'paypalPaymentSatisfied',
    'device-specific': 'deviceRequirementsSatisfied',
    'udid-group': 'udidGroupRequirementSatisfied'
  };

  Packagedownloadrestriction.satisfied = async (restriction, packageId, clientInfo, devConfig) => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log('Restriction: ');
       // console.log(restriction);
        if (restriction['type'] === 'patreon') {
          let satisfied = await Packagedownloadrestriction.patreonTierSatisfied(restriction, packageId, clientInfo, devConfig);
          return resolve(satisfied);
        } else if (restriction['type'] === 'paypal-payment') {
          let satisfied = await Packagedownloadrestriction.paypalPaymentSatisfied(restriction, packageId, clientInfo, devConfig);
          return resolve(satisfied);
        } else {
          return resolve("false");
        }
      } catch (err) {
        return reject(err);
      }
    });
  };

  Packagedownloadrestriction.processRestrictions = async function(restrictions, req, packageId) {
    try {
      console.log('Restrictions: ');
      //console.log(restrictions);
      let restrictionPromises = [];

      const clientInfo = await clientInfoForRequest(req, true, false, false);
      let packageObj = await Packagedownloadrestriction.app.models.Package.findById(packageId);
      if (packageObj.toJSON) packageObj = packageObj.toJSON();
      let devConfig = await Packagedownloadrestriction.app.models.DeveloperPreferences.findOne({
        where: {
          accountId: String(packageObj.accountId)
        }
      });
      if (devConfig.toJSON) devConfig = devConfig.toJSON();

      console.log('Checking Restrictions for Package: ' + packageObj.identifier);

      let cydiaStoreRestriction = null;

      for (let restriction of restrictions) {
        if (String(restriction["type"]) === "cydia-store") {
          cydiaStoreRestriction = restriction;
        } else {
          restrictionPromises.push(Packagedownloadrestriction.satisfied(restriction, packageId, clientInfo, devConfig));
        }
      }

      restrictionPromises.push(Packagedownloadrestriction.giftOrGroupSatisfied(packageId, clientInfo));

      let results = await Promise.all(restrictionPromises);
      console.log('Results');
      console.log(results);

      for (let result of results) {
        if (result === "true") {
          console.log('We did it');
          return "true";
        }
      }

      if (cydiaStoreRestriction !== null) {
        let result = await Packagedownloadrestriction.cydiaStoreSatisfied(cydiaStoreRestriction, packageId, clientInfo, devConfig);
        if (result === "true") {
          console.log('We did it');
          return "true";
        }
      }
      console.log("Restriction Result is No");
      return "false";
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  };

  Packagedownloadrestriction.giftOrGroupSatisfied = async (packageId, clientInfo) => {
    try {
      let devices = await Packagedownloadrestriction.app.models.Device.find({
        where: {
          udid: clientInfo['udid'],
          deviceModel: String(clientInfo['type'])
        },
        "include": ["account"]
      });

      for (let deviceObj of devices) {
        let device = deviceObj;
        if (device.toJSON) device = device.toJSON();
        let giftCount = await Packagedownloadrestriction.app.models.PackageGiftLink.count({
          packageId: String(packageId),
          accountId: String(device.accountId)
        });
        if (giftCount > 0) {
          console.log('Gift Device');
          console.log(device);
          console.log('Gift successful for Account: ' + device.account.profileName);
          return "true";
        }
        // let giftCount = await Packagedownloadrestriction.app.models.AccountGroupLink.count({
        //   packageId: packageId,
        //   accountId: device.accountId
        // });

      }
      return "false";
    } catch (err) {
      return Promise.reject(err);
    }
  };

  Packagedownloadrestriction.cydiaStoreSatisfied = async (restriction, packageId, clientInfo, devSettings) => {
    try {
      let deviceUdid = clientInfo['decryptedUDID'];
      let packageIdentifier = restriction["data"]["packageIdentifier"];
      let cydiaVendorId = devSettings["cydiaVendorId"] || "";
      let cydiaVendorSecret = devSettings["cydiaVendorSecret"] || "";
      if (cydiaVendorId.length < 1 || cydiaVendorSecret.length < 1) return "false";
      let result = await cydiaStoreApi.checkUDID(packageIdentifier, deviceUdid, cydiaVendorSecret, cydiaVendorId);
      if (result === true) {
        let devices = await Packagedownloadrestriction.app.models.Device.find({
          where: {
            udid: clientInfo['udid']
          },
          include: ["account"]
        });

        let retTrue = false;

        for (let device of devices) {
          retTrue = true;
          let deviceObj = device;
          if (deviceObj.toJSON) deviceObj = deviceObj.toJSON();

          let giftCount = await Packagedownloadrestriction.app.models.PackageGiftLink.count({
            packageId: packageId,
            extraInfo: clientInfo["udid"],
            accountId: deviceObj.accountId
          });

          if (giftCount < 1) {
            let giftLink = await Packagedownloadrestriction.app.models.PackageGiftLink.create({
              packageId: packageId,
              accountId: deviceObj.accountId,
              extraInfo: clientInfo["udid"]
            });
          }
        }
        return "true";
      } else return "false";
    } catch (err) {
      console.log(err);
      return "false";
    }

  };

  Packagedownloadrestriction.patreonTierSatisfied = async (restriction, packageId, clientInfo, devConfig) => {
    console.log('GOT TO PATREON TEST');

    try {
      let reqAmount = restriction['data']['rewardAmount'];
      // let tierIds = [];
      // for (let tier of tierIdObjs) {
      //   tierIds.push(tier['id']);
      // }
      let campaignId = restriction['data']['campaignId'];
     // console.log(campaignId);

      //console.log('Client Info: ');
     // console.log(clientInfo);
      let devices = await Packagedownloadrestriction.app.models.Device.find({
        where: {
          udid: clientInfo['udid'],
          deviceModel: String(clientInfo['type'])
        },
        include: ["account"]
      });

      for (let deviceObj of devices) {
        let device = deviceObj;
        if (device.toJSON) device = device.toJSON();
       // console.log('Device: ');
       // console.log(device);
        if (device['account']) {
          let identity = await Packagedownloadrestriction.app.models.AccountIdentity.findOne({
            where: {
              userId: device.accountId,
              provider: 'patreon'
            }
          });
          if (identity) {
            if (identity.toJSON) {
              identity = identity.toJSON();
            }

           // let membersObj = await Packagedownloadrestriction.app.models.Repository.getPatreonsAsync();
            let patreonUser = await Packagedownloadrestriction.app.models.PatreonUser.findOne({
              where: {
                patreonId: identity['externalId'],
                accountId: restriction.accountId
              }
            });
            if (patreonUser) {
              if (patreonUser.toJSON) patreonUser = patreonUser.toJSON();
              if (patreonUser['pledgeAmount'] >= reqAmount && patreonUser['pledgePaused'] !== true) {
                console.log('Patron is allowed to download: ' + patreonUser['name']);
                return "true";
              } else {
                console.log('Pledge User cannot download: ');
                console.log(patreonUser);
              }
            } else {
              console.log('No Patreon User for Id: ' + identity['externalId']);
            }
            //console.log('Member Pledge Amount: ' + membersObj[identity['externalId']]);
            // if (membersObj[identity['externalId']]) {
            //   if (membersObj[identity['externalId']] >= reqAmount) {
            //     console.log("HE IS ALLOWED TO DOWNLOAD");
            //     return "true";
            //   }
            // }

           //  if (identity['credentials'] && identity['credentials']['accessToken']) {
           //    // const accessToken = await refreshToken(identity['credentials']['refreshToken']);
           //    let accessToken = identity['credentials']['accessToken'];
           //    console.log('Access Token: ' + accessToken);
           //
           //    let patreonAPIClient = patreonAPI(accessToken);
           //    const url = jsonApiURL('/current_user?include=pledges');
           //
           //    let results = await patreonAPIClient(url);
           //    let store = results['store'];
           //    console.log(store);
           //    let users = store.findAll('user');
           //    for (let user of users) {
           //      console.log('Pledges: ');
           //      console.log(user.pledges);
           //      console.log('User :');
           //      console.log(user.serialize());
           //
           //      let pledges = user.pledges;
           //      if (pledges) {
           //        for (let pledge of pledges) {
           //          console.log('Checking Pledge: ' + pledge.serialize());
           //          if (pledge.reward) {
           //            console.log("Checking pledge" + pledge.reward.serialize());
           //            //const campId = pledge.reward.campaign.serialize().data.id;
           //            const rewardAmount = pledge.reward.serialize().data['attributes']['amount_cents'];
           //            // console.log(pledge.reward.serialize());
           //            console.log('Reward Amount: ' + rewardAmount);
           //            if (rewardAmount >= reqAmount) {
           //              console.log("HE IS ALLOWED TO DOWNLOAD");
           //              return "true";
           //            }
           //          }
           //        }
           //      }
           //    }
           // //    let pledges = store.findAll('pledge');
           // // //   console.log(store.findAll('reward').serialize());
           // //
           // //    for (let pledge of pledges) {
           // //      console.log('Checking Pledge: ' + pledge.serialize());
           // //      if (pledge.reward) {
           // //        console.log("Checking pledge" + pledge.reward.serialize());
           // //        //const campId = pledge.reward.campaign.serialize().data.id;
           // //        const rewardAmount = pledge.reward.serialize().data['amount_cents'];
           // //        if (rewardAmount >= reqAmount) {
           // //          console.log("HE IS ALLOWED TO DOWNLOAD");
           // //          return "true";
           // //        }
           // //      }
           // //    }
           //  }
          }
        }
      }
      return "false";
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  };



  Packagedownloadrestriction.paypalPaymentSatisfied = async (restriction, packageId, clientInfo, devConfig) => {
    try {
      let devices = await Packagedownloadrestriction.app.models.Device.find({
        where: {
          udid: String(clientInfo['udid']),
          deviceModel: String(clientInfo['type'])
        },
        include: ['account']
      });

      console.log('Number of Devices: ' + devices.length);
      for (let deviceObj of devices) {
        let device = deviceObj;
        if (device.toJSON) device = device.toJSON();
        if (device['account']) {
          console.log('PayPal Restriction Account ID: ' +  device.accountId);
          let purchases = await Packagedownloadrestriction.app.models.PackagePurchase.find({
            where: {
              accountId: device.accountId,
              packageId: String(packageId),
              status: 'Completed'
            },
            include: ['account']
          });

          console.log('Number of Purchases: ' + purchases.length);
          if (purchases.length > 0) return "true";

          // for (let purchaseObj of purchases) {
          //   let purchase = purchaseObj;
          //   if (purchase.toJSON) purchase = purchase.toJSON();
          //   // console.log(purchase.toJSON);
          //   // if (purchase.account.getAsync) purchase.account = await purchase.account.getAsync();
          //   // if (purchase.isComplete === true) {
          //     //if (purchase.account.getAsync) purchase.account = await purchase.account.getAsync();
          //     // console.log(purchase.toJSON);
          //    // console.log('Returning True for Device:');
          //   //  console.log(device);
          //     console.log('Purchase: ');
          //     console.log(purchase);
          //     console.log('Purchase Valid for User: ' + purchase.account.profileName);
          //     // console.log(purchase.account);
          //     return "true";
          //   //}
          // }
        }

      }
      return "false";
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  };

  Packagedownloadrestriction.deviceRequirementsSatisfied = async (restriction, packageId, clientInfo) => {
    return "false";
  };

  Packagedownloadrestriction.udidGroupRequirementSatisfied = async (restriction, packageId, clientInfo) => {
    return "false";
  };


  Packagedownloadrestriction.updatePackageForId = async (packageId) => {
  //  console.log('Update for Id:' + packageId);
    let packageObj = await Packagedownloadrestriction.app.models.Package.findById(String(packageId), {
      include:['downloadRestrictions']
    });

   // console.log(packageObj);
    let isPaid = false;
    let isPatreon = false;
    let hasRestrictions = false;

    let packageObjData = packageObj;
    if (packageObj.toJSON) {
      packageObjData = packageObj.toJSON();
    }
    let restrictions = packageObjData['downloadRestrictions'];

    for (let restriction of restrictions) {
      hasRestrictions = true;
      if (restriction['type'] === 'paypal-payment') {
        if (restriction['data'])
        isPaid = true;
      } else if (restriction['type'] === 'patreon') {
        isPatreon = true;
      }
    }

    packageObj = await packageObj.updateAttributes({
      isPaid: isPaid,
      patreonRestricted: isPatreon,
      hasRestrictions: hasRestrictions
    });
    return Promise.resolve(packageObj)
  };

  Packagedownloadrestriction.observe('after save', (ctx, next) => {
   // console.log('UPDATING AFTER UPDATE');
   // console.log('PackageId: ' + ctx.instance.packageId);
    if (!ctx.instance) return next();
    Packagedownloadrestriction.updatePackageForId(ctx.instance.packageId).then(() => {
      return next();
    });
  });

  // Packagedownloadrestriction.getPackageId = async (restId) => {
  //   let ret - Packagedownloadrestriction.findBy
  // }

  Packagedownloadrestriction.observe('before delete', (ctx, next) => {
  //  console.log(ctx.where);
    Packagedownloadrestriction.findById(ctx.where.id, function(err, obj) {
      console.log(err);
      ctx.hookState.packageId = obj.packageId;
      next();
    });
  });

  Packagedownloadrestriction.observe('after delete', (ctx, next) => {
    //console.log(ctx);
    Packagedownloadrestriction.updatePackageForId(ctx.hookState.packageId).then(() => {
      return next();
    });
  });


  Packagedownloadrestriction.checkProtoAccess = function (ctx,data,next) {

    // let allRestrictions = await Packagedownloadrestriction.find({});
    // for (let restriction of allRestrictions) {
    //   let restrictionObj = await Packagedownloadrestriction.findById(restriction.id, {
    //     include: ['package']
    //   });
    //
    //   let restrictionJSON = restrictionObj.toJSON();
    //   restrictionObj = await restrictionObj.updateAttributes({
    //     accountId: restrictionJSON.package.accountId
    //   });
    //   console.log('Success With ID: ' + restrictionObj.id);
    // }
    // return next(unauthorizedErrorDict);
    // if (ctx.args.data.accountId) delete ctx.args.data.accountId;

    const accountId = ctx.req.accessToken ? ctx.req.accessToken.userId : null;
    const otherAccountId = ctx.instance ? ctx.instance.accountId : null;
    if (!accountId || !otherAccountId) {
      return next(unauthorizedErrorDict);
    }

    // let restrictionObj = await Packagedownloadrestriction.findById(restrictionId, {
    //   include: ['package']
    // });
    // if (restrictionObj.toJSON) restrictionObj = restrictionObj.toJSON();
    if (String(otherAccountId) !== String(accountId)) {
      return next(unauthorizedErrorDict);
    }
    if (ctx.args.data.accountId) delete ctx.args.data.accountId;
    return next();
  };

  Packagedownloadrestriction.beforeRemote('prototype.patchAttributes', Packagedownloadrestriction.checkProtoAccess);


  Packagedownloadrestriction.createBeforeAsync = async (ctx) => {
    let accountId = ctx.req.accessToken ? ctx.req.accessToken.userId : "";
    ctx.args.data.accountId = accountId;
    let packageId = ctx.args.data.packageId;
    if (!packageId) {
      return Promise.resolve(false);
    }

    let packageObj = await Packagedownloadrestriction.app.models.Package.findById(packageId);
    if (!packageObj || !packageObj.accountId) {
      return Promise.resolve(false);
    }

    if (!(accountId.toString() === packageObj.accountId.toString())) {
      return Promise.resolve(false);
    }

    return Promise.resolve(true);
  };

  Packagedownloadrestriction.deleteBeforeAsync = async (ctx) => {
    let accountId = ctx.req.accessToken ? ctx.req.accessToken.userId : "";
    //ctx.args.data.accountId = accountId;
    //console.log(ctx.args);
    let packageId = null;
    if (!packageId) {
      let restId = ctx.args.id;
      if (!restId) restId = ctx.where.id;
      let restObj = await Packagedownloadrestriction.findById(ctx.args.id);
      packageId = restObj['packageId'];
    }
    if (!packageId) {
      return Promise.resolve(false);
    }

    let packageObj = await Packagedownloadrestriction.app.models.Package.findById(packageId);
    if (!packageObj || !packageObj.accountId) {
      return Promise.resolve(false);
    }

    if (!(accountId.toString() === packageObj.accountId.toString())) {
      return Promise.resolve(false);
    }

    return Promise.resolve(true);
  };

  Packagedownloadrestriction.beforeRemote('create', (ctx, data, next) => {
    Packagedownloadrestriction.createBeforeAsync(ctx).then((value) => {
      if (value === true) return next();
      else return next(unauthorizedErrorDict);
    }).catch((err) => {
      return next(unauthorizedErrorDict);
    });
  });

  // Packagedownloadrestriction.beforeRemote('deleteById', (ctx, data, next) => {
  //   Packagedownloadrestriction.deleteBeforeAsync(ctx).then((value) => {
  //     if (value === true) return next();
  //     else return next(unauthorizedErrorDict);
  //   }).catch((err) => {
  //     return next(unauthorizedErrorDict);
  //   });
  // });

  // Packagedownloadrestriction.beforeRemote('delete', (ctx, data, next) => {
  //   Packagedownloadrestriction.deleteBeforeAsync(ctx).then((value) => {
  //     if (value === true) return next();
  //     else return next(unauthorizedErrorDict);
  //   }).catch((err) => {
  //     return next(unauthorizedErrorDict);
  //   });
  // });

  disableAllMethods(Packagedownloadrestriction, []);


};
