'use strict';

const disableAllMethods = require('../utils/disableAllMethods');

const unauthorizedErrorDict = {
  name: 'Unauthorized',
  status: 401,
  message: 'You are not authorized to perform this action'
};

module.exports = function(Packagepurchase) {
  Packagepurchase.computeIsPurchaseComplete = (purchaseObject) => {
    if (purchaseObject['status'] === 'Completed') return true;
    return false;
  };

  Packagepurchase.computeDetails = (purchaseObject) => {

    let detailsObj = {};
    if (purchaseObject['_json']) {
      let json = purchaseObject['_json'];

      if (json['payer']) {
        let payer = json['payer'];
        if (payer['payer_info']) {
          detailsObj['payerEmail'] = json['payer']['payer_info']['email'];
        }
      }

      if (json['transactions'] && json['transactions'][0]) {
        let transaction = json['transactions'][0];
        for (let resource of transaction['related_resources']) {
          if (resource['sale']) {
            let sale = resource['sale'];
            if (sale) {
              if (sale['transaction_fee']) {
                detailsObj['feeAmount'] = sale['transaction_fee']['value'];
                detailsObj['feeCurrency'] = sale['transaction_fee']['currency'];
              } else {
                detailsObj['feeAmount'] = purchaseObject['fee'];
                detailsObj['feeCurrency'] = purchaseObject['currency'];
              }
              detailsObj['saleId'] = sale['id'];
              if (sale['amount']) {
                detailsObj['amount'] = {
                  'currency': sale['amount']['currency'],
                  'value': sale['amount']['total']
                };
              } else {
                if (purchaseObject['amountPaid'] && purchaseObject['currency']) {
                  detailsObj['amount'] = {
                    'currency': purchaseObject['currency'],
                    'value': purchaseObject['amountPaid']
                  };
                }
              }
            }
          }
        }
      }
    }
    if (!detailsObj['feeAmount']) detailsObj['feeAmount'] = '0.00';
    if (!detailsObj['feeCurrency']) detailsObj['feeCurrency'] = 'USD';
    if (!detailsObj['amount']) detailsObj['amount'] = {
      'currency': 'USD',
      'value': '0.00'
    };
    if (!detailsObj['payerEmail']) detailsObj['payerEmail'] = 'Unknown';
    if (!detailsObj['saleId']) detailsObj['saleId'] = 'Unknown';
    return detailsObj;
  };

  Packagepurchase.refundAsync = async (purchaseId) => {
    try {
      let purchaseObj = await Packagepurchase.findById(purchaseId, {
        include: ['package']
      });

      if (purchaseObj.toJSON) purchaseObj = purchaseObj.toJSON();
      let accountId = purchaseObj['package']['accountId'];
      let paypal = require('paypal-rest-sdk');
      let devConfig = await Packagepurchase.app.models.DeveloperPreferences.findOne({
        where: {
          accountId: accountId
        }
      });

      paypal.configure({
        'mode': 'live', //sandbox or live
        'client_id': devConfig.paypalClientId,
        'client_secret': devConfig.paypalClientSecret
      });

      let transactionId = purchaseObj['details']['saleId'];
      console.log("Refund Transaction ID: " + transactionId);
      paypal.sale.refund(transactionId, {}, function(err, refund) {
        if (err) {
          console.log(err);
        }
      });
      return Promise.resolve({success: true});
    } catch (err) {
      console.log(err);
      return Promise.resolve({});
    }
  };

  Packagepurchase.prototype.refundPurchase = function(cb) {
    if (this.provider === 'paypal') {
      Packagepurchase.findById(this.id, {
        include: ['package']
      }, function(err, purchaseObj) {
        if (err) {
          console.log(err);
          cb(err);
        } else {
          if (purchaseObj.toJSON) purchaseObj = purchaseObj.toJSON();
          let accountId = purchaseObj['package']['accountId'];
          let paypal = require('paypal-rest-sdk');
          Packagepurchase.app.models.DeveloperPreferences.findOne({
            where: {
              accountId: accountId
            }
          }, function(err, devConfig) {
            paypal.configure({
              'mode': 'live', //sandbox or live
              'client_id': devConfig.paypalClientId,
              'client_secret': devConfig.paypalClientSecret
            });
            let transactionId = purchaseObj['details']['saleId'];
            console.log("Refund Transaction ID: " + transactionId);
            paypal.sale.refund(transactionId, {}, function(err, refund) {
              if (err) {
                console.log(err);
                cb(err);
              } else {
                cb(null, refund);
              }
            });
          });
        }
      });
    } else {
      cb("Can't Refund");
    }
  };

  Packagepurchase.remoteMethod(
    'refundPurchase', {
      isStatic: false,
      description: 'Refund the package purchase to the source',
      returns: {
        type: 'object', root: true
      },
      http: {path: '/refund', verb: 'get'}
    }
  );

  Packagepurchase.filterResult = async (ctx) => {
      try {
        let accountId = ctx.req.accessToken ? ctx.req.accessToken.userId : null;
        if (!accountId || accountId.length < 1) return Promise.resolve(null);
        let isAdmin = await Packagepurchase.app.models.Account.isAdmin(accountId);
        if (isAdmin === true) return Promise.resolve(ctx.result);
        accountId = String(accountId);
        if (Array.isArray(ctx.result)) {
          let newResults = [];
          for (let purchaseObj of ctx.result) {
            let purchase = null;
            if (purchaseObj.toJSON) purchase = purchaseObj.toJSON();
            else purchase = purchaseObj;
            if (purchase['package'] && purchase['package']['latestVersion']) delete purchase['package']['latestVersion'];
            if (String(purchase['accountId']) === accountId) {
              newResults.push(purchase);
            } else if (purchase.package) {
              if (String(purchase.package.accountId) === accountId) {
                newResults.push(purchase);
              } else {
                if (purchase.packageId) {
                  let packageObj = await Packagepurchase.app.models.Package.findById(purchase.packageId, {
                    fields: {
                      packageId: true
                    }
                  });
                  if (String(packageObj.accountId) === accountId) {
                    newResults.push(purchase);
                  }
                }
              }
            }
          }


          for (let purchaseObj of newResults) {
            delete purchaseObj['_json'];
          }

          return Promise.resolve(newResults);
        } else {
          let tempResult = ctx.result;
          if (ctx.result.toJSON) tempResult = ctx.result.toJSON();
          if (String(tempResult['accountId']) === accountId) {
            delete tempResult['_json'];
            return Promise.resolve(tempResult);
          } else if (tempResult['package']) {
            if (String(tempResult['package']['accountId']) === accountId) {
              delete tempResult['_json'];
              return Promise.resolve(tempResult);
            }
            return Promise.resolve(null);
          } else {
            if (tempResult['packageId']) {
              let packageObj = await Packagepurchase.app.models.Package.findById(tempResult['packageId'], {
                fields: {
                  packageId: true
                }
              });
              if (String(packageObj.accountId) === accountId) {
                delete tempResult['_json'];
                return Promise.resolve(tempResult);
              }
            }
          }
        }
        return Promise.resolve(null);
      } catch (err) {
        console.log(err);
        return Promise.reject(err);
      }
  };

  Packagepurchase.findAfterRemote = function (ctx, user, next) {
    if(ctx.result) {
      Packagepurchase.filterResult(ctx).then((result) => {
        if (result !== null) {
          ctx.result = result;
          return next();
        } else {
          ctx.result = null;
          return next();
        }
      }).catch((err) => {
        console.log(err);
        ctx.result = null;
        return next();
      });
    } else return next();
  };


  Packagepurchase.afterRemote('find', Packagepurchase.findAfterRemote);
  Packagepurchase.afterRemote('findById', Packagepurchase.findAfterRemote);
  Packagepurchase.afterRemote('findOne', Packagepurchase.findAfterRemote);

  Packagepurchase.findBeforeRemote = function(ctx, user, next) {
    if (ctx.args.filter && ctx.args.filter && ctx.args.filter.where) {
      if (ctx.args.filter.include) ctx.args.filter.include.push(includeFilter);
      else ctx.args.filter.include = [includeFilter];
    }
    return next();
  };

  Packagepurchase.beforeRemote('count', function (ctx, user, next) {
    // Packagepurchase.destroyAll({
    //   packageId: '5abb9ae0cf4d1c3cfaed07e5'
    // }).then((result) => {
    //   console.log(result);
    // });
    //
    // Packagepurchase.destroyAll({
    //   packageId: '5abbb0a62b7dae118d0e6ee3'
    // }).then((result) => {
    //   console.log(result);
    // });
    let accountId = ctx.req.accessToken ? ctx.req.accessToken.userId : null;
    if (!accountId) return ctx.res.end({count: 0});;
    let packageId = null;
    if (ctx.args && ctx.args.where) packageId = ctx.args.where.packageId;
    if (!packageId) return ctx.res.end(JSON.stringify({count: 0}));
    Packagepurchase.app.models.Package.findById(packageId, (err, packageObj) => {
      if (packageObj && packageObj.accountId && packageObj.accountId.toString() === accountId.toString()) next();
      else return ctx.res.end(JSON.stringify({count: 0}));
    })
  });

  Packagepurchase.beforeRemote('prototype.refundPurchase', function (ctx, user, next) {
    console.log('Trying to refund');
    let accountId = ctx.req.accessToken ? ctx.req.accessToken.userId : null;
    if (!accountId) return next(unauthorizedErrorDict);
    let packageId = null;
    if (ctx.instance) packageId = ctx.instance.packageId;
    if (!packageId) return next(unauthorizedErrorDict);
    Packagepurchase.app.models.Package.findById(packageId, (err, packageObj) => {
      if (packageObj && packageObj.accountId && packageObj.accountId.toString() === accountId.toString()) return next();
      else return next(unauthorizedErrorDict);
    })
  });

  Packagepurchase.beforeRemote('refundPurchase', function (ctx, user, next) {
    console.log('Trying to refund');
    let accountId = ctx.req.accessToken ? ctx.req.accessToken.userId : null;
    if (!accountId) return next(unauthorizedErrorDict);
    let packageId = null;
    if (ctx.instance) packageId = ctx.instance.packageId;
    if (!packageId) return next(unauthorizedErrorDict);
    Packagepurchase.app.models.Package.findById(packageId, (err, packageObj) => {
      if (packageObj && packageObj.accountId && packageObj.accountId.toString() === accountId.toString()) return next();
      else return next(unauthorizedErrorDict);
    })
  });

  Packagepurchase.prototype.createRefundRequest = async function(reason, ctx) {
    try {
      console.log(reason);
      console.log(ctx.req.body);
      const res = ctx.res;
      let purchaseObj = await Packagepurchase.findById(String(this.id));
      if (!purchaseObj) {
        console.log('Coudln\'t find Purchase');
        return res.status(500).end({error: 'Couldn\'t find Purchase'})
      }
      ;
      if (purchaseObj.toJSON) purchaseObj = purchaseObj.toJSON();
      let accountId = ctx.req.accessToken ? ctx.req.accessToken.userId : null;
      if (!accountId) return res.status(401).end();
      accountId = String(accountId);
      if (accountId !== String(purchaseObj.accountId)) return res.status(401).end();
      let refundReqResult = await Packagepurchase.app.models.PackageRefundRequest.findOrCreate({
        where: {
          packageId: purchaseObj.packageId,
          accountId: purchaseObj.accountId,
          purchaseId: String(purchaseObj.id)
        }
      }, {
        packageId: purchaseObj.packageId,
        accountId: purchaseObj.accountId,
        purchaseId: String(purchaseObj.id),
        reason: reason
      });

      let refundReq = refundReqResult[0];
      console.log(refundReqResult);
      if (!refundReq) return res.status(500).end();
      return res.send(refundReq);
    } catch (err) {
      console.log(err);
      return ctx.res.status(500, err);
    }
  };

  Packagepurchase.remoteMethod(
    'createRefundRequest', {
      isStatic: false,
      accepts: [
        {arg: 'reason', type: 'string' },
        {arg: 'ctx', type: 'object', http:{source: 'context' }},
      ],
      http: {path:'/createRefundRequest', verb: 'post'}
    }
  );

  Packagepurchase.getPayPalDetailsAsync = function (ctx, purchaseId) {
    return new Promise(async (resolve, reject) => {
      try {
        let purchaseObj = await Packagepurchase.findById(purchaseId);
        if (purchaseObj.toJSON) purchaseObj = purchaseObj.toJSON();
        let accountId = purchaseObj['package']['accountId'];
        let paypal = require('paypal-rest-sdk');
        let devConfig = await Packagepurchase.app.models.DeveloperPreferences.findOne({
          where: {
            accountId: accountId
          }
        });

        paypal.configure({
          'mode': 'live', //sandbox or live
          'client_id': devConfig.paypalClientId,
          'client_secret': devConfig.paypalClientSecret
        });

        let transactionId = purchaseObj['details']['saleId'];
        console.log("Refund Transaction ID: " + transactionId);

        paypal.sale.get(transactionId, function (error, sale) {
          if (error) {
            console.log(error);
            return reject(error);
          } else {
            console.log("Get Sale Details Response");
            return resolve(sale);
          }
        });
      } catch (err) {
        return reject(err);
      }
    });
  };

  Packagepurchase.prototype.getPayPalDetails = function(ctx, cb) {
    let paymentId = String(this.id);
    Packagepurchase.getPayPalDetailsAsync(ctx,paymentId).then((data) => {
      return cb(null, data);
    }).catch((err) => {
      return cb(err);
    });
    // 5ad641aeb83df818af9bf15b
  };

  Packagepurchase.remoteMethod(
    'getPayPalDetails', {
      isStatic: false,
      accepts: [
        {arg: 'ctx', type: 'object', http:{source: 'context' }},
      ],
      returns: {type: 'any', root: true},
      http: {path:'/getPayPalDetails', verb: 'get'}
    }
  );

  disableAllMethods(Packagepurchase, []);
};
