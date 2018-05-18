'use strict';

const disableAllMethods = require('../utils/disableAllMethods');

module.exports = function(Packagescreenshot) {
  const SCREENSHOTS_CONTAINER_NAME = process.env['SCREENSHOTS_CONTAINER_NAME'] || 'screenshots';

  let lastDeletedPackageId = "";

  Packagescreenshot.prototype.download = function(size, req, res, cb) {
    if (!size || size.length < 1) {
      size = 'full';
    }

    if (!this.sizes[size]) {
      size = 'full';
    }
    let fileId = this.sizes[size]['fileId'];
    let Container = Packagescreenshot.app.models.Container;

    Container.downloadInline(SCREENSHOTS_CONTAINER_NAME, fileId, res, cb);
  };


  Packagescreenshot.updateScreenshotsForPackageId = async (packageIdValue) => {
    try {
      let screenshots = await Packagescreenshot.find({
        where: {
          packageId: packageIdValue
        },
        fields: {
          id: true,
          sizes: true
        }
      });

      let packageObj = await Packagescreenshot.app.models.Package.findById(packageIdValue);
      packageObj = await packageObj.updateAttribute('screenshots', screenshots);
      return Promise.resolve();
    } catch (err) {
      console.log(err);
      return Promise.reject();
    }
  };

  Packagescreenshot.observe('before delete', function(ctx, next) {
    Packagescreenshot.findById(ctx.where.id, function(err, sObj) {
      ctx.hookState.packageId = sObj.packageId;
      lastDeletedPackageId = sObj.packageId;
      next();
    })
  });

  Packagescreenshot.observe('after delete', function(ctx, next) {
    Packagescreenshot.updateScreenshotsForPackageId(lastDeletedPackageId).then(() => {
      next();
    });
  });

  Packagescreenshot.remoteMethod(
    'download',
    {
      isStatic: false,
      accepts: [
        {arg: 'size', type: 'string'},
        {arg: 'req', type: 'object', http: {source: 'req'}},
        {arg: 'res', type: 'object', 'http': {source: 'res'}}
      ],
      http: {path: '/download.jpg', verb: 'get'},
      returns: {}
    }
  );

  Packagescreenshot.checkProtoAccess = async (ctx,data) => {
    //if (ctx.args && ctx.args.data && ctx.args.data.package) delete ctx.args.data.packageId;
    const accountId = ctx.req.accessToken ? ctx.req.accessToken.userId : null;
    if (!accountId) {
      return false
    }

    let instanceId = ctx.instance ? ctx.instance.id : null;
    if (!instanceId) instanceId = ctx.args ? ctx.args.id : null;
    if (!instanceId) instanceId = ctx.where ? ctx.where.id : null;
    console.log('Instance Id' + instanceId);

    let versionObj = await Packagescreenshot.findById(instanceId, {
      include: ['package']
    });
    if (versionObj.toJSON) versionObj = versionObj.toJSON();

    const otherAccountId = versionObj.package.accountId ? versionObj.package.accountId : null;
    if ((!accountId || !otherAccountId) || otherAccountId.toString() != accountId.toString()) {
      return false;
    }
    return true;
  };

  Packagescreenshot.beforeRemote('deleteById', function (ctx,data, next) {
    console.log("checking proto access");
    Packagescreenshot.checkProtoAccess(ctx,data).then((value) => {
      if (value === true) return next();
      else return next(unauthorizedErrorDict);
    }).catch((err) => {
      return next(unauthorizedErrorDict);
    })
  });

  disableAllMethods(Packagescreenshot, []);
};
