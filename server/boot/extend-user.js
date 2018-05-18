'use strict';

module.exports = function(app) {
  // let autoMigrate = require('loopback-component-auto-migrate/lib/auto-migrate');
  // autoMigrate(app, {"migration": "auto-migrate"}).then(() => {
  //   console.log("I FINISHED MIGRATION");
  // });
  // const User = app.models.User;
  // User.hasMany(app.models.Device, {as: 'devices', foreignKey: 'accountId'});
  // User.hasMany(app.models.Package, {as: 'packages', foreignKey: 'accountId'});
  // User.hasMany(app.models.PackagePurchase, {as: 'purchases', foreignKey: 'accountId'});
  // User.hasOne(app.models.UserIdentity, {as: 'profile', foreignKey: 'userId'});
  //
  //
  // const getUserForUserId = async (userId) => {
  //   try {
  //     const userObj = await User.findById('5a663b04a69e637260f2093d', {
  //       include: ['devices', 'purchases', 'profile']
  //     });
  //
  //     return Promise.resolve(userObj);
  //   } catch(err) {
  //     return Promise.reject(err);
  //   }
  // };
  //
  // User.getMe = function(ctx, cb) {
  //  // console.log(ctx);
  //   // console.log(ctx.getUser());
  //   console.log(ctx.req.accessToken);
  //   let userId = '';
  //   if (ctx.req && ctx.req.accessToken) userId = ctx.req.accessToken.userId;
  //   console.log('User ID: ' + userId);
  //   return cb(null, {userId: userId});
  //   if (userId && userId.length > 0) {
  //     getUserForUserId(userId).then((userObj) => {
  //       if (userObj) return cb(null, userObj);
  //       else return cb(null, {});
  //     }).catch((err) => {
  //       console.log(err);
  //       return cb(null, {});
  //     })
  //   } else {
  //     cb(null, {});
  //   }
  // };
  //
  // // User.findById('5a663b04a69e637260f2093d', {
  // //   include: ['devices', 'purchases', 'profile']
  // // }, function(err, userObj) {
  // //   console.log(userObj);
  // // });
  //
  // User.remoteMethod(
  //   'getMe', {
  //     description: 'Gets currently logged in user',
  //     accepts: [
  //       {arg: 'ctx',type: 'object', http: {source: 'context'}}
  //     ],
  //     returns: {
  //       type: 'object', root: true
  //     },
  //     http: {path: '/me', verb: 'get'}
  //   }
  // );
  //
  // let ACL = app.models.ACL;
  // ACL.create({
  //   model: 'User',
  //   accessType: '*',
  //   principalType: 'ROLE',
  //   principalId: '$everyone',
  //   permission: 'ALLOW',
  //   property: 'getMe'
  // }, function (err, acl) {
  //   console.log('ACL entry created: %j', acl);
  // });
  //
  // //app.registry.createModel('PayPal', {dataSource: 'paypal', public: true});
  //
  // // const paymentTransaction = {
  // //   'intent': 'sale',
  // //   'payer': {
  // //     'payment_method': 'paypal',
  // //   },
  // //   'redirect_urls': {
  // //     'return_url': 'http://return.url',
  // //     'cancel_url': 'http://cancel.url',
  // //   },
  // //   'transactions': [{
  // //     'item_list': {
  // //       'items': [{
  // //         'name': 'item',
  // //         'sku': 'item',
  // //         'price': '1.00',
  // //         'currency': 'USD',
  // //         'quantity': 1,
  // //       }],
  // //     },
  // //     'amount': {
  // //       'currency': 'USD',
  // //       'total': '1.00',
  // //     },
  // //     'description': 'This is the payment description.',
  // //   }],
  // // };
  // //
  // // app.models.PayPal.payment.create(paymentTransaction, function(err, response)  {
  // //   console.log(err);
  // //   console.log(response);
  // // });
  // // console.log('extended user model successfully');
};
