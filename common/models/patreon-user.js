'use strict'

const patreonAPI = require('patreon').patreon;
const jsonApiURL = require('patreon').jsonApiURL;
const JsonApiDataStore = require('jsonapi-datastore').JsonApiDataStore;
const request = require('request');
const TokenProvider = require('refresh-token');

// var tokenProvider = new TokenProvider('http://token-url', {
//   refresh_token: 'refresh token',
//   client_id:     'client id',
//   client_secret: 'client secret'
//   /* you can pass an access token optionally
//   access_token:  'fdlaksd',
//   expires_in:    2133
//   */
// });

const PATREON_CREATOR_ACCESS_TOKEN = process.env['PATREON_CREATOR_ACCESS_TOKEN'];

const getPledgesForUrl = async (nextUrl, accessToken, accountId, withEmail) => {
  const client = patreonAPI(accessToken);

  let urlString = jsonApiURL(nextUrl, {
    fields: {
      pledge: [
        'amount_cents',
        'total_historical_amount_cents',
        'declined_since',
        'created_at',
        'pledge_cap_cents',
        'patron_pays_fees',
        'is_paused'
      ]
    }
  });
  urlString = urlString.replace('[', '%5B');
  urlString = urlString.replace(']', '%5D');
  console.log('URL: ' + urlString);
  let results = await client(urlString);
  let store = results['store'];
  nextUrl = results.rawJson['links']['next'];
  if (nextUrl) {
    nextUrl = nextUrl.replace('https://www.patreon.com/api/oauth2/api', '');
    console.log(nextUrl);
  }
  const pledges = store.findAll('pledge');
  let allPledges = [];
  for (let pledge of pledges) {
    let pledgeData = pledge.serialize().data;
    let patronData = pledge.patron.serialize().data;
    if (pledge) {
      let amountPledged = pledgeData.attributes['amount_cents'];
      //if (amountPledged > 0 && pledgeData.attributes['is_paused'] === false) {
        let pledgeInfo = {
          id: pledgeData.id,
          amount: pledgeData.attributes['amount_cents'],
          createdAt: pledgeData.attributes['created_at'],
          patreonId: patronData.id,
          isPaused: pledgeData.attributes['is_paused'],
          isDeclined: String(pledgeData.attributes['declined_since']).length > 9,
          historicalAmount: pledgeData.attributes['total_historical_amount_cents'],
          accountId: String(accountId)
        };
        if (withEmail === true) {
          pledgeInfo.userEmail = patronData.attributes['email'];
        }
        allPledges.push(pledgeInfo);
      //}
    }
  }
  return Promise.resolve({
    pledges: allPledges,
    next: nextUrl
  })
};

const getPledgesForCampaignId = async (campId, accessToken, accountId, withEmail) => {
  let allPledges = [];
  let nextUrl = '/campaigns/' + campId + '/pledges?include=patron&page%5Bcount%5D=50&sort=created';
  while (nextUrl && nextUrl.length > 0) {
    let returnData = await getPledgesForUrl(nextUrl, accessToken, accountId, withEmail);
    for (let pledgeInfo of returnData.pledges) {
      allPledges.push(pledgeInfo);
    }
    nextUrl = returnData['next'];
  }
  return Promise.resolve(allPledges);
};


const getPatreonUsersInfoAsync = async (accessToken, accountId, withEmail) => {
  try {
    let allCamps = [];
    let allUsers = [];
    let patreonAPIClient = patreonAPI(String(accessToken));
    let url = jsonApiURL('/current_user/campaigns?include=rewards,creator');

    let results = await patreonAPIClient(url);
    let store = results['store'];
    // console.log(results.rawJson);

    let jsonData = results.rawJson;

    for (let camp of jsonData.data) {
      console.log(camp);
      let campInfo = {
        id: camp['id'],
        name: camp.attributes['creation_name'],
        pledgeCount: camp.attributes['patron_count'],
        pledgeSum: camp.attributes['pledge_sum']
      };
      console.log(campInfo);
      let pledges = await getPledgesForCampaignId(campInfo.id, accessToken, accountId, withEmail);

      let pledgesObj = {};
      for (let pledge of pledges) {
        pledgesObj[pledge['patreonId']] = pledge;
      }

      for (let userId in pledgesObj) {
       let userObj = pledgesObj[userId];

       let userData = {
         accountId: accountId,
         patreonId: userObj['patreonId'],
         isDeclined: userObj['isDeclined'],
         pledgePaused: userObj['isPaused'],
         pledgeAmount: userObj['amount'],
         historicalPledgeAmount: userObj['historicalAmount'],
       };

       if (withEmail === true) {
         userData.userEmail = userObj['userEmail'];
       }
       allUsers.push(userData);
      }
     // console.log('Pledge Count: ' + count);
      // console.log(pledges.length);
      allCamps.push(campInfo);
    }
    return Promise.resolve(allUsers);
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports = function(Patreonuser) {

  Patreonuser.getPatreonUsersInfoAsync = getPatreonUsersInfoAsync;
  Patreonuser.refreshDataAsync = async () => {
      try {
        let devPrefs = await Patreonuser.app.models.DeveloperPreferences.find({
          where: {
            usePatreon: true
          }
        });

        for (let devPrefObj of devPrefs) {
          // console.log('syncing devPreds: ' + devPrefObj);
          let devPref = devPrefObj;
          if (devPref.toJSON) devPref = devPref.toJSON();
          console.log('syncing devPrefs: ' + devPref.accountId);
          let creatorToken = devPref.patreonAccessToken;
          if (creatorToken && creatorToken.length > 0) {
            try {
              let users = await getPatreonUsersInfoAsync(creatorToken, devPref.accountId, false);
              console.log('got patreon info async');
              let deletedCount = await Patreonuser.destroyAll({
                accountId: devPref.accountId
              });
              let usersData = await Patreonuser.create(users);
            } catch (err) {
              // let tokenProvider = new TokenProvider('https://www.patreon.com/api/oauth2/token', {
              //   refresh_token: 'ofIxYNuzOcoErg3leigLjv49utgn-cXI2vqWnNFc3GQ',
              //   client_id:     'cAxq5pCsVGf_FCA-1m1rFAs4jRzMzVs7l42VOHRQaB4MORjFzJRe01xoDv9uvhxJ',
              //   client_secret: 'X7Oe0XZJa3yZOwpmiVUYlFkRkUKkIqCskbQFG3MfH-UJDhjt49NQbR2FPzmAqn7x'
              //   /* you can pass an access token optionally
              //   access_token:  'fdlaksd',
              //   expires_in:    2133
              //   */
              // });
              //
              // tokenProvider.getToken(function (err, token) {
              //   console.log(err);
              //   console.log(token);
              // });
              console.log(err);
            }
          }
        }
        //
        // let users = await getPatreonUsersInfoAsync();
        // let stuff = await Patreonuser.destroyAll({});
        //
        // let usersData = await Patreonuser.create(users);
        // console.log(usersData);

        return Promise.resolve(true);
      } catch (err) {
        console.log(err);
        return Promise.reject(err);
      }
  };


  Patreonuser.refreshData = function (cb)  {
    Patreonuser.refreshDataAsync().then((completed) => {
      cb(null, {'status': 'success'});
    }).catch((err) => {
      cb(null, {'status': 'error'});
    })
  };

  // Patreonuser.remoteMethod(
  //   'refreshData', {
  //     description: 'Refresh User Data',
  //     returns: {
  //       type: 'object', root: true
  //     },
  //     http: {path:'/refreshData', verb: 'get'}
  //   }
  // );

  Patreonuser.remoteMethod(
    'refreshData', {
      description: 'Refresh User Data',
      returns: {
        type: 'object', root: true
      },
      http: {path:'/refreshData', verb: 'get'}
    }
  );
};
