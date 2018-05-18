'use strict';

// const envVariables = require('../environment.json')['backend_packix'];
//
// for (var key in envVariables) {
//   if (envVariables.hasOwnProperty(key)) {
//     process.env[key] = envVariables[key];
//   }
// }

if (String(process.env['DOCKER_BUILDING']) === '1') {
  return;
}

console.log(process.env['NODE_APP_INSTANCE']);

const loopback = require('loopback');
const boot = require('loopback-boot');
const cookieDeMangle = require('cookie');
const app = module.exports = loopback();
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const fs = require('fs-extra');
const path = require('path');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const plist = require('plist');
const renderLinkPage = require(__dirname + '/pages/device_link.js');
const renderLoginPage = require(__dirname + '/pages/login.js');
const es6Renderer = require('express-es6-template-engine');
const xssEscape = require('xss-escape');

const GOOGLE_ANYLT_ID=String(process.env['GOOGLE_ANALYTICS_TRACKING_ID']);


const uaGen = require('useragent-generator');

const packagesFilePath = path.join(__dirname, '../dist', 'Packages');
const releaseFilePath = path.join(__dirname, '../dist', 'Release');
const clientHTMLFilePath = path.join(__dirname, './pages/');

const clientVersionHeaderNames = ['X-Firmware','x-firmware', 'HTTP_X_FIRMWARE'];
const ua = require('universal-analytics');

const clientUDIDHeaderNames = ['X-Unique-ID','x-unique-id', 'HTTP_X_UNIQUE_ID'];

const clientUDIDForHeaders = (headers) => {
  for (let headerName of clientUDIDHeaderNames) {
    if (headers.hasOwnProperty(headerName) && headers[headerName].length > 0) {
      return headers[headerName].toLowerCase();
    }
  }
  return null;
};

app.set('sdk_url', process.env['sdk_url']);

const clientVersionForHeaders = function(headers, needsVersion) {
  for (let headerName of  clientVersionHeaderNames) {
    if (headers[headerName] && headers[headerName].length > 0) {
      return headers[headerName].toLowerCase();
    }
  }
  if (needsVersion) {  return null; }
  return 'UNKNOWN';
};

const clientTypeHeaderNames = ['X-Machine','x-machine', 'HTTP_X_MACHINE'];

const clientTypeForHeaders = function(headers) {
  for (let headerName of clientTypeHeaderNames) {
    if (headers.hasOwnProperty(headerName) && headers[headerName].length > 0) {
      return headers[headerName];
    }
  }
  return null;
};

const PassportConfigurator = require('loopback-component-passport').PassportConfigurator;
const passportConfigurator = new PassportConfigurator(app);

const SECRETCOOKIE = process.env['COOKIE_SECRET'];

const PACKAGES_CONTAINER_NAME = process.env['PACKAGES_CONTAINER_NAME']
const baseURL = process.env['HOST_URL'];
const compBaseURL = 'https://' + baseURL;

const URL_ID = baseURL.split("").reverse().join("");

app.set('trust proxy', true);

app.set('cookieSecret', SECRETCOOKIE);
app.set('packages-container-name', process.env['PACKAGES_CONTAINER_NAME']);

app.middleware('session:before', cookieParser(app.get('cookieSecret')));
const sessionStore = new MongoStore({
  url: 'mongodb://' + process.env['MONGODB_HOST'] + '/' +  process.env['MONGODB_PORT']
});

const host = process.env['MONGODB_HOST'];
const port = process.env['MONGODB_PORT'];
const database = process.env['MONGODB_DATABASE'];

let gfs = null;

app.middleware('session', session({
  secret: app.get('cookieSecret'),
  resave: false,
  saveUninitialized: true,
  proxy: undefined,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 1 hour
    secure: true,
    httpOnly: true,
    path: "/"
  },
  unset: 'destroy',
  store: sessionStore
}));


boot(app, __dirname, async (err) => {
  let mongo = require('mongodb');
  let MongoClient = mongo.MongoClient;
  const Grid = require('gridfs-stream');
  let db = await MongoClient.connect('mongodb://' + process.env['MONGODB_HOST'] + ':' +  process.env['MONGODB_PORT'] + '/' + database);
  let gfsThing = Grid(db, mongo);
  app.set("gfs", gfsThing);

  if (err) throw err;
  if (require.main === module) {
    app.middleware('auth', loopback.token({
      model: app.models.AccountToken
    }));

    app.middleware('auth:after', async (req,res,next) => {
      if (req.session.user && req.session.user.id) req.user = req.session.user;
      else {
        let userId = req.accessToken ? String(req.accessToken.userId) : null;
        if (userId && userId.length > 0) {
          let userObj = await app.models.Account.findById(userId, {
            include: ['packagePurchases', 'devices', 'packageGifts']
          });
          if (!userObj) return next();
          if (userObj.toJSON) userObj = userObj.toJSON();
          req.session.user = userObj;
          req.user = req.session.user;
        }
      }
      return next();
    });
    app.start();
  }
});

const updateAccountsInfo = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('Updating Accounts');
      let accounts = await app.models.Account.find({});
      for (let account of accounts) {
        console.log('Updating account with ID: ' + account.id);
        account = await app.models.Account.updateAccountInfoWithId(account.id);
        console.log(account);
      }
      return resolve('done');
    } catch (err) {
      console.log(err);
      return reject(err);
    }
  });
};

app.start = () => {
  return app.listen(() => {
    app.emit('started');
    let baseUrl = baseURL;
    console.log('Web server listening at: %s', baseUrl);
    console.log('Instance ID: ' + process.env['NODE_APP_INSTANCE']);

    if (String(process.env['NODE_APP_INSTANCE']) === String(1) || process.env['NODE_APP_INSTANCE'] === null) {
      app.models.PatreonUser.destroyAll({}).then(async (value) => {
        console.log("Destroyed All");
        await app.models.PatreonUser.refreshData(() => {});
      });
      setInterval(async () => {
        await app.models.PatreonUser.refreshData(() => {});
      }, 60 * 1000 * 3);

      app.models.DeviceLinkNonce.destroyAll({}).then((data) => {
        console.log(data);
      });

      app.models.DeveloperPreferences.find({}, async(err, result) => {
        try {
          for (let pref of result) {
            let result = await app.models.DeveloperInfo.findOrCreate({
              where: {
                accountId: String(pref.accountId)
              }
            }, {
              accountId: String(pref.accountId)
            })
          }
          return Promise.resolve(true);
        } catch (err) {
          console.log(err);
          return Promise.resolve(true);
        }
      });
    }
    if (app.get('loopback-component-explorer')) {
      let explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }

    // app.models.Repository.automig(app);
  });
};

app.get('/api/auth/success', function(req, res, next) {
  // console.log('SUCCESS URL');
  if (req) {
    if (req.session.authRedirect) {
      let redirectURL = req.session.authRedirect;
      delete req.session.authRedirect;
      res.set('Location', compBaseURL + redirectURL);
      return res.status(302).end();
    } else {
      res.redirect('https://' + baseURL + '/');
    }
  } else {
    next();
  }
});

app.get('/api/auth/logout', function(req, res, next) {
  return Promise.resolve()
    .then(() => {
      if (req.accessToken) {
        return app.models.Account.logout(req.accessToken.id);
      }
    }).then(() => {

      if (req.session) {
        sessionStore.destroy(req.session.id, () => {});
      }
      req.session.regenerate((err) => {});
      res.clearCookie('access_token');
      if (req.query.next) {
        res.redirect(req.query.next);
      } else {
        res.redirect('/');
      }
    });
});

app.use(['/api/link/google', '/api/link/facebook', '/api/link/patreon'], function(req, res, next) {
  if (req.query.next) {
    req.session.authRedirect = req.query.next;
  }
  next();
});

app.use('/api/link/cydia', function(req, res, next) {
  let tokenId = req.accessToken ? req.accessToken.id : null;
  let userId = req.accessToken ? String(req.accessToken.userId) : null;
  let DeviceLinkNonce = app.models.DeviceLinkNonce;
  if (!tokenId || tokenId.length < 1 || !userId || userId.length < 1) {
    res.redirect('/login?next=/api/link/cydia');
  } else {
    return res.sendFile(clientHTMLFilePath + 'device-link.html');
  }
});

app.use('/api/link/ios/cydia', function(req, res, next) {
  let tokenId = req.accessToken ? req.accessToken.id : null;
  let userId = req.accessToken ? String(req.accessToken.userId) : null;
  let DeviceLinkNonce = app.models.DeviceLinkNonce;
  if (!tokenId || tokenId.length < 1 || !userId || userId.length < 1) {
    res.redirect('/login?next=/api/link/ios/cydia');
  } else {
    DeviceLinkNonce.create({
      'accountId': userId
    }, function(nonceError, nonceObject) {
      if (nonceError) {
        res.send(nonceError);
      } else {
        let linkURL = 'cydia://url/https://cydia.saurik.com/api/share#?source=' + String(encodeURIComponent('https://' + String(baseURL) + '/'));
        linkURL += '&extra=' + String(encodeURIComponent('https://' + String(baseURL) + '/api/link/device/' + nonceObject.id));
        res.setHeader('content-type', 'text/html');
        res.end(renderLinkPage({'linkURL': String(linkURL)}));
      }
    });
  }
});

app.get('/login', function(req, res) {
  let authRedirect = "/account/";

  if (req.query.next) {
    authRedirect = String(req.query.next);
  }

  let userId = req.accessToken ? String(String(req.accessToken.userId)) : null;
  if (userId && userId.length > 1) {
    res.set('Location', compBaseURL + authRedirect);
    return res.status(302).end();
  }

  req.session.authRedirect = authRedirect;
  res.setHeader('content-type', 'text/html');
  return res.end(renderLoginPage('/account/'));
});

app.use('/api/link/device/:nonce', async (req, res, next) => {
  res.set('X-Frame-Options', 'Allow');
  try {
    if (!req.params.nonce) return res.send('<p>No Nonce Sent, Linking unsuccessful</p>');
    let DeviceLinkNonce = app.models.DeviceLinkNonce;
    let nonceObject = await DeviceLinkNonce.findById(String(req.params.nonce));
    if (!nonceObject) { return res.send('<p>An Error Occurred, No Nonce Object Found, Linking unsuccessful</p>'); }

    let deviceModel = clientTypeForHeaders(req.headers);
    let ip = req.headers['x-forwarded-for'];
    if (!ip || ip.length < 1) { ip = req.connection.remoteAddress; }
    if (!ip || ip.length < 1) { ip = req.headers['x-real-ip']; }
    if (!ip || ip.length < 1 || deviceModel === null) {
      return res.send('<p>An Error Occurred, IP Not Found, Linking unsuccessful</p>');
    }
    ip = crypto.createHash('sha256').update(ip).digest('base64');
    let destResult = await app.models.DeviceLinkNonce.destroyAll({
      id: {neq: nonceObject.id},
      ip: ip,
      deviceModel: String(deviceModel)
    });

    nonceObject = await nonceObject.updateAttributes({ip: ip, deviceModel: deviceModel});
    if (!nonceObject) { return res.send('<p>An Error Occurred, Error Updatings Nonce Object, Linking unsuccessful</p>'); }
    let userObject = await app.models.Account.findById(nonceObject.accountId);

    if (!userObject) { return res.send('<p>An Error Occurred, Couldn\'t Find Account</p>'); }
    let html = '<html style="width: 100%; margin:auto;"><head><title>Link Device</title></head><body style="width: 100%; text-align: center; font-family: Arial, Helvetica, sans-serif"><p style="text-align: left;">You have been automatically logged into Packix as ' + String(userObject.profileName);
    html += '. <b><u>Refresh your Sources Now</u></b>.</p></body></html>';
    return res.status(200).send(html);
  } catch (err) {
    return res.send('<p>An Error Occurred, ' + err.message + '</p>');
  }
});

let packagesGFS = null;

app.use(['/Release', '/./Release'], async (req, res, next) => {
  res.removeHeader('Content-Encoding');
  return res.sendFile(releaseFilePath);
});

app.use(['/Packages', '/./Packages', '/Packages.gz', '/./Packages.gz', '/Packages.bz2', '/./Packages.bz2', '/Packages.lzma', '/./Packages.lzma', '/Packages.xz', '/./Packages.xz'], async (req, res, next) => {
  if (packagesGFS == null) {
    packagesGFS = app.get("gfs");
  }

  if (packagesGFS == null) return res.status(500).end();

  let requestedPackageType = 0;
  let currentURL = req.originalUrl;
  if (currentURL.endsWith('.gz')) requestedPackageType = 1;
  else if (currentURL.endsWith('.bz2')) requestedPackageType = 2;
  else if (currentURL.endsWith('.lzma')) requestedPackageType = 3;
  else if (currentURL.endsWith('.xz')) requestedPackageType = 4;
  else requestedPackageType = 0;
  try {
    let ip = req.headers['x-forwarded-for'];
    if (!ip || ip.length < 1) { ip = req.connection.remoteAddress; }
    if (!ip || ip.length < 1) { ip = req.headers['x-real-ip']; }
    //console.log('IP GETTING PACKAGES: ' + ip);
    await app.models.Device.linkDevice(req);

  } catch (err) {
    console.log(err);
  }

  res.removeHeader('Content-Encoding');
  let udid = clientUDIDForHeaders(req.headers);
  if (udid != null && udid.length > 0) {
    let visitor = ua(GOOGLE_ANYLT_ID, udid, {strictCidFormat: false, https: true});
    let ip = req.headers['x-forwarded-for'];
    if (!ip || ip.length < 1) { ip = req.connection.remoteAddress; }
    if (!ip || ip.length < 1) { ip = req.headers['x-real-ip']; }
    if (ip != null && ip.length > 0) {
      visitor.set("uip", ip);
    }

    let iosV = clientVersionForHeaders(req.headers, true);
    let deviceModel = clientTypeForHeaders(req.headers);

    if (iosV != null) {
      visitor.set('av', iosV);
    }

    if (deviceModel != null) {
      visitor.set('an', deviceModel);
    }

    if (iosV != null && deviceModel != null) {
      visitor.set('ua', uaGen.safari.iOS({ iOSVersion: iosV, safariVersion: iosV, device: deviceModel }));
    } else {
      visitor.set('ua', req.headers['user-agent']);
    }

    if (iosV != null) {
      visitor.event("Download", "Repo Download", iosV).send();
    } else {
      visitor.event("Download", "Repo Download", "Unknown").send();
    }
  }

  if (requestedPackageType === 4) {
    return res.sendFile(packagesFilePath + '.xz');
  } else  if (requestedPackageType === 3) {
    return res.sendFile(packagesFilePath + '.lzma');
  } else if (requestedPackageType === 2) {
    return res.sendFile(packagesFilePath + '.bz2');
  } else if (requestedPackageType === 1) {
    return res.sendFile(packagesFilePath + '.gz');
  } else {
    return res.sendFile(packagesFilePath);
  }
});

app.get('/api/link/ios/config', async (req, res) => {
  try {
    let userId = req.accessToken ? String(req.accessToken.userId) : null;
    if (!userId) return res.redirect(301, '/login?next=/api/link/ios/config');
    let userCount = await app.models.Account.count({id: userId});
    if (userCount < 1) if (!userId) return res.redirect(301, '/logout?next=login?next=/api/link/ios/config');

    let linkNonce = await app.models.DeviceLinkNonce.create({
      accountId: userId
    });

    if (!linkNonce) return res.status(500).end();

    let nonceId = String(linkNonce.id);

    const configData = {
      PayloadContent: {
        URL: String(compBaseURL + '/api/link/ios/config/' + nonceId),
        DeviceAttributes: [
          'UDID',
          'PRODUCT'
        ]
      },
      PayloadOrganization: String(baseURL),
      PayloadDisplayName: 'Packix Device Link',
      PayloadVersion: 1,
      PayloadUUID: String(nonceId),
      PayloadIdentifier: String(URL_ID + '.device-link'),
      PayloadType: 'Profile Service',
      PayloadDescription: 'This Profile is only used to get your UDID to Link with Packix, you may delete it after.'
    };

    const mConfigPlist = plist.build(configData);
    res.set('Content-Type', 'application/x-apple-aspen-config');
    return res.status(200).send(mConfigPlist);
  } catch (err) {
    return res.status(500).end('Error Occurred');
  }
});

app.post('/api/link/ios/config/:nonce', async (req, res) => {
  try {
    let nonceId = req.params.nonce;
    if (!nonceId) return res.status(500).end('Error Occured');
    let DeviceLinkNonce = app.models.DeviceLinkNonce;
    let nonceObject = await DeviceLinkNonce.findById(String(req.params.nonce));

    if (!nonceObject) return res.status(500).end('Error Occured');

    console.log('Got Nonce Object: ');
    console.log(nonceObject);

    let data = '';
    req.setEncoding('utf8');

    req.on('data', (chunk) => {
      data += chunk;
    });

    req.on('end', async () => {
      req.body = plist.parse(data);
      console.log('Got Config Data: ');
      console.log(req.body);
      console.log(compBaseURL);

      let udid = req.body['UDID'];
      let deviceModel = req.body['PRODUCT'];
      if (!udid || !deviceModel) {
        res.set('Location', compBaseURL + '/account/');
        return res.redirect(301, compBaseURL + '/account/');
      }

      udid = crypto.createHash('sha256').update(String(udid).toLowerCase()).digest('base64');

      let deviceCount = await app.models.Device.count({
        accountId: nonceObject.accountId,
        udid: {neq: udid}
      });

      if (deviceCount >= 5) {
        res.set('Location', compBaseURL + '/account/');
        return res.redirect(301, compBaseURL + '/account/');
      }

      let deviceInfo = await app.models.Device.findOrCreate({
        where: {
          udid: udid,
          accountId: nonceObject.accountId
        }
      }, {
        udid: udid,
        deviceModel: deviceModel,
        deviceVersion: 'UNKNOWN',
        accountId: nonceObject.accountId
      });

      await DeviceLinkNonce.destroyAll({
        accountId: nonceObject.accountId
      });

      let deviceObj = deviceInfo[0];
      console.log(deviceObj);
      res.set('Location', compBaseURL + '/account/');
      return res.redirect(301, compBaseURL + '/account/');
    });
  } catch (err) {
    return res.status(500).end('Error Occurred');
  }
});

passportConfigurator.init(true);

app.use(bodyParser.json({limit: '50mb', expanded:true}));
app.use(bodyParser.urlencoded({
  extended: true,
  parameterLimit: 100000,
  limit: '50mb',
}));


let config = {};
const getProvidersConfig = require(__dirname + '/config/providers.js');

try {
  config = getProvidersConfig(app);
} catch (err) {
  console.error(err);
  console.error('Please configure your passport strategy in `providers.json`.');
  console.error('Copy `providers.json.template` to `providers.json`' +
    ' and replace the clientID/clientSecret values with your own.');
  process.exit(1);
}
// Initialize passport
// Set up related models
passportConfigurator.setupModels({
  userModel: app.models.Account,
  userIdentityModel: app.models.AccountIdentity,
  userCredentialModel: app.models.AccountCredential,
});
// Configure passport strategies for third party auth providers
for (let s in config) {
  let c = config[s];
  c.session = c.session !== false;
  passportConfigurator.configureProvider(s, c);
}


app.use('/admin/*', async function(req,res,next) {
  let userId = req.accessToken ? String(req.accessToken.userId) : null;
  console.log('Token ID: ' + userId);
  if (!userId) res.status(403).end();
  let devCount = await app.models.DeveloperPreferences.count({
    accountId: String(userId)
  });
  console.log(devCount);
  if (devCount > 0) return next();
  return res.status(403).end();
});

app.use('/', loopback.static(path.resolve(__dirname, '../dist'), {redirect: false}));


