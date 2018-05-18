const es6Renderer = require('express-es6-template-engine');
const fs = require('fs');

const loginText = String(fs.readFileSync(__dirname + '/login.html'));

const precompiled = es6Renderer(loginText, 'redirectURL');

module.exports = function(redirectURL) {
  return loginText;
  //return precompiled(redirectURL);
};
