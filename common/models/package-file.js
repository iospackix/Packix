const disableAllMethods = require('../utils/disableAllMethods');

const unauthorizedErrorDict = {
  name: 'Unauthorized',
  status: 401,
  message: 'You are not authorized to perform this action'
};

module.exports = function(Packagefile) {

  disableAllMethods(Packagefile, []);
};
