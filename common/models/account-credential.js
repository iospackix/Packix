'use strict';

module.exports = function(AccountCredential) {
  AccountCredential.observe('before save', function checkAccountCredentials(ctx, next){
    // new insert - see if it is used else where
    if (ctx.isNewInstance === true && ctx.instance) { // indicates a new insert
      let filter = {
        where: {
          provider: ctx.instance.provider,
          externalId: ctx.instance.externalId
        }
      };
      AccountCredential.findOne(filter, function(err, userCredential){
        if (err) return next(err);
        if (userCredential) {
          err = new Error('Credentials already linked');
          err.code = 'Validation Error';
          err.statusCode = 422;
          return next(err);
        } else {
          // allow proceed
          return next();
        }
      });
    } else {
      // don't allow updates on provider and external ID
      if (ctx.instance) {
        delete ctx.instance.externalId;
        delete ctx.instance.provider;
      } else if (ctx.data) {
        delete ctx.data.externalId;
        delete ctx.data.provider;
      }
      next();
    }
  });

  /*
   * Keep user identities in sync after saving a user-credential
   * It checks if a UserIdentityModel with the same provider and external ID exists
   * It assumes that the provider name of userIdentity has suffix `-login`and of userCredentials has suffix `-link`
   *
   * @param Loopback context object
   * @param next middleware function
   * */
  AccountCredential.observe('after save', function checkPassportUserIdentities(ctx, next){
    let data = JSON.parse(JSON.stringify(ctx.instance));

    data.provider = data.provider.replace('-link', '-login');
    delete data.id; // has to be auto-increment

    let AccountIdentity = AccountCredential.app.models.AccountIdentity;
    let filter = {where: { provider: data.provider, externalId: data.externalId }};
    AccountIdentity.findOrCreate(filter, data, next);
  });
};
