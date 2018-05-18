'use strict';

const disableAllMethods = require('../utils/disableAllMethods');

const unauthorizedErrorDict = {
  name: 'Unauthorized',
  status: 401,
  message: 'You are not authorized to perform this action'
};

module.exports = function(Developerinfo) {

  Developerinfo.updateSettings = function (settingsUpdate, req, cb) {
    let accountId = req.accessToken ? req.accessToken.userId : null;
    if (!accountId) return cb(unauthorizedErrorDict);
    Developerinfo.findOne({
      where: {
        accountId: accountId
      }
    }, function(err, prefsObj) {
      if (err) return cb(err);
      if (!prefsObj) return cb(unauthorizedErrorDict);
      prefsObj.updateAttributes(settingsUpdate, function(err, prefsObjNew) {
        if (err) return cb(err);
        if (!prefsObjNew) return cb(unauthorizedErrorDict);
        return cb(null, prefsObjNew);
      });
    });
  };


  Developerinfo.getSettings = function (req, cb) {
    console.log('Get Settings was Called');
    let accountId = req.accessToken ? req.accessToken.userId : null;
    console.log('Account ID for Developer Settings: ' + accountId);
    console.log('Settings for AccountID: ' + accountId);
    if (!accountId) return cb(unauthorizedErrorDict);
    Developerinfo.findOrCreate({
      where: {
        accountId: String(accountId)
      }
    }, {
      accountId: String(accountId)
    }, function(err, prefsObj, created) {
      console.log('Found Results');
      console.log(err);
      console.log(prefsObj);
      if (err) return cb(err);
      if (!prefsObj) return cb(unauthorizedErrorDict);
      return cb(null, prefsObj);
    });
  };

  Developerinfo.remoteMethod(
    'getSettings', {
      description: 'Gets the Current Developer Info',
      accepts: [
        {arg: 'req', type: 'object', http: {source: 'req'}}
      ],
      returns: {type: 'any', root: true},
      http: {path: '/getSettings', verb: 'get'}
    }
  );

  Developerinfo.remoteMethod(
    'updateSettings', {
      description: 'Get the Current Developer Info',
      accepts: [
        {arg: 'settingsUpdate', type: 'object'},
        {arg: 'req', type: 'object', http: {source: 'req'}}
      ],
      returns: {type: 'any', root: true},
      http: {path: '/updateSettings', verb: 'post'}
    }
  );


  disableAllMethods(Developerinfo, []);
};
