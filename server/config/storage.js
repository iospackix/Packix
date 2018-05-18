'use strict';

module.exports = function(app) {
  const getDataSourceConfig = require('../config/datasources.js');
  let dataSourceConfigurations = getDataSourceConfig();
  for (var key in dataSourceConfigurations) {
    // check if the property/key is defined in the object itself, not in parent
    if (dataSourceConfigurations.hasOwnProperty(key)) {
      let dataSourceConfig = dataSourceConfigurations[key];
      let dataSource = app.loopback.createDataSource(key, dataSourceConfig);
      console.log(dataSource);
    }
  }
};
