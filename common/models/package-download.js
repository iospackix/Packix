'use strict';

const disableAllMethods = require('../utils/disableAllMethods');
const deviceNames = require('./../../server/assets/deviceStrings.json');

module.exports = function(Packagedownload) {

  Packagedownload.getModelName = async (deviceObj) => {
    if (deviceObj['clientType']) {
      return deviceNames[deviceObj['clientType'].toLowerCase()];
    }
    return "Unknown";
  };
  disableAllMethods(Packagedownload);
};
