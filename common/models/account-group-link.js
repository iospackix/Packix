'use strict';
const unauthorizedErrorDict = {
  name: 'Unauthorized',
  status: 401,
  message: 'You are not authorized to perform this action'
};

module.exports = function(Accountgrouplink) {
  Accountgrouplink.beforeRemote('create', async (ctx, data, next) => {
    let accountId = ctx.req.accessToken ? ctx.req.accessToken.userId : null;
    let groupId = ctx.args.data.accountGroupId;

    if (!groupId) {
      return next(unauthorizedErrorDict);
    }

    let groupObj = await Accountgrouplink.app.models.AccountGroup.findById(groupId);
    if ((!groupObj || !groupObj.accountId) || accountId !== groupObj.accountId) {
      return next(unauthorizedErrorDict);
    }

    return next();
  });


  Accountgrouplink.afterRemote()

};
