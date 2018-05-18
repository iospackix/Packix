'use strict';

module.exports = function(AccountIdentity) {
  /*
   * Keep user credentials in sync after saving a user-identity
   * It checks if a UserCredentialModel with the same provider and external ID exists for that user
   * It assumes that the providername of userIdentity has suffix `-login`and of userCredentials has suffix `-link`
   *
   * @param Loopback context object
   * @param next middleware function
   * */
  AccountIdentity.observe('after save', function checkPassportUserCredentials(ctx, next){
    let data = JSON.parse(JSON.stringify(ctx.instance));
    data.provider = data.provider.replace('-login', '-link');
    delete data.id; // has to be auto-increment
    let AccountCredential = AccountIdentity.app.models.AccountCredential;
    let filter = {where: { userId: data.userId, provider: data.provider, externalId: data.externalId }};
    AccountCredential.findOrCreate(filter, data, next);
    AccountIdentity.app.models.Account.updateAccountInfoWithId(data.userId).then((data) => {
      console.log(data);
    }).catch((err) => {
      console.log(err);
    });
  });
};
