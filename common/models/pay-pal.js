'use strict';

const ppIPN = require('pp-ipn');

const ipnSettings = {
  'allow_sandbox': process.env['PAYPAL_MODE'] === "sandbox"
};

module.exports = (Paypal) => {

  Paypal.verifyIPN = function(req) {
    console.log('Verifying IPN');
    return new Promise(async (resolve, reject) => {
      ppIPN.verify(req.body, ipnSettings, (err, msg) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          console.log('IPN WAS GOOD');
          resolve(req.body);
        }
      });
    });
  };

  Paypal.asyncHandleIPN = async (req,res) => {
    return new Promise(async (resolve, reject) => {
      try {
        res.status(200).end();
        let ipnData = await Paypal.verifyIPN(req);
        if (ipnData) {
          console.log("IPN DATA WAS VERIFIED");
          // console.log(ipnData);
          const purchaseId = ipnData['custom'];
          const saleId = ipnData['txn_id'];
          const status = ipnData['payment_status'];

          if (purchaseId) {
            let packagePurchase = await Paypal.app.models.PackagePurchase.findById(purchaseId);

            let updatedInfo = {};
            if (saleId) updatedInfo['saleId'] = saleId;
            if (ipnData['parent_txn_id']) updatedInfo['saleId'] = ipnData['parent_txn_id'];
            if (status && status != 'Refunded') {
              if (ipnData['mc_gross']) updatedInfo['amountPaid'] = ipnData['mc_gross'];
              if (ipnData['mc_fee']) updatedInfo['fee'] = ipnData['mc_fee'];
              if (ipnData['mc_currency']) updatedInfo['currency'] = ipnData['mc_currency'];
            }
            if (status) updatedInfo['status'] = status;

            if (String(packagePurchase['status']) === 'Completed' && String(status) === 'Pending') return resolve(ipnData);
            await packagePurchase.updateAttributes(updatedInfo);
            resolve(ipnData);
          } else {
            reject('Oops');
          }
        }
      } catch(error) {
        console.log(error);
        reject(error);
      }
    });
  };


  Paypal.handleIPN =  function(req, res) {
    console.log('Got IPN');
    Paypal.asyncHandleIPN(req,res).then((ipnData) => {
      console.log(ipnData);
    }).catch((error) => {
      console.log(error);
      //cb(error);
    });
  };

  Paypal.handlePaymentSuccess = function(req, res, paymentID, payerID, purchaseId, cb) {
    console.log("Payment Success");
    console.log("Payment ID: " + paymentID);
    console.log("Payer ID: " + payerID);
    console.log("Purchase ID: " + purchaseId);

    Paypal.app.models.PackagePurchase.findById(purchaseId, {include: ['package']}, (err, packagePurchaseObj) => {
      if (packagePurchaseObj) {
        if (packagePurchaseObj.toJSON) packagePurchaseObj = packagePurchaseObj.toJSON();
        let accountId = packagePurchaseObj['package']['accountId'];
        const paypalThing = require('paypal-rest-sdk');
        Paypal.app.models.DeveloperPreferences.findOne({
          where: {
            accountId: String(accountId)
          }
        }, function(err, devConfig) {
          paypalThing.configure({
            'mode': 'live', //sandbox or live
            'client_id': devConfig.paypalClientId,
            'client_secret': devConfig.paypalClientSecret
          });

          let execute_payment_json = {
            "payer_id": payerID
          };

          paypalThing.payment.execute(paymentID, execute_payment_json, (error, payment) => {
            if (error) {
              console.log(error);
              return cb(error)
            } else {
              console.log(payment);
              const purchaseId = payment['transactions'][0]['invoice_number'];
              Paypal.app.models.PackagePurchase.findById(purchaseId, {include: ['package']}, (err, packagePurchase) => {
                if (err) console.log(err);
                else {
                  delete payment['httpStatusCode'];
                  let updates = {
                    '_json': payment
                  };
                  if (payment['state'] === 'approved') {
                    updates['status'] = 'Completed';
                  }
                  packagePurchase.updateAttributes(updates, (err, obj) => {
                    // packagePurchase
                  });

                  res.redirect('/api/link/cydia');
                  // res.end('Worked');
                }
              });
            }
          });
        });
      }
    });
  };

  Paypal.handlePaymentFailure = async (req, res, paymentID, payerID, purchaseId, cb) => {
    console.log("Payment Failure");
  };

  Paypal.executePayment = function(req,res,paymentID, payerID, cb) {
    console.log('Executing Crap');
    let execute_payment_json = {
      "payer_id": payerID
    };
    Paypal.payment.execute(paymentID, execute_payment_json, (payment) => {
      console.log(payment);
      res.status(200);
      res.end();

    });
  };


  Paypal.remoteMethod(
    'handleIPN', {
      description: 'Handles IPN Response from PayPal',
      accepts: [
        {arg: 'req', type: 'object', http: {source: 'req'}},
        {arg: 'res', type: 'object', 'http': {source: 'res'}}
      ],
      http: {path:'/ipn', verb: 'post'}
    }
  );

  Paypal.remoteMethod(
    'handlePaymentSuccess', {
      description: 'Handles IPN Response from PayPal',
      accepts: [
        {arg: 'req', type: 'object', http: {source: 'req'}},
        {arg: 'res', type: 'object', 'http': {source: 'res'}},
        {arg: 'paymentId', type: 'string',  http: {source: 'query'}, required: true},
        {arg: 'PayerID', type: 'string',  http: {source: 'query'}, required: true},
        {arg: 'purchaseId', type: 'string', http: { source: 'path' }}
      ],
      http: {path:'/handlePaymentSuccess/:purchaseId', verb: 'get'}
    }
  );

  Paypal.remoteMethod(
    'handlePaymentFailure', {
      description: 'Handles IPN Response from PayPal',
      accepts: [
        {arg: 'req', type: 'object', http: {source: 'req'}},
        {arg: 'res', type: 'object', http: {source: 'res'}},
        {arg: 'paymentId', type: 'string', http: {source: 'query'}, required: true},
        {arg: 'PayerID', type: 'string',  http: {source: 'query'}, required: true},
        {arg: 'purchaseId', type: 'string', http: { source: 'path' }}
      ],
      http: {path:'/handlePaymentFailure/:purchaseId', verb: 'get'}
    }
  );

  Paypal.remoteMethod(
    'executePayment', {
      description: 'Executes Payment from PayPal',
      accepts: [
        {arg: 'req', type: 'object', http: {source: 'req'}},
        {arg: 'res', type: 'object', 'http': {source: 'res'}},
        {arg: 'paymentID', type: 'string', required: true},
        {arg: 'payerID', type: 'string', required: true}
      ],
      http: {path:'/executePayment', verb: 'post'}
    }
  );


};
