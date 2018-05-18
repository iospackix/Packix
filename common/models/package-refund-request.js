'use strict';

const disableAllMethods = require('../utils/disableAllMethods');

module.exports = function(Packagerefundrequest) {

  Packagerefundrequest.getRelatedRequests = async (refRequest) => {
      let requests = await Packagerefundrequest.find({
        where: {
          accountId: String(refRequest.accountId),
          id: {neq: String(refRequest.id)}
        },
        fields: {
          relatedRequests: false,
          downloads: false
        },
        include: [
          {
            relation: 'package',
            scope: {
              fields: {
                name: true
              }
            }
          }
        ]
        // fields: [
        //   { relatedRequests: false },
        //   { downloads: false }
        // ]
      });

      let relatedRequests = [];
      for (let request of requests) {
        if (request.toJSON) request = request.toJSON();
        delete request.account;
        delete request.purchase;
        delete request.package.recentReviews;
        delete request.package.ratingStats;
        delete request.package.latestVersion;

        relatedRequests.push(request);
      }
      return relatedRequests;
  };

  Packagerefundrequest.getDownloads = async (refRequest) => {
    let devices = await Packagerefundrequest.app.models.Device.find({
      where: {
        accountId: String(refRequest.accountId)
      },
      include: [
        {
          relation: 'downloads',
          scope: {
            where: {
              packageId: String(refRequest.packageId)
            },
            include: [
              {
                relation: 'packageVersion',
                scope: {
                  fields: {
                    recentReviews: false,
                    ratingStats: false,
                    raw: false,
                    changes: false,
                    downloadCount: false,
                    visible: false,
                    isDeleted: false,
                    dependencies: false,
                    version: true,
                    createdOn: true,
                    updatedOn: true,
                    id: false
                  }
                }
              }
            ]
          }
        }
      ]
    });



    let packageDownloads = [];
    for (let device of devices) {
      if (device.toJSON) device = device.toJSON();
      for (let download of device.downloads) {
        if (download.packageVersion && download.packageVersion.toJSON) download.packageVersion = download.packageVersion.toJSON();
        packageDownloads.push(download);
      }
    }

    return packageDownloads;
  };

  Packagerefundrequest.prototype.accept = async function(ctx) {
    const res = ctx.res;
    let accountId = ctx.req.accessToken ? ctx.req.accessToken.userId : null;
    if (!accountId) return res.status(401).end();
    accountId = String(accountId);
    let packageObj = await Packagerefundrequest.app.models.Package.findById(String(this.packageId));
    if (!packageObj) return res.status(401).end();
    if (packageObj.toJSON) packageObj = packageObj.toJSON();
    if (accountId !== String(packageObj.accountId)) return res.status(401).end();
    let purchaseObj = await Packagerefundrequest.app.models.PackagePurchase.findById(String(this.purchaseId));
    if (!purchaseObj) return res.status(500).end();
    if (purchaseObj.toJSON) purchaseObj = purchaseObj.toJSON();
    let refundResult = await Packagerefundrequest.app.models.PackagePurchase.refundAsync(String(this.purchaseId));
    if (!refundResult.success) return res.status(500).end();
    if (this.status === "accepted") return res.status(500).end();
    let refundReqObj = await this.updateAttributes({
      status: "accepted"
    });
    if (refundResult.success) return res.send({
      "success": true
    });
  };

  Packagerefundrequest.remoteMethod(
    'accept',
    {
      isStatic: false,
      accepts: [{
        arg: 'ctx',
        type: 'object',
        http: {
          source: 'context'
        }
      }],
      http: {path:'/accept', verb: 'post'}
    }
  );

  Packagerefundrequest.prototype.decline = async function(ctx, reason) {
    const res = ctx.res;
    if (!reason || reason.length < 1) {
      return res.status(401).end();
    }
    let accountId = ctx.req.accessToken ? ctx.req.accessToken.userId : null;
    if (!accountId) return res.status(401).end();
    accountId = String(accountId);
    let packageObj = await Packagerefundrequest.app.models.Package.findById(String(this.packageId));
    if (!packageObj) return res.status(401).end();
    if (packageObj.toJSON) packageObj = packageObj.toJSON();
    if (accountId !== String(packageObj.accountId)) return res.status(401).end();
    let purchaseObj = await Packagerefundrequest.app.models.PackagePurchase.findById(String(this.purchaseId));
    if (!purchaseObj) return res.status(500).end();
    if (purchaseObj.toJSON) purchaseObj = purchaseObj.toJSON();
    if (this.status === "declined" || this.status === "accepted") return res.status(500).end();
    let refundReqObj = await this.updateAttributes({
      status: "declined",
      developerResponse: String(reason)
    });
    return res.send({
      "success": true
    });
  };

  Packagerefundrequest.remoteMethod(
    'decline',
    {
      isStatic: false,
      accepts: [{
        arg: 'ctx',
        type: 'object',
        http: {
          source: 'context'
        }
      }, {
        arg: 'reason',
        type: 'string',
        required: true
      }],
      http: {path:'/decline', verb: 'post'}
    }
  );

  Packagerefundrequest.filterResult = async (ctx) => {
    try {
      let accountId = ctx.req.accessToken ? ctx.req.accessToken.userId : null;
      if (!accountId || accountId.length < 1) return Promise.resolve(null);
      accountId = String(accountId);
      let isAdmin = await Packagerefundrequest.app.models.Account.isAdmin(accountId);
      if (isAdmin === true) return Promise.resolve(ctx.result);
      if (Array.isArray(ctx.result)) {
        let newResults = [];
        for (let refundRequestObj of ctx.result) {
          let refundRequest = null;
          if (refundRequestObj.toJSON) refundRequest = refundRequestObj.toJSON();
          else refundRequest = refundRequestObj;
          if (refundRequest['package'] && refundRequest['package']['latestVersion']) delete refundRequest['package']['latestVersion'];
          if (String(refundRequest['accountId']) === accountId) {
            newResults.push(refundRequest);
          } else if (refundRequest.package) {;
            if (String(refundRequest.package.accountId) === accountId) {
              newResults.push(refundRequest);
            } else {
              if (refundRequest.packageId) {
                let packageObj = await Packagerefundrequest.app.models.Package.findById(refundRequest.packageId, {
                  fields: {
                    accountId: true
                  }
                });
                if (String(packageObj.accountId) === accountId) {
                  newResults.push(refundRequest);
                }
              }
            }
          }
        }

        return Promise.resolve(newResults);
      } else {
        let tempResult = ctx.result;
        if (ctx.result.toJSON) tempResult = ctx.result.toJSON();
        if (String(tempResult['accountId']) === accountId) {
          return Promise.resolve(ctx.result);
        } else if (tempResult['package']) {
          if (String(tempResult['package']['accountId']) === accountId) {
            return Promise.resolve(ctx.result);
          }
          return Promise.resolve(null);
        } else {
          if (tempResult['packageId']) {
            let packageObj = await Packagerefundrequest.app.models.Package.findById(tempResult['packageId'], {
              fields: {
                accountId: true
              }
            });
            if (String(packageObj.accountId) === accountId) {
              return Promise.resolve(ctx.result);
            }
          }
        }
      }
      return Promise.resolve(null);
    } catch (err) {
      return Promise.reject(err);
    }
  };

  Packagerefundrequest.findAfterRemote = function (ctx, user, next) {
    if(ctx.result) {
      Packagerefundrequest.filterResult(ctx).then((result) => {
        if (result !== null) {
          ctx.result = result;
          return next();
        } else {
          ctx.result = null;
          return next();
        }
      }).catch((err) => {
        ctx.result = null;
        return next(t);
      });
    } else return next();
  };


  Packagerefundrequest.afterRemote('find', Packagerefundrequest.findAfterRemote);
  Packagerefundrequest.afterRemote('findById', Packagerefundrequest.findAfterRemote);
  Packagerefundrequest.afterRemote('findOne', Packagerefundrequest.findAfterRemote);

  disableAllMethods(Packagerefundrequest);
};
