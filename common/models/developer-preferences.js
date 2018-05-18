'use strict';

const disableAllMethods = require('../utils/disableAllMethods');
const patreonAPI = require('patreon').patreon;
const jsonApiURL = require('patreon').jsonApiURL;
const JsonApiDataStore = require('jsonapi-datastore').JsonApiDataStore;

const unauthorizedErrorDict = {
  name: 'Unauthorized',
  status: 401,
  message: 'You are not authorized to perform this action'
};



module.exports = function(Developerpreferences) {

  const baseURL = process.env['HOST_URL'];

  const testPayPalPurchaseInfo = {
    'intent': 'sale',
    'payer': {
      'payment_method': 'paypal',
    },
    'redirect_urls': {
      'return_url': 'https://' + baseURL + '/api/PayPal/handlePaymentSuccess' + '/',
      'cancel_url': 'https://' + baseURL + '/api/PayPal/handlePaymentFailure' + '/',
    },
    'transactions': [{
      'item_list': {
        'items': [{
          'name': "PayPal Token Test",
          'sku': "000000",
          'price': "1.00",
          'currency': 'USD',
          'quantity': 1,
        }],
      },
      'amount': {
        'currency': 'USD',
        'total': "1.00",
      },
      'description': 'Payment for ' + "Test Package" + ' by ' + "Packix",
      'invoice_number': "000000",
      'notify_url': 'https://' + baseURL + '/api/PayPal/ipn',
      'custom': "000000"
    }]
  };


  Developerpreferences.updateSettings = function (settingsUpdate, req, cb) {
    // Developerpreferences.app.models.DeviceLinkNonce.destroyAll({}).then((result) => {
    //   console.log(result);
    //   Developerpreferences.app.models.Device.destroyAll({}).then((result1) => {
    //     console.log(result1);
    //   });
    // });
    let accountId = req.accessToken ? req.accessToken.userId : null;
    if (!accountId) return cb(unauthorizedErrorDict);
    Developerpreferences.findOne({
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


  Developerpreferences.getSettings = function (req, cb) {
    console.log('Get Settings was Called');
    let accountId = req.accessToken ? req.accessToken.userId : null;
    console.log('Account ID for Developer Settings: ' + accountId);
    if (!accountId) return cb(unauthorizedErrorDict);
    Developerpreferences.findOne({
      where: {
        accountId: String(accountId)
      }
    }, function(err, prefsObj) {
      console.log('Found Results');
      console.log(err);
      console.log(prefsObj);
      if (err) return cb(err);
      if (!prefsObj) return cb(unauthorizedErrorDict);
      return cb(null, prefsObj);
    });
  };

  Developerpreferences.remoteMethod(
    'getSettings', {
      description: 'Gets the Current Repository Settings',
      accepts: [
        {arg: 'req', type: 'object', http: {source: 'req'}}
      ],
      returns: {type: 'any', root: true},
      http: {path: '/getSettings', verb: 'get'}
    }
  );

  Developerpreferences.remoteMethod(
    'updateSettings', {
      description: 'Update the Repository Settings',
      accepts: [
        {arg: 'settingsUpdate', type: 'object'},
        {arg: 'req', type: 'object', http: {source: 'req'}}
      ],
      returns: {type: 'any', root: true},
      http: {path: '/updateSettings', verb: 'post'}
    }
  );

  Developerpreferences.testPayPalAsync = async (accountId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const paypalThing = require('paypal-rest-sdk');
        let devConfig = await Developerpreferences.app.models.DeveloperPreferences.findOne({
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
        paypalThing.payment.create(testPayPalPurchaseInfo, (err, payment) => {
          if (err) {
            console.log("The Error: ");
            console.log(err.response.details);
            return resolve(false);
          } else {
            let paypalPayment = payment;
            for (let i = 0; i < paypalPayment.links.length; i++) {
              let link = paypalPayment.links[i];
              if (link.method === 'REDIRECT') {
                return resolve(true);
              }
            }
            return resolve(false);
          }
        })
      } catch (err) {
        return resolve(false);
      }
    });
  };


  Developerpreferences.testPayPal = function (req, cb) {
    let accountId = req.accessToken ? req.accessToken.userId : null;
    if (!accountId) return cb(unauthorizedErrorDict);
    Developerpreferences.testPayPalAsync(accountId).then((result) => {
      if (result === true) {
         return cb(null, {
          status: 'success'
        });
      } else {
        return cb(null, {
          status: 'failure'
        });
      }
    }).catch((err) => {
      return cb(null, {
        status: 'failure'
      });
    });
  };


  Developerpreferences.remoteMethod(
    'testPayPal', {
      description: 'Test PayPal Client ID and Secret',
      accepts: [
        {arg: 'req', type: 'object', http: {source: 'req'}}
      ],
      returns: {type: 'any', root: true},
      http: {path: '/testPayPal', verb: 'post'}
    }
  );


  Developerpreferences.testPatreonAsync = async (accountId) => {
    return new Promise(async (resolve, reject) => {
      try {
        let devConfig = await Developerpreferences.app.models.DeveloperPreferences.findOne({
          where: {
            accountId: String(accountId)
          },
          include: ['account']
        });

        if (devConfig.toJSON) devConfig = devConfig.toJSON();

        let patreonAPIClient = patreonAPI(String(devConfig['patreonAccessToken']));
        let url = jsonApiURL('/current_user/campaigns?include=rewards,creator');

        let results = await patreonAPIClient(url);
        let store = results['store'];
        // console.log(results.rawJson);

        let jsonData = results.rawJson;

        let result = false;

        for (let camp of jsonData.data) {
          result = true;
        }

        return resolve(result);
      } catch (err) {
        return resolve(false);
      }
    });
  };

  Developerpreferences.testPatreon = function (req, cb) {
    let accountId = req.accessToken ? req.accessToken.userId : null;
    if (!accountId) return cb(unauthorizedErrorDict);
    Developerpreferences.testPatreonAsync(accountId).then((result) => {
      if (result === true) {
        return cb(null, {
          status: 'success'
        });
      } else {
        return cb(null, {
          status: 'failure'
        });
      }
    }).catch((err) => {
      return cb(null, {
        status: 'failure'
      });
    });
  };


  Developerpreferences.remoteMethod(
    'testPatreon', {
      description: 'Test Patreon Creator Access Token',
      accepts: [
        {arg: 'req', type: 'object', http: {source: 'req'}}
      ],
      returns: {type: 'any', root: true},
      http: {path: '/testPatreon', verb: 'post'}
    }
  );

  disableAllMethods(Developerpreferences, []);

};
