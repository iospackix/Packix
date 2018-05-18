'use strict';

const disableAllMethods = require('../utils/disableAllMethods');

module.exports = function(Accountgroup) {

  Accountgroup.computeAccessDescription = async (groupObj) => {
    const accessType = groupObj['accessType'];
    switch (accessType) {
      case 0:
        return 'None';
        break;
      case 1:
        return 'All';
        break;
      case 2:
        return 'Selective';
        break;
      default:
        return 'Unknown';
        break;
    }
  }
  /*
    packageAccessType:
    0: None
    1: All
    2: Selective
   */


  Accountgroup.filterResult = async (ctx) => {
    try {
      let accountId = ctx.req.accessToken ? ctx.req.accessToken.userId : null;
      if (!accountId || accountId.length < 1) return resolve(null);
      accountId = String(accountId);
      if (Array.isArray(ctx.result)) {
        let newResults = [];
        for (let groupObj of ctx.result) {
          if (String(groupObj.accountId) === accountId) {
            newResults.push(groupObj);
          }
        }
        return Promise.resolve(newResults);
      } else {
        let tempResult = ctx.result;
        if (ctx.result.toJSON) tempResult = ctx.result.toJSON();
        if (String(tempResult['accountId']) === accountId) return Promise.resolve(ctx.result);
        return Promise.resolve(null);
      }
    } catch (err) {
      return Promise.reject(err);
    }
  };

  Accountgroup.findAfterRemote = function (ctx, user, next) {
    if(ctx.result) {
      Accountgroup.filterResult(ctx).then((result) => {
        if (result !== null) {
          ctx.result = result;
          return next();
        } else {
          ctx.result = null;
          return next();
        }
      }).catch((err) => {
        ctx.result = null;
        return next();
      });
    } else return next();
  };

  Accountgroup.afterRemote('find', Accountgroup.findAfterRemote);
  Accountgroup.afterRemote('findById', Accountgroup.findAfterRemote);
  Accountgroup.afterRemote('findOne', Accountgroup.findAfterRemote);

  disableAllMethods(Accountgroup, []);
};
