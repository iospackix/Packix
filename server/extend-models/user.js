'use strict';

module.exports = function(User, app) {
  User.hasMany(app.models.Device, {as: 'devices', foreignKey: 'accountId'});
  // any code to be called after the model is attached
  console.log('added to user');

}
