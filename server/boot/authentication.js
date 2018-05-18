module.exports = function enableAuthentication(app) {
  const ObjectId = require('mongodb').ObjectID;
  const dynamicOwnerResolver = require('../../common/utils/dynamicOwner');
  const testOwnerResolver = require('../../common/utils/testOwner');
  app.enableAuth({ datasource: 'db' });
  const Role = app.models.Role;
  const RoleMapping = app.models.RoleMapping;
  RoleMapping.settings.strictObjectIDCoercion = true;
  let ObjectID = RoleMapping.getDataSource().connector.getDefaultIdType();

// Because of this: https://github.com/strongloop/loopback-connector-mongodb/issues/1441
  RoleMapping.defineProperty('principalId', {
    type: ObjectID,
  });

  Role.registerResolver('dynamicOwner', function(role, context, cb) {
    //console.log(context)
    console.log('Running Package Mine');
    dynamicOwnerResolver(context, cb);
    // dynamicOwner(context).then((result) => {
    //   return process.nextTick(() => cb(null, result));
    // }).catch((err) => {
    //   console.log(err);
    //   return process.nextTick(() => cb(null, false));
    // })
  });

  app.models.Role.findOrCreate({
    where: {
      name: 'admin'
    }
  }, {
    name: 'admin'
  }, function(err, role, wasCreated) {
    if (err) {
      console.log(err);
      return;
    }

    if (role != null) {
      app.models.Account.getWithEmail(String(process.env['ADMIN_EMAIL'])).then((accountObj) => {
        app.models.Repository.makeUserDeveloperAsync(String(accountObj.id)).then((stuff) => {
          console.log(stuff);
        }).catch((err) => {
          console.log(err);
        });

        app.models.Account.findById(accountObj.id, (err, account) => {
          RoleMapping.findOrCreate({
            where: {
              roleId: role.id,
              principalType: RoleMapping.USER,
              principalId: ObjectId(String(accountObj.id))
            }
          }, {
            roleId: role.id,
            principalType: RoleMapping.USER,
            principalId: ObjectId(String(accountObj.id))
          }, (err, principal) => {
            if (err) console.log(err);
          });
        });
      }).catch((err) => {
        console.log(err);
      })
    }
  });

};
