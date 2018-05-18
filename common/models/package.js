'use strict';

const fs = require('fs-extra');
const path = require('path');
const targz = require('tar.gz');
const ControlParser = require('debian-control-parser');
const hashFiles = require('hash-files');
const zlib = require('zlib');
const cookieDeMangle = require('cookie');
const debian_compare = require("deb-version-compare");
const uuidV4 = require('uuid/v4');
const ar = require('ar');
const crypto = require('crypto');
const tar = require('tar-stream');
const gunzip = require('gunzip-maybe');
const sbuff = require('simple-bufferstream');
const FormData = require('form-data');
const multiparty = require('multiparty');
const concat = require('concat-stream');
const stream_node = require('stream');
const httpMocks = require('node-mocks-http');
const sharp = require('sharp');
const compressjs = require('compressjs');
const Bzip2 = require('compressjs').Bzip2;
const lzmajs = require('lzma-purejs');
const lzma = require('lzma-native');
const nodemailer = require('nodemailer');
const nodemailerSendgrid = require('nodemailer-sendgrid');
const dateMath = require('date-math');
const NRP = require('node-redis-pubsub');

const unauthorizedErrorDict = {
  name: 'Unauthorized',
  status: 401,
  message: 'You are not authorized to perform this action'
};

const disableAllMethods = require('../utils/disableAllMethods');

// const hmacAsync = async (hashType, hashKey, digestType) => {
//   let hmacSig = crypto.createHmac('sha1', cydiaToken).update(queryString).digest('base64');
//   hmacSig = safeBase64(hmacSig);
// }

const getHashForBuffer = async (hashType, bufferData) => {
  let promiseObj = new Promise((resolve, reject) => {
    let bufferStream = new stream_node.PassThrough();
    bufferStream.end(bufferData);
    bufferStream.pipe(crypto.createHash(hashType).setEncoding('hex')).on('finish', function () {
      let finalHash = this.read();
      resolve(finalHash);
    });
  });

  return promiseObj;
};

const getControlDataForBuffer = async (bufferData) => {
  let promiseObj = new Promise((resolve, reject) => {
    try {
     // console.log("Parsing archive");
      let archive = new ar.Archive(bufferData);
     // console.log(archive);
     // console.log('Getting Archive Files');
      let files = archive.getFiles();
      //console.log('Got Archive Files');

      for (let i = 0; i < files.length; i++) {
        let fileObj = files[i];
       // console.log('fileObj: ');
       // console.log(fileObj);
        let fileName = fileObj.name();
        if (fileName) fileName = String(fileName);
        if (!fileName) fileName = "";

       // console.log('File Name: ' + fileName);

        if (fileName.includes('control.tar.gz')) {
          let controlExtract = tar.extract();

          controlExtract.on('entry', function (header, stream, next) {
            if (header.name.indexOf('control') !== -1) {
              let controlObj = ControlParser(stream);
              controlObj.on('stanza', (stanza) => {
                resolve(stanza);
              })
            } else {
              next();
            }
          });

          sbuff(fileObj.fileData()).pipe(gunzip()).pipe(controlExtract);
        }
      }
    } catch (err) {
      console.log(err);
      return reject(err);
    }
  });

  return promiseObj;
};

const bufferToStream = async (bufferData) => {
  let promiseObj = new Promise((resolve, reject) => {
    let bufferStream = new stream_node.PassThrough();
    bufferStream.end(bufferData);
    resolve(bufferStream);
  });

  return promiseObj;
};

const bufferToStreamSync =(bufferData) => {
    let bufferStream = new stream_node.PassThrough();
    bufferStream.end(bufferData);
    return bufferStream;
};

const clientTypeHeaderNames = ['X-Machine','x-machine', 'HTTP_X_MACHINE'];

const clientTypeForHeaders = async (headers) => {
  try {
    for (let headerName of clientTypeHeaderNames) {
      if (headers[headerName] && headers[headerName].length > 0) {
        return headers[headerName].toLowerCase();
      }
    }
    return Promise.reject(new Error('Client Type Not Defined in Request Headers'));
  } catch (err) {
    return Promise.reject(err);
  }
};

const clientVersionHeaderNames = ['X-Firmware','x-firmware', 'HTTP_X_FIRMWARE'];

const clientVersionForHeaders = async (headers, needsVersion) => {
  try {
    if (!needsVersion === false) return "UNKNOWN";
    for (let headerName of  clientVersionHeaderNames) {
      if (headers[headerName] && headers[headerName].length > 0) {
        return headers[headerName].toLowerCase();
      }
    }
    return 'UNKNOWN';
  } catch (err) {
    return Promise.reject(err);
  }
  // return Promise.reject(new Error('Client Version Not Defined in Request Headers'));
};

const clientUDIDHeaderNames = ['X-Unique-ID','x-unique-id', 'HTTP_X_UNIQUE_ID'];

const clientUDIDForHeaders = async (headers, needsResult) => {
  try {
    for (let headerName of clientUDIDHeaderNames) {
      if (headers[headerName] && headers[headerName].length > 0) {
        return crypto.createHash('sha256').update(headers[headerName].toLowerCase()).digest('base64');
      }
    }
    if (needsResult) {
      return Promise.reject(new Error('Client UDID Not Defined in Request Headers'));
    } else {
      return "";
    }
  } catch (err) {
    return Promise.reject(err);
  }
};

const clientInfoForRequest = async (req, needsUDID, needsVersion) => {
  try {
    const headers = req.headers;
    let ip = headers['x-forced-ip'] || headers['x-forwarded-for'] || req.connection.remoteAddress;
    ip = crypto.createHash('sha256').update(ip).digest('base64');

    let headerPromises = [
      clientTypeForHeaders(headers),
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
      "country": '',
      "udid": clientResults[2]

    };
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports = function (Package) {

  // let packagesGFS = Package.app.get("gfs");

  const PACKAGES_CONTAINER_NAME = process.env['PACKAGES_CONTAINER_NAME'] || 'packages';
  const SCREENSHOTS_CONTAINER_NAME = process.env['SCREENSHOTS_CONTAINER_NAME'] || 'screenshots';
  const baseURL = process.env['HOST_URL'];
  const REPOSITORY_NAME = process.env['REPOSITORY_NAME'];
  const REPOSITORY_CODENAME = process.env['REPOSITORY_CODENAME'];
  const REPOSITORY_DESCRIPTION = process.env['REPOSITORY_DESCRIPTION'];
  const SMTP_EMAIL = process.env['SMTP_EMAIL'];
  const SMTP_PASSWORD = process.env['SMTP_PASSWORD'];
  const SMTP_NAME = process.env['SMTP_NAME'];

  const GOOGLE_ANYLT_ID=String(process.env['GOOGLE_ANALYTICS_TRACKING_ID']);

  let nrm = null;

  if (parseInt(process.env['REDIS_PORT']) > 1) {
    let nrp = new NRP({
      port: process.env['REDIS_PORT'],
      host: process.env['REDIS_HOST']

    });

    nrp.on('rebuild packages', (data) => {
      Package.runReload();
    });

    Package.reload = () => {
      nrp.emit('rebuild packages', {});
    };
  } else {
    Package.reload = () => {
      Package.runReload();
    }
  }



  Package.runReload = () => {

    let isFirst = true;
    // return;
    let mainDistPath = "../../dist/";
    let PackagesFile = fs.createWriteStream(path.resolve(__dirname, mainDistPath + 'Packages'), {});

    // PackagesFile.on('open', function(fd) {
    Package.find({
      where: {
        visible: true
      },
      include: {
        versions: 'file'
      }
    }, (err, packages) => {
      for (let packageObject of packages) {
        if (packageObject.toJSON) packageObject = packageObject.toJSON();
          // console.log(packageObject);
        for (let packageVersion of packageObject.versions) {
          // var packageJSON = packageObject.toJSON();
          if (packageVersion.visible) {
            let firstString = isFirst ? '' : '\n';
            let tagString = 'purpose::extension' + (packageObject.hasRestrictions ? ', cydia::commercial' : '');

            let packageData = packageVersion.raw;
            packageData['SHA256'] = packageVersion.file.sha256;
            packageData['SHA1'] = packageVersion.file.sha1;
            packageData['MD5sum'] = packageVersion.file.md5;
            packageData['Depiction'] = 'https://' + baseURL + '/package/' + packageObject.identifier;
            packageData['Author'] = packageObject.author;
            packageData['Name'] = packageObject.name;
            packageData['Architecture'] = 'iphoneos-arm';
            packageData['Size'] = packageVersion.file.size;
            packageData['Filename'] = 'api/PackageVersions/' + packageVersion.id + '/download';
            if (packageVersion.dependencies) {
              packageData['Depends'] = packageVersion.dependencies;
            }
            packageData['Section'] = packageObject.section.name;
            packageData['Version'] = packageVersion.version;
            packageData['Maintainer'] = packageObject.maintainer;
            packageData['Package'] = packageObject.identifier;
            packageData['Tag'] = tagString;

            let packageString = firstString;
            for (let key in packageData) {
              packageString += key + ': ' + packageData[key] + '\n';
            }

            PackagesFile.write(packageString);

            //
            // PackagesFile.write(firstString + 'Package: ' + packageObject.identifier + '\n' +
            //   'Section: ' + 'Tweaks' + '\n' +
            //   'Version: ' + packageVersion.version + '\n' +
            //   'Maintainer: ' + packageObject.maintainer + '\n' +
            //   'Depends: ' + packageVersion.dependencies + '\n' +
            //   'Filename: ' + 'api/PackageVersions/' + packageVersion.id + '/download' + '\n' +
            //   'Size: ' + packageVersion.file.size + '\n' +
            //   'Architecture: ' + 'iphoneos-arm' + '\n' +
            //   'Description: ' + packageObject.shortDescription + '\n' +
            //   'Name: ' + packageObject.name + '\n' +
            //   'Author: ' + packageObject.author + '\n' +
            //   'Depiction: ' + 'https://' + baseURL + '/package/' + packageObject.identifier + '\n' +
            //   'MD5sum: ' + packageVersion.file.md5 + '\n' +
            //   'SHA1: ' + packageVersion.file.sha1 + '\n' +
            //   'SHA256: ' + packageVersion.file.sha256 + '\n' +
            //     tagString + '\n' +
            //   'Installed-Size: ' + packageVersion.raw['Installed-Size'] + '\n'
            // );
            isFirst = false;
          }
        }
      }

      PackagesFile.end();

      let packagesGFS = Package.app.get("gfs");
      //let packageDataBuffer = new Buffer(fs.readFileSync(path.resolve(__dirname, mainDistPath + 'Packages')), 'utf8');
     // bufferToStreamSync(packageDataBuffer).pipe(zlib.createGzip()).pipe(fs.createWriteStream(path.resolve(__dirname, mainDistPath + 'Packages.gz')));
      packagesGFS.remove({filename: 'Packages'}, function (err, gridStore) {
        if (err) console.log(err);
        fs.createReadStream(path.resolve(__dirname, mainDistPath + 'Packages')).pipe(packagesGFS.createWriteStream({
          filename: 'Packages'
        }));
      });

      // packagesGFS.remove({filename: 'Packages'}, function (err, gridStore) {
      //   if (err) console.log(err);
      // });

      //  let packagesStrm = packagesGFS.createWriteStream({
      //   filename: 'Packages'
      // });

      //fs.createReadStream(path.resolve(__dirname, mainDistPath + 'Packages')).pipe(packagesStrm);

      fs.createReadStream(path.resolve(__dirname, mainDistPath + 'Packages')).pipe(zlib.createGzip()).pipe(fs.createWriteStream(path.resolve(__dirname, mainDistPath + 'Packages.gz')));
      fs.createReadStream(path.resolve(__dirname, mainDistPath + 'Packages')).pipe(zlib.createGzip()).pipe(packagesGFS.createWriteStream({
        filename: 'Packages.gz'
      }));

      //let compressed = new Buffer(Bzip2.compressFile(packageDataBuffer));
     // fs.writeFileSync(path.resolve(__dirname, mainDistPath + 'Packages.bz2'), compressed);
     // let compressedLZMA = new Buffer(lzmajs.compressFile(packageDataBuffer));
     // fs.writeFileSync(path.resolve(__dirname, mainDistPath + 'Packages.lzma'), compressedLZMA);
      let packageFile = fs.createReadStream(path.resolve(__dirname, mainDistPath + 'Packages'));

      packageFile.pipe(concat(async (packageDataBuffer) => {
        let compressed = new Buffer(Bzip2.compressFile(packageDataBuffer));

        // packagesGFS.remove({filename: 'Packages.bz2'}, function (err, gridStore) {
        //   if (err) console.log(err);
        //   bufferToStreamSync(compressed).pipe(packagesGFS.createWriteStream({
        //     filename: 'Packages.bz2'
        //   }));
        // });
        fs.writeFileSync(path.resolve(__dirname, mainDistPath + 'Packages.bz2'), compressed);
      }));


      var compressor = lzma.createCompressor();
      var input = fs.createReadStream(path.resolve(__dirname, mainDistPath + 'Packages'));
      var output = fs.createWriteStream(path.resolve(__dirname, mainDistPath + 'Packages.xz'));

      input.pipe(compressor).pipe(output);


      // let packageFile = fs.createReadStream(path.resolve(__dirname, mainDistPath + 'Packages'));
      //
      // packageFile.pipe(concat(async (packageDataBuffer) => {
      //   let compressed = new Buffer(Bzip2.compressFile(packageDataBuffer));
      //
      //   packagesGFS.remove({filename: 'Packages.bz2'}, function (err, gridStore) {
      //     if (err) console.log(err);
      //     bufferToStreamSync(compressed).pipe(packagesGFS.createWriteStream({
      //       filename: 'Packages.bz2'
      //     }));
      //   });
      //   fs.writeFileSync(path.resolve(__dirname, mainDistPath + 'Packages.bz2'), compressed);
      // }));

      try {
        packagesGFS.remove({filename: 'Packages.bz2'}, (err, gridStore) => {
          if (err) console.log(err);
          console.log("Streaming Packages.bz2");
          let i3 = fs.createReadStream(path.resolve(__dirname, mainDistPath + 'Packages'));
          i3.pipe(concat(async (p1Buffer) => {
            console.log("Concat done for Packages.bz2");
            let c3 = new Buffer(Bzip2.compressFile(p1Buffer));
            let i4 = bufferToStreamSync(c3);
            console.log("Stream created for Packages.bz2");
            let w4 = packagesGFS.createWriteStream({
              filename: 'Packages.bz2'
            });

            i4.pipe(w4);
          }));
        });

        packagesGFS.remove({filename: 'Packages.xz'}, (err, gridStore) => {
          if (err) console.log(err);
          console.log("Streaming Packages.xz");
          let c1 = lzma.createCompressor();
          let i1 = fs.createReadStream(path.resolve(__dirname, mainDistPath + 'Packages'));
          let w1 = packagesGFS.createWriteStream({
            filename: 'Packages.xz'
          });

          i1.pipe(c1).pipe(w1);
        });

        packagesGFS.remove({filename: 'Packages.lzma'}, (err, gridStore) => {
          if (err) console.log(err);
          console.log("Streaming Packages.lzma");
          let oC = lzma.createStream('aloneEncoder', {});
          let i2 = fs.createReadStream(path.resolve(__dirname, mainDistPath + 'Packages'));
          let w2 = packagesGFS.createWriteStream({
            filename: 'Packages.lzma'
          });
          i2.pipe(oC).pipe(w2);
        });
      } catch (err) {
        console.log('Packages Relaod Error');
        console.log(err);
      }
      //
      // let oC = lzma.createStream('aloneEncoder', {});
      // let i2 = s.createReadStream(path.resolve(__dirname, mainDistPath + 'Packages'));
      // i2.pipe(oC).pipe(packagesGFS.createWriteStream({
      //   filename: 'Packages.lzma'
      // }));

      var oCompressor = lzma.createStream('aloneEncoder', {});
      var input1 = fs.createReadStream(path.resolve(__dirname, mainDistPath + 'Packages'));
      var output1 = fs.createWriteStream(path.resolve(__dirname, mainDistPath + 'Packages.lzma'));

      input1.pipe(oCompressor).pipe(output1);

      let releaseFileString = "";
      releaseFileString += "Origin: " + REPOSITORY_NAME + '\n';
      releaseFileString += "Label: " + REPOSITORY_NAME + '\n';
      releaseFileString += "Suite: stable" + '\n';
      releaseFileString += "Version: 1.1" + '\n';
      releaseFileString += "Codename: " + REPOSITORY_CODENAME + '\n';
      releaseFileString += "Architectures: iphoneos-arm\nComponents: main\n";
      releaseFileString += "Description: " + REPOSITORY_DESCRIPTION;

      fs.writeFileSync(path.resolve(__dirname, mainDistPath + 'Release'), releaseFileString);

      // PackagesFile.end();
      // let packageDataBuffer = new Buffer(fs.readFileSync(path.resolve(__dirname, mainDistPath + 'Packages')), 'utf8');
      // bufferToStreamSync(packageDataBuffer).pipe(zlib.createGzip()).pipe(fs.createWriteStream(path.resolve(__dirname, mainDistPath + 'Packages.gz')));
      // // let compressed = new Buffer(Bzip2.compressFile(packageDataBuffer));
      // // fs.writeFileSync(path.resolve(__dirname, mainDistPath + 'Packages.bz2'), compressed);
      // let compressedLZMA = new Buffer(lzmajs.compressFile(packageDataBuffer));
      // fs.writeFileSync(path.resolve(__dirname, mainDistPath + 'Packages.lzma'), compressedLZMA);
      //
      // let releaseFileString = "";
      // releaseFileString += "Origin: " + REPOSITORY_NAME + '\n';
      // releaseFileString += "Label: " + REPOSITORY_NAME + '\n';
      // releaseFileString += "Suite: stable" + '\n';
      // releaseFileString += "Version: 0.9" + '\n';
      // releaseFileString += "Codename: " + REPOSITORY_CODENAME + '\n';
      // releaseFileString += "Architectures: iphoneos-arm\nComponents: main\n";
      // releaseFileString += "Description: " + REPOSITORY_DESCRIPTION;
      //
      // fs.writeFileSync(path.resolve(__dirname, mainDistPath + 'Release'), releaseFileString);


    });
  };
  Package.upload = function (ctx, options, cbF) {
    let accountId = ctx.req.accessToken ? ctx.req.accessToken.userId : null;
    if (!accountId || accountId.length < 1) return;

    let cb = (var1, var2) => {};

    if (!options) options = {};

    let self = this;
    let formObj = new multiparty.Form();

    formObj.on('error', (err) => {
      console.log('Error parsing form: ' + err.stack);
    });

    formObj.on('part', (part) => {
      if (part.filename) {
        part.pipe(concat(async (bufferData) => {
          let bufferDataObj = bufferData;
          let md5Hash = await getHashForBuffer('md5', bufferData);
          let sha1Hash = await getHashForBuffer('sha1', bufferData);
          let sha256Hash = await getHashForBuffer('sha256', bufferData);
         // console.log("getting control data");
          let controlData = await getControlDataForBuffer(bufferData);

          try {
            let existingPackage = await Package.findOne({
              where: {
                identifier: controlData['Package']
              }
            });
            if (existingPackage && String(existingPackage.accountId) !== String(accountId)) {
              return cb(unauthorizedErrorDict);
            }
            if (existingPackage && existingPackage.id && String(existingPackage.id).length > 0) {
              let pId = String(existingPackage.id);
              let otherCount = await Package.app.models.PackageVersion.count({
                packageId: pId,
                version: controlData['Version'] ? controlData['Version'] : '0.0.1'
              });
              if (otherCount > 0) {
                return cb(unauthorizedErrorDict);
              }
            }
          } catch (err) {
            console.log(err);
          }

          let uploadOptions = {
            'filename': part.filename,
            'mimetype': 'application/vnd.debian.binary-package'
          };

          let uploadStreamObj = await bufferToStream(bufferData);
          Package.app.models.Container.uploadStream(PACKAGES_CONTAINER_NAME, uploadStreamObj, uploadOptions, (err, fileObj) => {
            if (err) {
              cb(err);
              console.log(err);
            } else {
              let fileInfo = fileObj.metadata;
              let obj = {
                size: fileObj.length,
                name: fileObj.filename,
                type: fileInfo.mimetype,
                md5: md5Hash,
                sha1: sha1Hash,
                sha256: sha256Hash,
                date: Date.now(),
                container: fileInfo.container,
                url: 'https://' + baseURL + '/api/containers/' + fileInfo.container + '/download/' + fileObj._id,
                fileDownloadId: fileObj._id
              };

              let stanza = controlData;

              // if (stanza['Section'] && stanza['Section'].length) {
              Package.app.models.Section.findOrCreate({
                where: {
                  name: stanza['Section'] ? stanza['Section'] : 'Tweak'
                }
              }, {
                name: stanza['Section'] ? stanza['Section'] : 'Tweak'
              }, (sectionError, sectionObject, sectionCreated) => {
                if (sectionError) {
                  console.log('Section Error');
                  console.log(sectionError);
                  cb(sectionError);
                  return;
                } else {
                  Package.findOrCreate({
                    where: {
                      identifier: stanza.Package
                    }
                  }, {
                    name: stanza.Name,
                    identifier: stanza.Package,
                    author: stanza['Author'],
                    maintainer: stanza['Maintainer'],
                    stage: stanza['Stage'] ? stanza['Stage'] : 'Stable',
                    accountId: String(ctx.req.accessToken.userId),
                    sectionId: String(sectionObject.id),
                    shortDescription: stanza['Description']
                  }, (packageError, packageObject, packageCreated) => {
                    if (packageError) {
                      console.log('Package Error');
                      console.log(packageError);
                      cb(packageError);
                      return;
                    } else {
                      if (!packageCreated) {
                        // if (stanza['Version']) {
                        //   packageObject.latest = stanza['Version'];
                        //   packageObject.save();
                        // }
                      }
                      Package.app.models.PackageVersion.create({
                        version: stanza['Version'] ? stanza['Version'] : '0.0.1',
                        packageId: String(packageObject.id),
                        dependencies: stanza['Depends'],
                        raw: stanza
                      }, (packageVersionError, packageVersionObject) => {
                        if (packageVersionError) {
                          console.log('Package Version Error');
                          console.log(packageVersionError);
                          return cb(packageVersionError);
                        } else {
                          obj['packageVersionId'] = packageVersionObject.id;
                          Package.app.models.PackageFile.create(obj, (packageFileError, packageFileObject) => {
                            if (packageFileError) {
                              console.log(packageFileError);
                              return cb(packageFileError);
                            } else {
                              if (cbF) {
                                cbF(null, packageObject);
                              }
                              Package.updateLatestVersion(String(packageObject.id)).then((result) => {
                                console.log(result);
                              }).catch((err) => {
                                console.log(err);
                              });
                              // Package.reload();
                            }
                          });
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }));
      } else {
        part.resume();
      }
    });
    formObj.parse(ctx.req);
  };

  Package.getPaymentExperienceProfile = async (expName, profileIfNotFound, accountId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const paypalThing = require('paypal-rest-sdk');
        // let accountObj = await Package.app.models.Account.findById({
        //
        // });
        // console.log('Developer Name:' + accountObj['profileName']);
        let devConfig = await Package.app.models.DeveloperPreferences.findOne({
          where: {
            accountId: String(accountId)
          }
        });

        paypalThing.configure({
          'mode': 'live', //sandbox or live
          'client_id': devConfig.paypalClientId,
          'client_secret': devConfig.paypalClientSecret
        });

        paypalThing.webProfile.list((error, web_profiles) => {
          if (error) reject(error);
          let chosenProfile = null;
          if (!web_profiles) web_profiles = [];
          for (let profile of web_profiles) {
            if (profile.name === expName) {
              chosenProfile = profile;
              break;
            }
          }
          if (chosenProfile) resolve(chosenProfile);
          profileIfNotFound['name'] = expName;
          paypalThing.webProfile.create(profileIfNotFound, (error, web_profile) => {
            if (error) reject(error);
            resolve(web_profile);
          });
        });
      } catch (err) {
        reject(err);
      }
    });
  };


  Package.createPaypalPurchase = async (purchaseInfo, accountId) => {
    return new Promise(async (resolve, reject) => {
      try {
        // let accountObj = await Package.app.models.Account.findById({
        //
        // });
        // console.log('Developer Name:' + accountObj['profileName']);
        const paypalThing = require('paypal-rest-sdk');
        let devConfig = await Package.app.models.DeveloperPreferences.findOne({
          where: {
            accountId: String(accountId)
          },
          include: ['account']
        });

        if (devConfig.toJSON) devConfig = devConfig.toJSON();

        // let accountObj = await Package.app.models.Account.findById({
        //
        // });
        //
        // console.log('Developer Name:' + accountObj['profileName']);

        paypalThing.configure({
          'mode': 'live', //sandbox or live
          'client_id': devConfig.paypalClientId,
          'client_secret': devConfig.paypalClientSecret
        });
        paypalThing.payment.create(purchaseInfo, (err, payment) => {
          if (err) {
            console.log("The Error: ");
            console.log(err.response.details);
            reject(err);
          } else resolve(payment);
        })
      } catch (err) {
        reject(err);
      }
    });
  };

  Package.createPurchase = async (packageData) => {
    return new Promise(async (resolve, reject) => {
      try {
        const packageId = packageData['packageId'];
        let packageObj = await Package.findById(packageId, {
          include: ['downloadRestrictions', 'developer']
        });

        let downloadRestrictions = [];
        let packageAuthor = null;

        if (packageObj.toJSON) {
          let packageObjData = packageObj.toJSON();
          downloadRestrictions = packageObjData['downloadRestrictions'];
          if (packageObjData['developer']) {
            let authorString = packageObjData['developer']['name'];
            if (authorString && authorString.length > 0) packageAuthor = authorString;
          }
        } else {
          if (packageObj['downloadRestrictions']) {
            downloadRestrictions = packageObj['downloadRestrictions'];
          }

          if (packageObj['developer']) {
            if (packageObj['developer']['name']) {
              let authorString = String(packageObj['developer']['name']);
              if (authorString && authorString.length > 0) packageAuthor = authorString;
            }
          }
        }

        let price = null;

        for (let restriction of downloadRestrictions) {
          if (restriction['type'] === 'paypal-payment') {
            price = restriction['data']['price'];
            break;
          }
        }


        if (price) {
          console.log(price);
          const packageName = packageData['packageName'];
          if (!packageAuthor) packageAuthor = packageData['packageAuthor'];
          const userId = packageData['userId'];

          let packagePurchase = await Package.app.models.PackagePurchase.create({
            accountId: userId,
            packageId: packageId,
            provider: "paypal"
          });

          let paymentExperience = {
            "input_fields": {
              "no_shipping": 1,
              "address_override": 1
            },
            "flow_config": {
              "landing_page_type": "Billing",
              "user_action": "commit"
            }
          };

          let paymentExp = await Package.getPaymentExperienceProfile("Direct Tweak Purchase", paymentExperience, packageObj['accountId']);

          let paymentInfo = {
            'intent': 'sale',
            'payer': {
              'payment_method': 'paypal',
            },
            'redirect_urls': {
              'return_url': 'https://' + baseURL + '/api/PayPal/handlePaymentSuccess' + '/' + packagePurchase.id,
              'cancel_url': 'https://' + baseURL + '/api/PayPal/handlePaymentFailure' + '/' + packagePurchase.id,
            },
            'transactions': [{
              'item_list': {
                'items': [{
                  'name': packageName,
                  'sku': packageId,
                  'price': price,
                  'currency': 'USD',
                  'quantity': 1,
                }],
              },
              'amount': {
                'currency': 'USD',
                'total': price,
              },
              'description': 'Payment for ' + packageName + ' by ' + packageAuthor,
              'invoice_number': packagePurchase.id,
              'notify_url': 'https://' + baseURL + '/api/PayPal/ipn',
              'custom': packagePurchase.id
            }],
            'experience_profile_id': paymentExp.id
          };

          let paypalPayment = await Package.createPaypalPurchase(paymentInfo, packageObj['accountId']);


          packagePurchase = await packagePurchase.updateAttributes({"_json": paypalPayment});
          let chosenLink = null;
          for (let i = 0; i < paypalPayment.links.length; i++) {
            let link = paypalPayment.links[i];
            if (link.method === 'REDIRECT') {
              chosenLink = link.href;
              break;
            }
          }
          if (chosenLink) resolve({
            paymentLink: chosenLink,
            paymentPrice: paypalPayment['transactions'][0]['amount']['total']
          });
        } else {
          reject('Price was not defined for this package');
        }
      } catch(err) {

        reject(err);
      }
    });
  };

  Package.prototype.purchase = function(ctx, cb) {
    const isPaid = this.isPaid;
    if (!isPaid) {
      // let errReturn = new Error("You can't pay for a free package.");
      // errReturn.status = 400;
      return cb(null,{'paymentLink': 'https://' + baseURL + '/package/' + this.identifier + '/'});
    }

    let userId = ctx.req ? (ctx.req.accessToken ? ctx.req.accessToken.userId : "") : null;
    if (!userId) {
      return cb(null,{'paymentLink': 'https://' + baseURL + '/login?next=' + '/api/packages/' + this.id + '/purchase/paypal' });
    }

    const packageName = this.name;
    const packageId = this.id;
    const packageAuthor = this.author;

    Package.app.models.PackagePurchase.findOne({
      where: {
        packageId: packageId,
        accountId: userId,
        status: {neq: 'Unknown'}
      }
    }, function(err, foundPurchase) {
      if (err) {
        return cb(null,{'paymentLink': 'https://' + baseURL + '/login?next=' + '/account/' });
      } else {
        if (foundPurchase) {
          return cb(null,{'paymentLink': 'https://' + baseURL + '/login?next=' + '/account/' });
        } else {
          Package.createPurchase({
            packageId: packageId,
            packageName: packageName,
            packageAuthor: packageAuthor,
            userId: userId,
          }).then((paymentData) => {
            return cb(null,paymentData);
          }).catch((err) => {
            console.log(err);
            let errReturn = new Error('Err Happened');
            errReturn.status = 400;
            return cb(errReturn);
          });
        }
      }
    });
  };

  Package.getLatestVersion = (packageObject) => {
    return new Promise(async (resolve, reject) => {
      // resolve(x);
      try {
        let packageVersions = await Package.app.models.PackageVersion.find({
          where: {
            packageId: packageObject.id,
            visible: true
          },
          fields: {
            downloadCount: false
          }
        });
        let latestVersion = null;
        if (packageVersions && packageVersions.length > 1) {
          packageVersions.sort((a, b) => {
            return debian_compare(b['version'], a['version']);
          });
        }
        if (packageVersions && packageVersions.length > 0) {
          latestVersion = packageVersions[0];
          if (latestVersion) {
            let latestVersionFull = await Package.app.models.PackageVersion.findById(latestVersion.id);
            resolve(latestVersionFull);
          } else {
            resolve(null);
          }
        }
      } catch (err) {
        console.log(err);
        resolve(null)
      }
    });
  };


  Package.updateLatestVersion = async (packageId) => {
    try {
      packageId = String(packageId);
      let packageObj = await Package.findById(packageId);
      let packageData = packageObj;
      if (packageData.toJSON) packageData = packageData.toJSON();
      let latestVersion = await Package.getLatestVersion(packageData);

      packageObj = await packageObj.updateAttribute("latestVersionId", latestVersion.id);
      return Promise.resolve('success');
    } catch (err) {
      return Promise.reject(err);
    }
  };

  Package.rotateImageToPortraitWithBuffer = (bufferData) => {
    let promiseObj = new Promise((resolve, reject) => {
      const image = sharp(bufferData);
      image.metadata().then((metadata) => {
        return image.rotate(
          metadata.width > metadata.height  ? 90 : 0
        ).toFormat('jpeg').toBuffer();
      }).then((data) => {
        resolve(data);
        // data contains a WebP image half the width and height of the original JPEG
      });
    });

    return promiseObj;
  };

  Package.resizeImageToWidthWithBuffer = (maxWidth, bufferData) => {
    let promiseObj = new Promise((resolve, reject) => {
      const image = sharp(bufferData);
      image.resize(maxWidth, 1)
        .min()
        .toFormat('jpeg')
        .toBuffer()
        .then((data) => {
          resolve(data);
          // outputBuffer contains JPEG image data no wider than 200 pixels and no higher
          // than 200 pixels regardless of the inputBuffer image dimensions
        });
    });

    return promiseObj;
  };


  Package.imageDataForBuffer = (bufferData, sizeKey) => {
    let promiseObj = new Promise((resolve, reject) => {
      const image = sharp(bufferData);
      image.metadata().then((metadata) => {
        resolve({
          width: metadata.width,
          height: metadata.height,
          data: bufferData,
          sizeKey: sizeKey
        })
      })
    });
    return promiseObj;
  };

  Package.uploadImageBufferToContainer = async (bufferData) => {
    let promiseObj = new Promise(async (resolve, reject) => {
      let imageStream = await bufferToStream(bufferData);
      let uploadOptions = {
        'filename': uuidV4() + '.jpg',
        'mimetype': 'image/jpeg'
      };

      Package.app.models.Container.uploadStream(
        SCREENSHOTS_CONTAINER_NAME,
        imageStream,
        uploadOptions,async (err, fileObj) => {
          if (err) {
            console.log(err);
            reject();
          } else {
            resolve(fileObj);
          }
        });
    });
    return promiseObj;
  };

  Package.uploadImageDataScreenshot = async (imageData, screenshotId) => {
    //let promiseObj = new Promise(async (resolve, reject) => {
    try {
      let uploadFileInfo = await Package.uploadImageBufferToContainer(imageData['data']);
      let screenshotFile = await Package.app.models.PackageScreenshotFile.create({
        width: imageData['width'],
        height: imageData['height'],
        fileId: uploadFileInfo._id,
        screenshotId: screenshotId,
        sizeKey: imageData['sizeKey']
      });
      if (screenshotFile) return screenshotFile;
      else return Promise.reject(unauthorizedErrorDict);
    } catch (err) {
      return Promise.reject(err)
    }
   // return promiseObj;
  };

  Package.createScreenshot = async (packageId) => {

    try {
      let packageScreenshot = await Package.app.models.PackageScreenshot.create({
        packageId: packageId
      });
      if (packageScreenshot) return packageScreenshot;
      else return Promise.reject('err');
    } catch (err) {
      return Promise.reject(err);
    }
  };

  Package.uploadScreenshotSizes = async (screenshots, packageId) => {
    //let promiseObj = new Promise(async (resolve, reject) => {
    try {
      let packageScreenshot = await Package.createScreenshot(packageId);
      let screenshotId = packageScreenshot.id;

      let screenshotFiles = [];
      for (let screenshotData of screenshots) {
        screenshotFiles.push(await Package.uploadImageDataScreenshot(screenshotData, screenshotId));
      }

      let sizesObj = {};

      for (let screenshotFile of screenshotFiles) {
        sizesObj[screenshotFile['sizeKey']] = screenshotFile.toJSON();
        delete sizesObj[screenshotFile['sizeKey']]['sizeKey'];
        delete sizesObj[screenshotFile['sizeKey']]['screenshotId'];
        delete sizesObj[screenshotFile['sizeKey']]['id'];
        delete sizesObj[screenshotFile['sizeKey']]['createdOn'];
        delete sizesObj[screenshotFile['sizeKey']]['updatedOn'];
      }

      packageScreenshot = await packageScreenshot.updateAttribute('sizes', sizesObj);
      if (packageScreenshot) return packageScreenshot;
      else return Promise.reject('err');
    } catch (err) {
      return Promise.reject(err);
    }
  };

  Package.updateScreenshotsProp = async (packageIdValue) => {
    //let promiseObj = new Promise(async (resolve, reject) => {
      let screenshots = await Package.app.models.PackageScreenshot.find({
          where: {
            packageId: String(packageIdValue)
          },
          fields: {
            id: true,
            sizes: true
          }
      });

      let packageObj = await Package.findById(packageIdValue);
      packageObj = await packageObj.updateAttribute('screenshots', screenshots);
      if (packageObj) return packageObj;
      else return Promise.reject();
    //});

   // return promiseObj;
  };

  Package.prototype.uploadScreenshot = function(ctx, options, cb) {
    let packageObj = this;
    let packageObjJSON = packageObj.toJSON();

    let accountId = ctx.req.accessToken ? ctx.req.accessToken.userId : null;
    if (!accountId) return cb(unauthorizedErrorDict);
    if (String(accountId) !== String(packageObjJSON['accountId'])) return cb(unauthorizedErrorDict);

    let packageId = packageObjJSON.id;

    let formObj = new multiparty.Form();

    formObj.on('error', (err) => {
      console.log('Error parsing form: ' + err.stack);
    });

    formObj.on('part', (part) => {
      if (part.filename) {
        part.pipe(concat(async (bufferData) => {
          let imageSizes = [];

          const rotatedImageBuffer = await Package.rotateImageToPortraitWithBuffer(bufferData);
          imageSizes.push(await Package.imageDataForBuffer(rotatedImageBuffer, 'full'));
          imageSizes.push(await Package.imageDataForBuffer(await Package.resizeImageToWidthWithBuffer(132, rotatedImageBuffer), 'thumbnail'));
          imageSizes.push(await Package.imageDataForBuffer(await Package.resizeImageToWidthWithBuffer(250, rotatedImageBuffer), 'medium'));
          imageSizes.push(await Package.imageDataForBuffer(await Package.resizeImageToWidthWithBuffer(414, rotatedImageBuffer), 'large'));

          let screenshot = await Package.uploadScreenshotSizes(imageSizes, packageId);

          let updatedPackage = await Package.updateScreenshotsProp(packageId);
          if (updatedPackage) {
            cb(null, updatedPackage);
          }
          // cb(null, updatedPackage);
        }));
      } else {
        part.resume();
      }
    });

    formObj.on('close', async () => {
    });

    formObj.parse(ctx.req);
  };
  //
  // Package.computeLatestVersion = async function(packageObject){
  //   // return null;
  //  var latestVersion = await Package.getLatestVersion(packageObject);
  //  return latestVersion;
  // };

  Package.remoteMethod(
    'purchase', {
      isStatic: false,
      description: 'Redirects the user to purchase the package',
      accepts: [{
        arg: 'ctx',
        type: 'object',
        http: {
          source: 'context'
        }
      }],
      http: {
        verb: 'get'
      }
    }
  );

  Package.prototype.purchasePayPal = function(ctx) {
    let identifier = this.identifier;
    this.purchase(ctx, function(err, data) {
      if (data) {
        ctx.res.status(301).redirect(data['paymentLink']);
        // ctx.res.redirect(data['paymentLink']);
      } else {
        ctx.res.redirect('/package/' + identifier + '/');
      }
    })
  };

  Package.remoteMethod(
    'purchasePayPal', {
      isStatic: false,
      description: 'Redirects the user to purchase the package',
      accepts: [{
        arg: 'ctx',
        type: 'object',
        http: {
          source: 'context'
        }
      }],
      http: {
        verb: 'get',
        path: '/purchase/paypal'
      }
    }
  );

  Package.getReviewInfo = async (packageId, req) => {
    // return new Promise(async (resolve, reject) => {
      try {
        const clientInfo = await clientInfoForRequest(req,false,false);

        let packageObj = await Package.findOne({
          where: {
            identifier: packageId
          },
          include: ['latestVersion']
        });

        // let packageData = packageObj;
        // if (packageData.toJSON) {
        //   packageData = packageObj.toJSON();
        // }

        const data = {
          packageId: packageObj.id,
          packageVersionId: packageObj['latestVersionId'],
          clientIp: clientInfo['ip'],
          clientType: clientInfo['type'],
        };

        let oObj = await Package.app.models.PackageVersionRating.find({
          where: {
            packageId: packageObj.id,
            packageVersionId: packageObj['latestVersionId'],
          }
        });

        const promises = [
          Package.app.models.PackageVersionReview.findOne({
            where: data
          }),
          Package.app.models.PackageVersionRating.findOne({
            where: data
          })
        ];

        let promiseResults = await Promise.all(promises);

        let packageData = packageObj;
        if (packageData.toJSON) {
          packageData = packageObj.toJSON();
        }

        let reviewObj = promiseResults[0];
        let ratingObj = promiseResults[1];

        let reviewData = reviewObj;
        if (reviewData && reviewData.toJSON) {
          reviewData = reviewData.toJSON();
        }

        if (reviewData) {
          delete reviewData['clientIp'];
        }

        let ratingData = ratingObj;
        if (ratingData && ratingData.toJSON) {
          ratingData = ratingData.toJSON();
        }

        if (ratingData) {
          delete ratingData['clientIp'];
        }

        return {
          reviewData: reviewData,
          packageData: packageData,
          ratingData: ratingData
        };
      } catch (err) {
        return Promise.reject(err);
      }
    // });
  };


  Package.writeReview = function(req, id, cb) {
    Package.getReviewInfo(id, req).then((result) => {
      return cb(null,result);
    }).catch((err) => {
      return cb(err);
    });
};

  Package.observe('after save', function(ctx, next) {
    next();
    Package.reload();
  });

  Package.afterRemote('prototype.patchAttributes', function(ctx, data, next) {
    Package.updateLatestVersion(ctx.result.id).then((result) => {
      console.log(result);
    }).catch((err) => {
      console.log(err);
    });
    return next();
  });

  Package.remoteMethod(
    'writeReview', {
      description: 'Gets Review Posting Information for Package',
      accepts: [
        {arg: 'req', type: 'object', http: {source: 'req'}},
        {arg: 'id', type: 'string', http: { source: 'query' } }
      ],
      returns: {
        type: 'object', root: true
      },
      http: {path:'/writeReview', verb: 'get'}
    }
  );

  Package.remoteMethod(
    'upload', {
      description: 'Uploads a Debian Package to the Repository',
      accepts: [{
        arg: 'ctx',
        type: 'object',
        http: {
          source: 'context'
        }
      }, {
        arg: 'options',
        type: 'object',
        http: {
          source: 'query'
        }
      }],
      returns: {
        arg: 'fileObject',
        type: 'object',
        root: true
      },
      http: {
        verb: 'post'
      }
    }
  );

  Package.remoteMethod(
    'uploadScreenshot', {
      isStatic: false,
      description: 'Uploads a Screen Shot for the Package',
      accepts: [{
        arg: 'ctx',
        type: 'object',
        http: {
          source: 'context'
        }
      }, {
        arg: 'options',
        type: 'object',
        http: {
          source: 'query'
        }
      }],
      returns: {
        arg: 'fileObject',
        type: 'object',
        root: true
      },
      http: {
        verb: 'post',
        path: '/screenshots/upload'
      }
    }
  );

  Package.prototype.generateCoupon = function(req, cb) {
    let accountId = req.accessToken ? req.accessToken.userId : null;
    if (!accountId) return cb(unauthorizedErrorDict);
    accountId = String(accountId);
    if (accountId !== String(this.accountId)) return cb(unauthorizedErrorDict);


    Package.app.models.PackageCouponCode.create({
      packageId: this.id,
      type: 'full'
    }, function(err, coupon) {
      if (err) {
        console.log(err);
        return cb(err);
      } else {
        return cb(null, coupon);
      }
    })
  };

  Package.remoteMethod(
    'generateCoupon', {
      isStatic: false,
      description: 'Gets Review Posting Information for Package',
      accepts: [
        {arg: 'req', type: 'object', http: {source: 'req'}},
      ],
      returns: {
        type: 'object', root: true
      },
      http: {path:'/generateCoupon', verb: 'get'}
    }
  );

  Package.giftToEmail = async (email, packageId, packageName, emailTransporter) => {
    let coupon = await Package.app.models.PackageCouponCode.create({
      type: 'full',
      packageId: packageId,
      extraInfo: email
    });

    let mailOptions = {
      from: '"' + SMTP_NAME + '" <' + SMTP_EMAIL+ '>', // sender address
      to: email, // list of receivers
      subject: 'Gift - ' + packageName
    };


    let textBody = "You have been gifted a copy of " + packageName + " by " + SMTP_NAME + ". You can redeem your gift at this link: ";
    textBody += "https://" + baseURL + '/api/PackageCouponCodes/' + coupon.id + '/redeem';


    let htmlBody = `<div style="background-color: #f4f4f4; min-font-size: 15px; text-align: center; font-weight: 500; margin: 9px auto; width: 100%; font-size: 15px;  font-family: 'SF Pro Display','SF Pro Icons','Helvetica Neue','Helvetica','Arial',sans-serif; padding-bottom: 30px; padding-top: 30px">
  <div style="display:block; margin:auto; border:0; margin-top:9px; margin-bottom:28px; width:100%; max-width: 414px;">
<!--     <panel-header style='text-align:center; margin: 12px; padding: 8px 16px 0px 20px; font-size: 24px; font-family: "SF Pro Display","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif; margin-bottom: 13px; padding-left: 14px; color: #111'>
      <label style="font-weight: 800 !important">Congratulations!</label>
    </panel-header> -->
    <div style="margin-left: 14px; margin-right:14px; background-color:white; border-radius:15px; overflow:hidden; display:block; padding: 15px 20px; box-shadow: 2px 2px 40px -12px #999; font-size: 15px; color: #666; text-align: center;">
      <h3 style="color: black; font-size: 24px; font-weight: 900; font-family: 'SF Pro Display','SF Pro Icons','Helvetica Neue','Helvetica','Arial',sans-serif; letter-spacing:0.5px;">You've received a gift.</h3>
      <p style="font-size: 18px; font-weight: 700;">Congratulations!</p>
      <p style="width:70%; margin:auto; font-size: 16px; line-height:1.5;">You have been gifted a complimentary copy of <strong>` + packageName + `</strong></p>
      <br>
      <p style="width:70%; margin:auto; font-size: 16px; line-height:1.5;">Simply setup your Packix account to redeem your gift.</p>
    
      <div class="link-button" style="width: 60%;  margin: auto; padding: 12px 0px; border-radius: 10px; overflow: hidden; margin-top:20px; background: linear-gradient(270deg, #16da82, #29a56d) !important; font-size: 16px; font-weight: 700; letter-spacing: 0.5px; text-align: center;">
        <a style="padding-top: 0px; text-decoration: none !important;" class="link-device" href="`+
      "https://" + baseURL + '/api/PackageCouponCodes/' + coupon.id + '/redeem' + `">
            <label style="color: white !important">Redeem</label>
          </a>
      </div>
    </div>
  </div>
</div>`;

    // let htmlBody = "You have been gifted a copy of <b>" + packageName + "</b> by <b>" + SMTP_NAME + "</b>. You can redeem your gift at this <a href=\"";
    // htmlBody += "https://" + baseURL + '/api/PackageCouponCodes/' + coupon.id + '/redeem';
    // htmlBody += "\">here</a>";

    mailOptions.html = htmlBody;
    mailOptions.text = textBody;

      let result = await emailTransporter.sendMail(mailOptions);
      // if (result.toJSON) console.log(result.toJSON());
      // else console.log(result);
      return result;
  };


  Package.giftEmailsAsync = async (packageId, emails) => {
    return new Promise(async (resolve, reject) => {
      try {

        let packageObj = await Package.findById(packageId);
        let emailTransporter = nodemailer.createTransport(
          nodemailerSendgrid({
            apiKey: process.env.SENDGRID_API_KEY
          })
        );

        for (let email of emails) {
          let result = await Package.giftToEmail(email, packageId, packageObj['name'], emailTransporter);
          //console.log(result);
        }
        return resolve('success');
      } catch (err) {
        return reject(err);
      }
    });
  };

  Package.prototype.giftToEmails = function(req,emails, cb) {
    let packageId = this.id;
    Package.giftEmailsAsync(packageId, emails).then((result) => {
      //console.log(result);
      cb(null, "success");
    }).catch((error) => {
      console.log(error);
      cb(error);
    });
  };

  Package.remoteMethod(
    'giftToEmails',
    {
      isStatic: false,
      accepts: [
        {arg: 'req', type: 'object', http: {source: 'req'}},
        {arg: 'emails', type: 'array'},
      ],
      http: {path:'/giftToEmails', verb: 'post'},
      returns: {type: 'any', root: true}
    }
  );

  Package.filterResult = async (ctx) => {
    try {
      let accountId = ctx.req.accessToken ? ctx.req.accessToken.userId : "";
      accountId = String(accountId);
      let isAdmin = Package.app.models.Account.isAdmin(accountId);
      // if (isAdmin === true) return Promise.resolve(ctx.result);
      if (Array.isArray(ctx.result)) {
        let newResults = [];
        for (let packageObj of ctx.result) {
          if (packageObj.visible || (accountId && String(packageObj.accountId) === accountId) || isAdmin === true) {
            newResults.push(packageObj);
          }
        }
        return Promise.resolve(newResults);
      } else {
        let tempResult = ctx.result;
        if (ctx.result.toJSON) tempResult = ctx.result.toJSON();
        if (tempResult['visible'] || (accountId && String(tempResult['accountId']) === accountId) || isAdmin === true) return Promise.resolve(ctx.result);
        return Promise.resolve(null);
      }
    } catch (err) {
      return Promise.reject(err);
    }
  };

  Package.findAfterRemote = function (ctx, user, next) {
    //console.log(JSON.stringify(ctx.args));
    if(ctx.result) {
      Package.filterResult(ctx).then((result) => {
        if (result !== null) {
          ctx.result = result;
          return next();
        } else {
          ctx.result = null;
          return next();
        }
      }).catch((err) => {
        ctx.result = null;
        return next();
      });
    } else return next();
  };

  Package.afterRemote('find', Package.findAfterRemote);
  Package.afterRemote('findById', Package.findAfterRemote);
  Package.afterRemote('findOne', Package.findAfterRemote);

  Package.developerPackages = function (req, cb) {
    let accountId = req.accessToken ? req.accessToken.userId : "";
    if (!accountId) return cb(null, []);
    Package.app.models.Account.isAdmin(accountId).then((isAdmin) => {
      if (isAdmin === true) {
        Package.find({
          include: ['downloadRestrictions']
        }, (err, packages) => {
          if (err) {
            console.log(err);
            return cb(null, []);
          } else if (!packages) cb(null, []);
          else cb(null, packages);
        });
      } else {
        Package.find({
          where: {
            accountId: accountId
          },
          include: ['downloadRestrictions']
        }, (err, packages) => {
          if (err) {
            console.log(err);
            return cb(null, []);
          } else if (!packages) cb(null, []);
          else cb(null, packages);
        });
      }
    }).catch((err) => {
      cb(null, []);
    });
  };

  Package.remoteMethod(
    'developerPackages',
    {
      accepts: [
        {arg: 'req', type: 'object', http: {source: 'req'}}
      ],
      http: {path:'/developerPackages', verb: 'get'},
      returns: {type: 'any', root: true}
    }
  );


  Package.transferPackageIds = async (oldId, newId) => {
    try {
      oldId = String(oldId);
      newId = String(newId);
      let versionResult = await Package.app.models.PackageVersion.updateAll({
        packageId: oldId
      }, {
        packageId: newId
      });

      console.log(versionResult);

      let reviewsResult = await Package.app.models.PackageVersionReview.updateAll({
        packageId: oldId
      }, {
        packageId: newId
      });

      console.log(reviewsResult);

      let ratingsResult = await Package.app.models.PackageVersionRating.updateAll({
        packageId: oldId
      }, {
        packageId: newId
      });

      console.log(ratingsResult);

      let purchasesResult = await Package.app.models.PackagePurchase.updateAll({
        packageId: oldId
      }, {
        packageId: newId
      });

      console.log(purchasesResult);

      let giftsResult = await Package.app.models.PackageGiftLink.updateAll({
        packageId: oldId
      }, {
        packageId: newId
      });

      let refundResults = await Package.app.models.PackageRefundRequest.updateAll({
        packageId: oldId
      }, {
        packageId: newId
      });

      let screenshotResults = await Package.app.models.PackageScreenshot.updateAll({
        packageId: oldId
      }, {
        packageId: newId
      });

      let couponResults = await Package.app.models.PackageCouponCode.updateAll({
        packageId: oldId
      }, {
        packageId: newId
      });

      let restrictionResults = await Package.app.models.PackageDownloadRestriction.updateAll({
        packageId: oldId
      }, {
        packageId: newId
      });

      return Promise.resolve("success");
    } catch (err) {
      console.log(err);
      return Promise.resolve("failure");
    }
  };

  Package.getPurchaseStats = async (packageId) => {
    let purchaseStats = {
      last24Hours: {
        count: 0,
        total: 0
      },
      lastWeek: {
        count: 0,
        total: 0
      },
      lastMonth: {
        count: 0,
        total: 0
      },
      last3Months: {
        count: 0,
        total: 0
      }
    };

    try {
      console.log("Purchase Stats Package ID: " + packageId);
      let threeMonthsBeforeDate = dateMath.day.shift(Date.now(), -90).getTime();
      let oneMonthBeforeDate = dateMath.day.shift(Date.now(), -30).getTime();
      let oneWeekBefore = dateMath.day.shift(Date.now(), -7).getTime();
      let last24Hours = dateMath.hour.shift(Date.now(), -24).getTime();

      console.log("Month Before Date: " + oneMonthBeforeDate);

      let purchases = await Package.app.models.PackagePurchase.find({
        where: {
          packageId: String(packageId),
          createdOn: {
            gt: threeMonthsBeforeDate
          },
          status: 'Completed'
        }
      });

     // console.log('Purchases: ' + purchases);

      for (let purchaseObj of purchases) {
        let purchaseDate = new Date(purchaseObj.createdOn).getTime();
        console.log('Purchase Date: ' + purchaseDate);
        let purchaseAmount = parseFloat(purchaseObj.details.amount.value) - parseFloat(purchaseObj.details.feeAmount);

        purchaseStats.last3Months.count += 1;
        purchaseStats.last3Months.total += purchaseAmount;

        if (purchaseDate >= last24Hours) {
          purchaseStats.last24Hours.count += 1;
          purchaseStats.last24Hours.total += purchaseAmount;
        }

        if (purchaseDate >= oneWeekBefore) {
          purchaseStats.lastWeek.count += 1;
          purchaseStats.lastWeek.total += purchaseAmount;
        }

        if (purchaseDate >= oneMonthBeforeDate) {
          purchaseStats.lastMonth.count += 1;
          purchaseStats.lastMonth.total += purchaseAmount;
        }
      }
    } catch (err) {
      console.log(err);
    }

    return Promise.resolve(purchaseStats);
  };

  Package.prototype.purchaseStats = function (req, cb) {
    Package.getPurchaseStats(this.id).then((data) => {
      cb(null,data);
    }).catch((err) => {
      console.log(err);
      cb(null, {});
    });
  };


  Package.remoteMethod(
    'purchaseStats',
    {
      isStatic: false,
      accepts: [
        {arg: 'req', type: 'object', http: {source: 'req'}}
      ],
      http: {path:'/purchaseStats', verb: 'get'},
      returns: {type: 'any', root: true}
    }
  );


  Package.giftToPatreonsAsync = async (packageId, pledgeAmount, useHistoricalAmount) => {
    return new Promise(async (resolve, reject) => {
      try {
        let packageObj = await Package.findById(String(packageId));
        let packageData = packageObj;
        let giftEmails = [];
        if (packageData.toJSON) packageData = packageData.toJSON();
        let devPrefs = await Package.app.models.DeveloperPreferences.findOne({
          where: {
            accountId: String(packageData['accountId'])
          }
        });

        if (devPrefs) {
          if (devPrefs.toJSON) devPrefs = devPrefs.toJSON();
          let patreonUsers = await Package.app.models.PatreonUser.getPatreonUsersInfoAsync(String(devPrefs.patreonAccessToken), String(packageData['accountId']), true);
          for (let patreonUser of patreonUsers) {
            if (useHistoricalAmount && patreonUser['historicalPledgeAmount'] < pledgeAmount) continue;
            if (!useHistoricalAmount && (patreonUser['pledgeAmount'] < pledgeAmount || patreonUser['pledgePaused'] === true)) continue;
            let identity = await Package.app.models.AccountIdentity.findOne({
              where: {
                externalId: String(patreonUser['patreonId'])
              },
              include: ['user']
            });

            if (identity) {
              if (identity.toJSON) identity = identity.toJSON();
              let accountId = String(identity.userId);
              let existingCount = await Package.app.models.PackageGiftLink.count({
                accountId: accountId,
                packageId: String(packageData.id)
              });
              if (existingCount > 0) continue;
              let purchaseCount = Package.app.models.PackagePurchase.count({
                accountId: accountId,
                packageId: String(packageData.id),
                status: 'Completed'
              });

              if (purchaseCount > 0) continue;

              let giftLink = await Package.app.models.PackageGiftLink.findOrCreate({
                where: {
                  accountId: accountId,
                  packageId: String(packageData.id)
                }
              }, {
                accountId: accountId,
                packageId: String(packageData.id)
              });

            } else {
              giftEmails.push(String(patreonUser.userEmail));
            }
          }

          let emailsSent = await Package.giftEmailsAsync(String(packageData.id), giftEmails);
        }
        return resolve('success');
      } catch (err) {
        console.log(err);
        return reject(err);
      }
    });
  };

  Package.prototype.giftToPatreons = function(options, ctx, cb) {
    let useHistoricalAmount = options['useHistoricalAmount'];
    let pledgeAmount = options['pledgeAmount'];
    let packageId = String(this.id);
    Package.giftToPatreonsAsync(packageId, pledgeAmount, useHistoricalAmount).then((data) => {
      return cb(null, {
        message: 'success'
      });
    }).catch((err) => {
      return cb(err);
    });
  };

  Package.remoteMethod(
    'giftToPatreons', {
      isStatic: false,
      description: 'Gift package to patreon\'s based on certain criteria',
      accepts: [
        {arg: 'options', type: 'object'},
        {arg: 'ctx', type: 'object', http: { source: 'context' }},
      ],
      returns: {type: 'any', root: true},
      http: {path: '/giftToPatreons', verb: 'post'}
    }
  );

  // Package.observe('access', (ctx, next) => {
  //   console.log("access Hook");
  //   console.log(ctx.options);
  //
  //   if (ctx.options == {}) {
  //     console.log("options empty");
  //     console.log(ctx.data);
  //     console.log(ctx.query);
  //   }
  //   console.log(ctx.args);
  //   console.log("hook state");
  //   console.log(ctx.hookState);
  //   //console.log(ctx);
  //   //console.log(ctx);
  //   return next();
  // });

  disableAllMethods(Package, []);
};
