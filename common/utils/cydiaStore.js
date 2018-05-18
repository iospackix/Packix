'use strict';

const crypto = require('crypto');
const request= require('request-promise');

const safeBase64 = function(value) {
  value = String(value);
 // value = Buffer.from(value).toString('base64');
  console.log('Base 64 Encoded Value: '+ value);
  value = value.replace(/=/gi, '');
  console.log('Replace Equals' + value);
  value = value.replace(/\//gi, "_");
  value = value.replace(/\+/gi, "-");
  return value;
};

const parseQuery = (queryString) => {
  let query = {};
  let pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
  for (let i = 0; i < pairs.length; i++) {
    let pair = pairs[i].split('=');
    query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
  }
  return query;
};


const checkUDID = async (packageIdentifier, deviceUDID, cydiaToken, cydiaVendor) => {
  try {
    let queryString = "api=store-0.9&device=";
    let dateNow = Math.floor(new Date().getTime() / 1000);
    queryString += String(deviceUDID).toLowerCase();
    queryString += "&mode=local&nonce=";
    queryString += dateNow;
    queryString += "&product=";
    queryString += packageIdentifier;
    queryString += "&timestamp=";
    queryString += dateNow;
    queryString += "&vendor=";
    queryString += cydiaVendor;

    let hmacSig = crypto.createHmac('sha1', cydiaToken).update(queryString).digest("base64");
    console.log('HMAC: ' + hmacSig);
    hmacSig = safeBase64(hmacSig);
    console.log('Hmac Sig: ' + hmacSig);
    queryString += "&signature=";
    queryString += hmacSig;

    let reqOptions = {
      uri: "http://cydia.saurik.com/api/check?" + queryString,
      method: "GET"
    };

    let response = await request(reqOptions);
    console.log(response);
    if (typeof response === 'string') {
      let queryDict = parseQuery(response);
      if (queryDict.hasOwnProperty('state')) {
        if (String(queryDict['state']) === 'completed') {
          return Promise.resolve(true);
        }
      }
    }
    return Promise.resolve(false);
  } catch (err) {
    console.log(err);
    return Promise.resolve(false);
  }
};

module.exports = {
  checkUDID
};
