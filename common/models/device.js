'use strict';

const deviceNames = require('./../../server/assets/deviceStrings.json');
const crypto = require('crypto');

const clientVersionHeaderNames = ['X-Firmware','x-firmware', 'HTTP_X_FIRMWARE'];
const clientVersionForHeaders = function(headers, needsVersion) {
  for (let headerName of clientVersionHeaderNames) {
    if (headers[headerName] && headers[headerName].length > 0) {
      return headers[headerName].toLowerCase();
    }
  }
  if (needsVersion) {
    return null;
  } else {
    return 'UNKNOWN';
  }
  // return Promise.reject(new Error('Client Version Not Defined in Request Headers'));
};

const clientTypeHeaderNames = ['X-Machine','x-machine', 'HTTP_X_MACHINE'];

const clientTypeForHeaders = function(headers) {
  for (let headerName of clientTypeHeaderNames) {
    if (headers.hasOwnProperty(headerName) && headers[headerName].length > 0) {
      return headers[headerName];
    }
  }
  return null
};

module.exports = function(Device) {
  Device.getModelName = async (deviceObj) => {
    if (deviceObj['deviceModel']) {
      return deviceNames[deviceObj['deviceModel'].toLowerCase()];
    }
    return "Unknown";
  };

  Device.linkDevice = async (req) => {
      try {
        let udid = req.headers['HTTP_X_UNIQUE_ID'];
        if (!udid || udid.length < 1) {
          udid = req.headers['x-unique-id'];
        }

        if (!udid || udid.length < 1) {
          udid = req.headers['X-Unique-ID'];
        }

        if (!udid || udid.length < 1) {
          udid = req.headers['X-Unique-Id'];
        }

        if (!udid || udid.length < 1) return true;
        // console.log('Got UDID: ');
        udid = crypto.createHash('sha256').update(udid.toLowerCase()).digest('base64');
        // console.log(udid);
        let ip = req.headers['x-forwarded-for'];
        if (!ip || ip.length < 1) ip = req.connection.remoteAddress;
        if (!ip || ip.length < 1) ip = req.headers['x-real-ip'];
        if (!ip || ip.length < 1) return true;
       // console.log('LINK IP REAL: ' + ip);
        ip = crypto.createHash('sha256').update(ip).digest('base64');
        let deviceModel = clientTypeForHeaders(req.headers);
        if (!deviceModel) return true;

       // console.log('LINK IP HASH: ' + ip);
       // console.log('LINK DEVICE MODEL: ' + deviceModel);

        let nonceObject = await Device.app.models.DeviceLinkNonce.findOne({
          where: {
            ip: ip,
            deviceModel: deviceModel
          }
        });


        if (!nonceObject) return true;
       // console.log('Got Nonce Object');
       // console.log(nonceObject);
        if (nonceObject.toJSON) nonceObject = nonceObject.toJSON();
        await Device.app.models.DeviceLinkNonce.destroyAll({ip: ip, deviceModel: deviceModel});


        let deviceVersion = clientVersionForHeaders(req.headers, false);

        let deviceCount = await Device.count({
          accountId: nonceObject.accountId,
          udid: {neq: udid}
        });

        if (deviceCount >= 5) return true;

        let deviceInfo = await Device.findOrCreate({
          where: {
            udid: udid,
            accountId: nonceObject.accountId
          }
        }, {
          udid: udid,
          deviceModel: deviceModel,
          deviceVersion: deviceVersion,
          accountId: nonceObject.accountId
        });

        let wasCreated = deviceInfo[1];
        let device = deviceInfo[0];
        //console.log('wasCreated: ' + wasCreated ? 'YES' : 'NO');

        //if (wasCreated) return true;
        // device = await device.updateAttribute('accountId', String(nonceObject.accountId));
        return true;
      } catch (err) {
        return Promise.reject(err);
      }
  }
};
