'use strict';

const crypto = require('crypto');
const disableAllMethods = require('../utils/disableAllMethods');

const unauthorizedErrorDict = {
  name: 'Unauthorized',
  status: 401,
  message: 'You are not authorized to perform this action'
};

/* Coupon Types:
  full,
  mutli-use,
  time-based
 */

module.exports = function(Packagecouponcode) {
  const baseURL = process.env['HOST_URL'];

  Packagecouponcode.handleRedeem = async (req, res, codeId) => {
    return new Promise(async (resolve, reject) => {
      try {

        let ip = req.headers['x-forwarded-for'];
        if (!ip || ip.length < 1) ip = req.connection.remoteAddress;
        if (!ip || ip.length < 1) ip = req.headers['x-real-ip'];
        ip = crypto.createHash('sha256').update(ip).digest('base64');

        let couponCode = await Packagecouponcode.findById(codeId);
        if (!couponCode) {
          return resolve('/coupon/invalid?code=' + codeId);
        }

        let couponCodeObj = null;

        if (couponCode.toJSON) couponCodeObj = couponCode.toJSON();
        else couponCodeObj = couponCode;

        if (!req.accessToken) {
          return resolve('/login?next=/api/PackageCouponCodes/' + codeId + '/redeem');
        }

        let accountId = req.accessToken.userId;
        if (!accountId || accountId.length < 1) {
          return resolve('/login?next=/api/PackageCouponCodes/' + codeId + '/redeem');
        }

        let purchaseCount = await Packagecouponcode.app.models.PackagePurchase.count({
          packageId: couponCode.packageId,
          accountId: accountId,
          status: 'Completed'
        });

        if (purchaseCount > 0) {
          return resolve('/coupon/unusable?reason=purchased&code=' + codeId);
        }

        let giftCount = await Packagecouponcode.app.models.PackageGiftLink.count({
          packageId: couponCode.packageId,
          accountId: accountId
        });

        if (giftCount > 0) {
          return resolve('/coupon/unusable?reason=gifted&code=' + codeId);
        }

        if (couponCodeObj['type'] === "multi-use") {

        } else if (couponCodeObj['type'] === "time-based") {

        } else {
          if (couponCodeObj['isClaimed'] === true) {
            return resolve('/coupon/used?code=' + codeId);
          } else {
            couponCode = await couponCode.updateAttributes({
              isClaimed: true,
              accountId: accountId,
              claimIp: ip
            });

            let giftLink = await Packagecouponcode.app.models.PackageGiftLink.create({
              packageId: couponCodeObj.packageId,
              accountId: accountId
            });
            return resolve('/coupon/success?code=' + codeId);
          }
        }
      } catch (err) {
        return reject(err);
      }
    });
  };

  Packagecouponcode.prototype.redeem = function(req,res) {

    const codeId = this.id;

    Packagecouponcode.handleRedeem(req, res, codeId).then((result) => {
      if (result && result.length > 0) {
        res.redirect(result);
      } else {
      }
    }).catch((error) => {
      console.log(error);
      res.redirect('/coupon/error');
    });
  };

  Packagecouponcode.remoteMethod(
    'redeem',
    {
      isStatic: false,
      accepts: [
        {arg: 'req', type: 'object', http: {source: 'req'}},
        {arg: 'res', type: 'object', 'http': {source: 'res'}}
      ],
      http: {path: '/redeem', verb: 'get'}
    }
  );

  Packagecouponcode.beforeRemote('create', async (ctx, data, next) => {
    let accountId = ctx.req.accessToken ? ctx.req.accessToken.userId : null;
    let packageId = ctx.args.data.packageId;
    if (!packageId) {
      return next(unauthorizedErrorDict);
    }

    let packageObj = await Packagecouponcode.app.models.Package.findById(packageId);
    if ((!packageObj || !packageObj.accountId) || accountId.toString() !== packageObj.accountId.toString()) {
      return next(unauthorizedErrorDict);
    }

    return next();
  });

  disableAllMethods(Packagecouponcode, []);
};
