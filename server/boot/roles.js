/**
 * Created by awiik on 6/11/2017.
 */
// Copyright IBM Corp. 2015,2016. All Rights Reserved.
// Node module: loopback-example-access-control
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0

'use strict';


module.exports = function(app) {
  let Account = app.models.Account;
  let AccountIdentity = app.models.AccountIdentity;
  let Role = app.models.Role;
  let RoleMapping = app.models.RoleMapping;
  let dynamicOwnerResolver = require('../../common/utils/dynamicOwner');

  Role.findOrCreate({
    where: {
      name: 'user'
    }
  }, {
    name: 'user',
    description: 'Regular User Role'
  }, function(error, role, created) {
    if (error) throw error;
    if (created) {
      console.log('Created role:', role);
    }
  });

  // Role.findOrCreate({
  //   where: {
  //     name: 'developer'
  //   }
  // }, {
  //   name: 'developer',
  //   description: 'iOS Tweak Developer'
  // }, function(error, role, created) {
  //   if (error) throw error;
  //   if (created) {
  //     console.log('Created role:', role);
  //   }
  // });

  Role.findOrCreate({
    where: {
      name: 'press'
    }
  }, {
    name: 'press',
    description: 'Press Account Role'
  }, function(error, role, created) {
    if (error) throw error;
    if (created) {
      console.log('Created role:', role);
    }
  });

  Role.registerResolver('developer', function(role, context, cb) {
    let accountId = context.accessToken ? context.accessToken.userId : null;
    if (!accountId) return cb(null, false);
    Role.app.models.DeveloperPreferences.count({
      accountId: accountId
    }, function(err, count) {
      if (count > 0) return cb(null, true);
      else return cb(null, false);
    });
  });

  Role.registerResolver('admi45n', function(role, context, cb) {
    //console.log(context.getUser());
    // Q: Is the current request accessing a Project?
    //console.log(context);
    // Q: Is the user logged in? (there will be an accessToken with an ID if so)
    let userId = context.accessToken.userId;
    if (!userId) {
      // A: No, user is NOT logged in: callback with FALSE
      return process.nextTick(() => cb(null, false));
    }

    AccountIdentity.findOne({
      where: {
        userId: userId,
        provider: "google"
      },
      include: ['user']
    }, function(error, foundUser) {
      if (error) {
        console.log(error);
        return cb(null, false);
      }

      if (foundUser && foundUser.toJSON) {
        foundUser = foundUser.toJSON();
      }
      if (foundUser) {
        let email = '';
        if (foundUser.provider === 'patreon') {
          if (foundUser.profile) {
           // console.log(foundUser.profile.attributes);
            if (foundUser.profile.email && foundUser.profile.email.length > 0) {
              email = foundUser.profile.email;
            } else if (foundUser.profile.attributes &&
                foundUser.profile.attributes.email &&
                foundUser.profile.attributes.email.length > 0) {
              email = foundUser.profile.attributes.email;
            }
          } else {
            if (foundUser['_json'] &&
                foundUser['_json']['_attributes'] &&
                foundUser['_json']['_attributes']['email'] &&
                foundUser['_json']['_attributes']['email'].length > 0) {
              email = foundUser['_json']['_attributes']['email'];
            }
          }
        } else if (foundUser.provider === 'google') {
          let emails = foundUser.emails;
          for (let emailObj of foundUser.profile.emails) {
            if (emailObj['type'] === 'account' && emailObj['value'] && emailObj['value'].length > 0) {
              email = emailObj['value'];
              break;
            }
          }
        } else if (foundUser.provider === 'facebook') {
          let emails = foundUser.emails;
          for (let emailObj of emails) {
            if (emailObj['value'] && emailObj['value'].length > 0) {
              email = emailObj['value'];
              break;
            }
          }
        }

      //  console.log('user email: ' + email);
        if (String(email) === String(process.env['ADMIN_EMAIL'])) {
         // console.log('admin');
          return cb(null, true);
        }
      }

      return cb(null, false);
    });

    // Q: Is the current logged-in user associated with this Project?
    // Step 1: lookup the requested project
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

  // Role.create({
  //   name: 'admin'
  // }, function(err, role) {
  //   if (err) throw err;
  //
  //   console.log('Created role:', role);
  //
  //     // make bob an admin
  //     // role.principals.create({
  //     //   principalType: RoleMapping.USER,
  //     //   principalId: users[2].id
  //     // }, function(err, principal) {
  //     //   if (err) throw err;
  //     //
  //     //   console.log('Created principal:', principal);
  //     // });
  // });
};
