'use strict';

const unauthorizedErrorDict = {
  name: 'Unauthorized',
  status: 401,
  message: 'You are not authorized to perform this action'
};

const disableAllMethods = require('../utils/disableAllMethods');

module.exports = function(Packagegiftlink) {
  // Packagegiftlink.createLinkAsync = async (ctx, packageId, accountId) => {
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       let reqUserId = ctx.req.accessToken ? ctx.req.accessToken.userId : null;
  //       let packageObj = await Packagegiftlink.app.models.Package.findById(packageId);
  //       if (packageObj.accountId == reqUserId) {
  //         let packageGiftLinkRet = await Packagegiftlink.findOrCreate({
  //           packageId: packageId,
  //           accountId: accountId
  //         }, {
  //           packageId: packageId,
  //           accountId: accountId
  //         });
  //
  //         let packageGiftObj = packageGiftLinkRet[0];
  //         return resolve(packageGiftObj);
  //       } else {
  //         return reject({
  //           name: 'Unauthorized',
  //           status: 401,
  //           message: 'You are not authorized to gift this package to this user'
  //         });
  //       }
  //     } catch (err) {
  //       return reject({
  //         name: 'Server Error',
  //         status: 500,
  //         message: 'A Server Error Occurred when trying to perform this operation'
  //       })
  //     }
  //   });
  // };
  //
  // Packagegiftlink.giftPackage = function(ctx, packageId, accountId, cb) {
  //   Packagegiftlink.createLinkAsync(ctx, packageId, accountId).then((giftObj) => {
  //     return cb(null, giftObj);
  //   }).catch((err) => {
  //     return cb(err);
  //   })
  // };

  Packagegiftlink.beforeRemote('create', async (ctx, data, next) => {
    let accountId = ctx.req.accessToken ? ctx.req.accessToken.userId : null;
    let packageId = ctx.args.data.packageId;
    if (!packageId) {
      return next(unauthorizedErrorDict);
    }

    let packageObj = await Packagegiftlink.app.models.Package.findById(packageId);
    let existingCount = await Packagegiftlink.count({
      accountId: accountId,
      packageId: packageId
    });
    if ((!packageObj || !packageObj.accountId) || accountId.toString() !== packageObj.accountId.toString()) {
      return next(unauthorizedErrorDict);
    }

    if (existingCount > 0) {
      return ctx.res.status(200).send({});
    }
    return next();
  });

  // Packagegiftlink.remoteMethod(
  //   'giftPackage',
  //   {
  //     accepts: [
  //       {arg: 'ctx', type: 'object', http: { source: 'context' }},
  //       {arg: 'packageId', type: 'string'},
  //       {arg: 'accountId', type: 'string'}
  //     ],
  //     http: {path:'/giftPackage', verb: 'post'},
  //     returns: {type: 'PackageGiftLink', root: true}
  //   }
  // );

  disableAllMethods(Packagegiftlink, []);
};
