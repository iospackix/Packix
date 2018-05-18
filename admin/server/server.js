const express = require('express');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const cookieParser = require('cookie-parser');


// get port from env variable
const port = parseInt(process.env.PORT, 10) || 8080;

let app = express();
app.set('port', port);
app.set('trust proxy', true);


if (String(process.env['DOCKER_BUILDING']) === '0') {

  // get cookie secret from environment variables
  const SECRETCOOKIE = process.env['COOKIE_SECRET'];

  // connect to session store

  const sessionStore = new MongoStore({
    url: 'mongodb://' + process.env['MONGODB_HOST'] + '/' +  process.env['MONGODB_PORT']
  });
  // trust proxy

  // set cookie secret
  app.set('cookieSecret', SECRETCOOKIE);

  // parse cookie
  app.use(cookieParser(app.get('cookieSecret')));

  // connect to other Packix sessions
  app.use(session({
    secret: app.get('cookieSecret'),
    resave: false,
    saveUninitialized: true,
    proxy: undefined,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      secure: true,
      httpOnly: true,
      path: "/"
    },
    unset: 'destroy',
    store: sessionStore
  }));

  //tell express that we want to use the www folder
  //for our static assets

  app.use('*', async (req, res, next) => {
    //if (req.session && req.session.user && req.session.user.id) {
      return next();
    // } else {
    //   console.log(req.session.user);
    //   return res.status(403).end();
    // }
  });

  app.use(express.static(path.join(__dirname, './dist')));

  // Listen for requests
}

let server = app.listen(app.get('port'), () => {
  console.log('The server is running on http://localhost:' + app.get('port'));
});
