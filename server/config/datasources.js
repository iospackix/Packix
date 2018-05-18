'use strict';

module.exports = () => {
  var config = {};

  if (process.env['API_DATASTORE_TYPE'] === 'MongoDB') {
    const host = process.env['MONGODB_HOST'];
    const port = process.env['MONGODB_PORT'];
    const database = process.env['MONGODB_DATABASE'];
    const username = process.env['MONGODB_USERNAME'];
    const password = process.env['MONGODB_PASSWORD'];

    config['db'] = {
      'host': host,
      'port': port,
      'url': 'mongodb://' + host + '/' + database,
      'database': database,
      'username': username,
      'password': password,
      'name': 'db',
      'connector': 'loopback-connector-mongodb',
      'user': username
    };
  }

  if (process.env['FILE_DATASTORE_TYPE'] === 'GridFS') {
    const host = process.env['MONGODB_HOST'];
    const port = process.env['MONGODB_PORT'];
    const database = process.env['MONGODB_DATABASE'];
    const username = process.env['MONGODB_USERNAME'];
    const password = process.env['MONGODB_PASSWORD'];

    config['files'] = {
      'host': host,
      'port': port,
      'url': 'mongodb://' + host + '/' + database,
      'database': database,
      'username': username,
      'password': password,
      'name': 'db',
      'connector': 'loopback-component-storage-mongo-gridfs',
      'user': username
    };
  }

  if (process.env['FILE_DATASTORE_TYPE'] === 'CloudService') {
    var cloudConfig = {};
    cloudConfig['connector'] = 'loopback-component-storage';

    const providerType = process.env['CLOUD_SERVICE_PROVIDER'];
    cloudConfig['provider'] = providerType;
    if (providerType === 'amazon') {
      cloudConfig['key'] = process.env['AMAZON_KEY'];
      cloudConfig['keyId'] = process.env['AMAZON_KEY_ID'];
    } else if (providerType === 'rackspace') {
      cloudConfig['username'] = process.env['RACKSPACE_USERNAME'];
      cloudConfig['apiKey'] = process.env['RACKSPACE_API_KEY'];
    } else if (providerType === 'azure') {
      cloudConfig['storageAccount'] = process.env['AZURE_STORAGE_ACCOUNT'];
      cloudConfig['storageAccessKey'] = process.env['AZURE_STORAGE_ACCESS_KEY'];
    } else if (providerType === 'openstack') {
      cloudConfig['username'] = process.env['OPENSTACK_USERNAME'];
      cloudConfig['password'] = process.env['OPENSTACK_PASSWORD'];
      cloudConfig['authUrl'] = process.env['OPENSTACK_AUTH_URL'];
    } else if (providerType === 'google') {
      cloudConfig['keyFilename'] = process.env['GOOGLE_KEY_FILE_PATH'];
      cloudConfig['projectId'] = process.env['GOOGLE_PROJECT_ID'];
    }
    cloudConfig['nameConflict'] = 'makeUnique';
    cloudConfig['name'] = 'files';
    config['files'] = cloudConfig;
  }

  // if (process.env['USE_PAYPAL'] === 'YES') {
  //   var paypalConfig = {};
  //   paypalConfig['name'] = 'paypal';
  //   paypalConfig['connector'] = 'loopback-component-paypal';
  //   paypalConfig['payment'] = {
  //     'intent': 'sale',
  //     'redirect_urls': {
  //       'return_url': 'return_url',
  //       'cancel_url': 'cancel_url'
  //     },
  //     'payer': {
  //       'payment_method': 'paypal'
  //     }
  //   };
  //   paypalConfig['mode'] =  process.env['PAYPAL_MODE'];
  //   paypalConfig['clientID'] =  process.env['PAYPAL_CLIENT_ID'];
  //   paypalConfig['clientSecret'] =  process.env['PAYPAL_CLIENT_SECRET'];
  //   config['paypal'] = paypalConfig;
  // }

  console.log(config);
  return config;
};
