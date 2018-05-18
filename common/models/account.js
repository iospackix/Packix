'use strict';

const disableAllMethods = require('../utils/disableAllMethods');

module.exports = function(Account) {
  const getAccountForId = async (userId) => {
    try {
      let userObj = await Account.findById(userId, {
        include: [
          {relation: 'devices'},
          {
            relation: 'packagePurchases',
            scope: {
              include: ['package'],
              where: {
                status: {neq: 'Unknown'}
              }
            }
          },
          {relation: 'identities'},
          {
            relation: 'packageGifts',
            scope: {
              include: ['package']
            }
          }
        ]
      });

      if (!userObj) return Promise.reject("Err");
      if (userObj.toJSON) userObj = userObj.toJSON();
      //  delete userObj.identities;
      return Promise.resolve(userObj);
    } catch (err) {
      return Promise.reject(err);
    }
  };

  Account.computeProfileName = (accountObject) => {
    if (accountObject.identities && accountObject.identities.length > 0) {
      for (let identity of accountObject.identities) {
        if (identity.profile) {
          if (identity.provider === 'google') {
            return identity.profile.displayName;
          } else if (identity.provider === 'facebook') {
            return identity.profile.name.givenName + ' ' + identity.profile.name.familyName;
          }
        }
      }
    }
    return "";
  };

  Account.computeProfileEmail = (accountObject) => {
    if (accountObject.identities && accountObject.identities.length > 0) {
      for (let identity of accountObject.identities) {
        if (identity.profile) {
          if (identity.provider === 'google') {
            return identity.profile.emails[0]['value'];
          } else if (identity.provider === 'facebook') {
            return identity.profile.emails[0]['value'];
          }
        }
      }
    }
    return "";
  };

  Account.computeProfilePhoto = (accountObject) => {
    if (accountObject.identities && accountObject.identities.length > 0) {
      for (let identity of accountObject.identities) {
        if (identity.profile) {
          if (identity.provider === 'google') {
            return identity.profile.photos[0]['value'];
          } else if (identity.provider === 'facebook') {
            return identity.profile.photos[0]['value'];
          }
        }
      }
    }
    return "";
  };

  Account.computeLinkedPatreon = (accountObject) => {
    if (accountObject.identities && accountObject.identities.length > 0) {
      for (let identity of accountObject.identities) {
        if (identity.profile) {
          if (identity.provider === 'patreon') {
            return true;
          }
        }
      }
    }
    return false;
  };

  Account.computePatreonName = (accountObject) => {
    if (accountObject.identities && accountObject.identities.length > 0) {
      for (let identity of accountObject.identities) {
        if (identity.profile) {
          if (identity.provider === 'patreon') {
            return identity.profile.name;
          }
        }
      }
    }
    return "";
  };


  Account.updateAccountInfoWithId = function (accountId) {
    return new Promise(async (resolve, reject) => {
      try {
        let account = await Account.findById(accountId, {
          include: ['identities']
        });

        let accountJson = account.toJSON();

        if (account) {
          let updatedData = {};
          updatedData['profileName'] = Account.computeProfileName(accountJson);
          // updatedData['profileEmail'] = Account.computeProfileEmail(accountJson);
          updatedData['profilePhoto'] = Account.computeProfilePhoto(accountJson);
          updatedData['profileEmail'] = accountJson['email'].replace("@loopback.google.com", "");
          account = await account.updateAttributes(updatedData);
          if (account.toJSON) account = account.toJSON();
          delete account.identities;
          return resolve(account);
        } else {
          return resolve(null);
        }
      } catch (err) {
        console.log(err);
        return reject(err);
      }
    });
  };

  Account.getMe = function (ctx, cb) {
    // // console.log(ctx);
    //  // console.log(ctx.getUser());
    //  console.log(ctx.req.accessToken);
    let userId = '';
    if (ctx.req && ctx.req.accessToken) userId = ctx.req.accessToken.userId;
    // console.log('User ID: ' + userId);
    // return cb(null, {userId: userId});
    if (userId) {
      getAccountForId(userId).then((userObj) => {
        // console.log(userObj);
        if (userObj) {
          if (userObj.toJSON) userObj = userObj.toJSON();
          for (let identity of userObj.identities) {
            delete identity['credentials'];
            delete identity['profile']['_json'];
            delete identity['profile']['_raw'];
            delete identity['profile'];
          }
          return cb(null, userObj);
        }
        else return cb(null, {});
      }).catch((err) => {
        console.log(err);
        return cb(null, {});
      })
    } else {
      cb(null, {});
    }
  };

  Account.getWithEmail = function (email) {
    let eString = email;
    return new Promise(async (resolve, reject) => {
      try {
        let identity = await Account.app.models.AccountIdentity.findOne({
          where: {
            'profile.emails.value': {
              inq: [
                eString
              ]
            }
          },
          include: ['user']
        });

        console.log(identity);

        if (identity != null) {
          if (identity.toJSON) identity = identity.toJSON();
          return resolve(identity.user);
        }
        return resolve(null);
      } catch (err) {
        return resolve(null);
      }
    });
  };


  Account.deleteAccountWithId = async (accountId) => {
    let purchaseResult = await Account.app.models.PackagePurchase.destroyAll({
      accountId: String(accountId)
    });

    console.log(purchaseResult);

    let deviceResult = await Account.app.models.Device.destroyAll({
      accountId: String(accountId)
    });

    let giftResult = await Account.app.models.PackageGiftLink.destroyAll({
      accountId: String(accountId)
    });

    let identitiesResult = await Account.app.models.AccountIdentity.destroyAll({
      userId: String(accountId)
    });

    let accountResult = await Account.destroyAll({
      id: String(accountId)
    });
  };

  Account.remoteMethod(
    'getMe', {
      description: 'Gets currently logged in user',
      accepts: [
        {arg: 'ctx',type: 'object', http: {source: 'context'}}
      ],
      returns: {
        type: 'object', root: true
      },
      http: {path: '/me', verb: 'get'}
    }
  );


  Account.isAdmin = async (accountId) => {
    try {
      if (accountId == null || accountId.length < 1) return false;
      let role = await Account.app.models.Role.findOne({
        where: {
          name: 'admin'
        }
      });

      let count = await Account.app.models.RoleMapping.count({
        roleId: role.id,
        principalId: accountId
      });

      return count > 0;
    } catch (err) {
      return false;
    }
  };

  disableAllMethods(Account, []);
};
