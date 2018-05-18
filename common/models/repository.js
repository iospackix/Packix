'use strict';

const patreonAPI = require('patreon').patreon;
const jsonApiURL = require('patreon').jsonApiURL;
const crypto = require('crypto');
const pm2 = require('pm2');
const path = require('path');
const fs = require('fs');
const JsonApiDataStore = require('jsonapi-datastore').JsonApiDataStore;
const request = require('request');


module.exports = function(Repository) {

  // let autoMigrate = require('loopback-component-auto-migrate/lib/auto-migrate');
  // autoMigrate(Repository.app, {"migration": "auto-migrate"}).then(() => {
  //   console.log("I FINISHED MIGRATION");
  // });

  Repository.automig = function(app) {
    let autoMigrate = require('loopback-component-auto-migrate/lib/auto-migrate');
    console.log('Migrating');
    autoMigrate(app, {"migration": "auto-migrate"}).then(() => {
      console.log("I FINISHED MIGRATION");
    });
  };

  Repository.getPatreonInfoAsync = async (req) => {
    try {
      const accountId = req.accessToken ? req.accessToken.userId : null;
      if (!accountId) return Promise.resolve([]);

      let devSettings = await Repository.app.models.DeveloperPreferences.findOne({
        where: {
          accountId: String(accountId)
        }
      });

      if (!devSettings) return Promise.resolve([]);
      if (devSettings.toJSON) devSettings = devSettings.toJSON();
      if (devSettings.usePatreon === false || !devSettings.patreonAccessToken || devSettings.patreonAccessToken.length < 1) {
        return Promise.resolve([]);
      }
      let allRewards = [];
      const patreonAPIClient = patreonAPI(String(devSettings.patreonAccessToken));
      const url = jsonApiURL('/current_user/campaigns?include=rewards,creator');

      let results = await patreonAPIClient(url);
      let store = results['store'];

      let camps = store.findAll('campaign');

      let finalCamps = [];
      for (let camp of camps) {
        let campS = camp.serialize();
        let campInfo = {
          id: campS['data']['id'],
          name: campS['data']['attributes']['creation_name'],
          rewards: []
        };

        let rewardsInfo = [];
        let rewardsA = camp.rewards;
        for (let reward of rewardsA) {
          let rewardS = reward.serialize();
          let rewardId = rewardS['data']['id'];
          if (rewardId !== '-1' && rewardId !== '0') {
            allRewards.push({
              id: rewardS['data']['id'],
              title:  rewardS['data']['attributes']['title'],
              description: rewardS['data']['attributes']['description'],
              amount: rewardS['data']['attributes']['amount'],
              campaign: campS['data']['id']
            })
          }
        }
        finalCamps.push(campInfo);
      }

      allRewards.sort((a, b) => {
        return a['amount'] - b['amount']
      });
      return Promise.resolve(allRewards);
    } catch (err) {
      return Promise.reject(err);
    }
  };

  Repository.getPatreonInfo = function(req, cb) {
    Repository.getPatreonInfoAsync(req).then((data) => {
      return cb(null,data);
    }).catch((err) => {
      return cb(null, {});
    });
  };

  // Repository.getPatreonPledgesForCampignID = function(campId) {
  //   const patreonAPIClient = patreonAPI(process.env['PATREON_CREATOR_ACCESS_TOKEN']);
  //   const url = jsonApiURL('/campaigns/<campaign_id>/pledges?include=patron.null');
  //   https://www.patreon.com/api/oauth2/api/campaigns/<campaign_id>/pledges?include=patron.null
  // }

  Repository.restartBackend = () => {
    pm2.gracefulReload('backend_packix', {
      updateEnv: true
    }, (err, app) => {
      console.log('RESULT: ', err, app);
    });
  };

  Repository.updateSettings = (settingsToUpdate, cb) => {
    // Repository.app.models.DeviceLinkNonce.destroyAll({}).then((result) => {
    //   console.log(result);
    //   Repository.app.models.Device.destroyAll({}).then((result1) => {
    //     console.log(result1);
    //   });
    // });

    // Repository.app.models.DeviceLinkNonce.destroyAll().then((result) => {
    //   console.log(result);
    // });

    // let currentSettings = require(path.resolve(__dirname + '../../../environment.json'));
    // if (currentSettings) {
    //   let serverSettings = currentSettings['backend_packix'];
    //   if (serverSettings) {
    //     let newSettings = Object.assign({}, serverSettings, settingsToUpdate);
    //     currentSettings['backend_packix'] = newSettings;
    //     fs.writeFile(path.resolve(__dirname + '../../../environment.json'), JSON.stringify(currentSettings, null, 2), 'utf-8');
    //     cb(null, currentSettings);
    //     Repository.restartBackend();
    //   } else {
    //     return cb('Couldn\'t Load Server Settings');
    //   }
    // } else {
    //   return cb('Couldn\'t Load Server Settings');
    // }
  };


  Repository.getCurrentSettings = (cb) => {
    // let currentSettings = require(path.resolve(__dirname + '../../../environment.json'));
    // if (currentSettings) {
    //   let serverSettings = currentSettings['backend_packix'];
    //   if (serverSettings) {
    //     return cb(null, serverSettings);
    //   }
    // }
    return cb(500, 'Server Error');
  };

  Repository.remoteMethod(
    'getCurrentSettings', {
      description: 'Gets the Current Repository Settings',
      returns: {type: 'any', root: true},
      http: {path: '/getSettings', verb: 'get'}
    }
  );

  Repository.remoteMethod(
    'updateSettings', {
      description: 'Update the Repository Settings',
      accepts: [
        {arg: 'settingsToUpdate', type: 'object', http: {source: 'body'}},
      ],
      returns: {type: 'any', root: true},
      http: {path: '/updateSettings', verb: 'post'}
    }
  );

  Repository.remoteMethod(
    'getPatreonInfo', {
      description: 'Get Patreon Reward Tiers',
      accepts: [
        {arg: 'req', type: 'object', http: {source: 'req'}}
      ],
      returns: {
        type: 'array', root: true
      },
      http: {path:'/patreonInfo', verb: 'get'}
    }
  );


  Repository.makeUserDeveloperAsync = async (accountId) => {
    try {
      let filter = {accountId: accountId};
      let newObj = {
        accountId: accountId,
        usePatreon: false,
        usePaypal: false
      };
      console.log(filter);
      console.log(newObj);
      let prevCount = await Repository.app.models.DeveloperPreferences.count({
        accountId: accountId
      });
      if (prevCount < 1) {
        await Repository.app.models.DeveloperPreferences.create(newObj);
      }
      return Promise.resolve('success');
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  };

  Repository.makeUserDeveloper = (accountId, req, cb) => {
    Repository.makeUserDeveloperAsync(accountId).then((status) => {
      return cb(null, {status: status});
    }).catch((err) => {
      return cb(err);
    });
  };

  Repository.revokeDeveloperAndRefund = async (accountId) => {
    let packages = await Repository.app.models.Package.find({
      where: {
        accountId: accountId
      },
      include: ['versions']
    });

    for (let packageObj of packages) {
      let purchases = await Repository.app.models.PackagePurchase.find({
        where: {
          packageId: String(packageObj.id)
        }
      });

      for (let purchaseObj of purchases) {
        let resultP = await Repository.app.models.PackagePurchase.refundAsync(purchaseObj.id);
        console.log('Purchase Id: ' + purchaseObj.id + ', Result: ' + resultP);
      }

      let vResult = await Repository.app.models.PackageVersion.destroyAll({
        packageId: String(packageObj.id)
      });

      console.log('version result: ' + vResult);

      let ratingResult = await Repository.app.models.PackageVersionRating.destroyAll({
        packageId: String(packageObj.id)
      });

      console.log('rating result: ' + ratingResult);

      let reviewResult = await Repository.app.models.PackageVersionReview.destroyAll({
        packageId: String(packageObj.id)
      });

      console.log('review result: ' + reviewResult);

      let downloadResult = await Repository.app.models.PackageDownload.destroyAll({
        packageId: String(packageObj.id)
      });

      console.log('download result: ' + downloadResult);

      let restrictionResult = await Repository.app.models.PackageDownloadRestriction.destroyAll({
        packageId: String(packageObj.id)
      });

      console.log('download restriction result: ' + restrictionResult);
    }

    return Promise.resolve('success');
  };

  Repository.revokeUserDeveloper = (accountId, req, cb) => {
    Repository.revokeDeveloperAndRefund(accountId).then((status) => {
      return cb(null, {status: status});
    }).catch((err) => {
      return cb(err);
    });
  };

  Repository.remoteMethod(
    'makeUserDeveloper', {
      description: 'Make a user a developer',
      accepts: [
        {arg: 'accountId', type: 'string', http: { source: 'query' } },
        {arg: 'req', type: 'object', http: {source: 'req'}}
      ],
      returns: {type: 'any', root: true},
      http: {path: '/makeDeveloper', verb: 'post'}
    }
  );

  Repository.remoteMethod(
    'revokeUserDeveloper', {
      description: 'Revoke a user a developer',
      accepts: [
        {arg: 'accountId', type: 'string', http: { source: 'query' } },
        {arg: 'req', type: 'object', http: {source: 'req'}}
      ],
      returns: {type: 'any', root: true},
      http: {path: '/revokeUserDeveloper', verb: 'post'}
    }
  );
};
