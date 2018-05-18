// import React from 'react';
import React, { Component as ReactComponent } from 'react';
import Head from '../components/head';
// import Moment from 'react-moment';
const Rating = require('react-rating');
const AccountApi = require('./../shared/sdk/services/custom/Account.js')['AccountApi'];
import { LoopBackConfig } from './../shared/sdk/lb.config';
//import SDK, { Component } from '../shared/sdk/';
//import * as Services from './../shared/sdk/services';

class Package extends ReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      accountData: {},
      isReady: false,
      isLoggedIn: true
    };
  }


  static async getInitialProps({ req, params }) {
    //  return {};
    //console.log(req);
    //console.log(req);

    //  if (req) {

    // console.log(params);
    // const Services = await import('./../shared/sdk/services/index.js');
    // const moment = await import('moment');
    // let packageId = null;

    if (req) {
      const protocol = req.headers['x-forwarded-proto'] || 'http';
      const baseUrlFull = req ? `${protocol}://${req.headers.host}` : '';
      LoopBackConfig.setBaseURL(baseUrlFull);
      // packageId = req.params["id"];
      // if (!packageId) {
      //   packageId = req.query['id'];
      // }
      //
      // if (!packageId) {
      //   // console.log(req);
      // }

      // console.log(req.params);
      // console.log(packageId);
      //console.log(packageId);
      // console.log(req.params.id);
      // console.log(req.query["package"]);
      // this['AccountApi'] = new Services['AccountApi']();
      // let cookie = req.headers['cookie'];
      // if (cookie && cookie.length > 0) {
      //   const getCookie = function(name) {
      //     let cookiestring = RegExp("" + name + "[^;]+").exec(cookie);
      //     // Return everything after the equal sign, or an empty string if the cookie name not found
      //     return decodeURIComponent(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./, "") : "");
      //   };
      //
      //   let tokenId = getCookie('access_token');
      //   let userId = getCookie('userId');
      //   this['AccountApi'].auth.setToken({
      //     id: tokenId,
      //     userId: userId
      //   });
      //
      //   console.log(tokenId);
      //   console.log(userId);
      // }
      // // let cookiestring=RegExp(""+cookiename+"[^;]+").exec(req.headers.cookie);
      // // // Return everything after the equal sign, or an empty string if the cookie name not found
      // // return decodeURIComponent(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./,"") : "");
      // //this.AccountApi.authenticate(null, req.headers);
      // // console.log(req.cookies);
      // const data =  await this['AccountApi'].getMe({
      //   'Cookie': req.headers['cookie']
      // }).first().toPromise();

      // console.log(data);
      // let descriptionHTML = "";
      // if (data["detailedDescription"]) {
      //   const QuillDeltaToHtmlConverter = await import('quill-delta-to-html');
      //   const quillConverter = new QuillDeltaToHtmlConverter(data["detailedDescription"]["ops"], {});
      //   descriptionHTML = quillConverter.convert();
      // }
      //
      let url = LoopBackConfig.getPath();
      url += "/account";
      // url += data["identifier"];
      //
      // if (!data.latestVersion.changes) data.latestVersion.changes = [];
      // if (!data.screenshots) data.screenshots = [];
      // // console.log(data.latestVersion.createdOn);
      // //data.latestVersion.createdOn = new Date(data.latestVersion.createdOn);
      // // console.log(data.latestVersion.createdOn);
      //
      // if (!descriptionHTML || descriptionHTML.length < 1) {
      //   descriptionHTML = '<h5 style="text-align:center;">This package currently does not have a description</h5>';
      // }
      //
      let urlDict = {
        "url": url
      };
      //
      // if (data.latestVersion.ratingStats) {
      //   data.latestVersion.ratingStats.ratings.sort((a, b) => {
      //     return a.value - b.value;
      //   });
      // }
      //
      // let lightboxImages = [];
      //
      // for (let screenshot of data.screenshots) {
      //   lightboxImages.push('/api/PackageScreenshots/' + screenshot.id + '/download.jpg?size=full')
      // }
      //
      // let recentReviews = data.latestVersion.recentReviews;
      // let reviewIds = {};
      // for (let review of recentReviews) {
      //   reviewIds[review.id] = true;
      // }
      //
      // if (recentReviews.length < 3) {
      //   for (let review of data.recentReviews) {
      //     if (recentReviews.length >= 3) break;
      //     if(reviewIds[review.id]) {
      //       continue;
      //     } else {
      //       recentReviews.push(review);
      //       reviewIds[review.id] = true;
      //     }
      //   }
      // }
      //
      // for (let review of recentReviews) {
      //   review.updatedOn = moment(review.updatedOn).format("ll");
      // }

      const isCydia = req.headers['user-agent'].search(/Cydia/) !== -1;
      const baseURL = LoopBackConfig.getPath();


      return {
        data: {},
        title: 'Account',
        description: 'Account Page',
        isCydia: isCydia,
        url: urlDict,
        accountData: null,
        baseURL: baseURL
      }
    }
    // } else {
    //   var slug = $(this).attr('href').split('/');
    //   slug = slug[slug.length - 2];
    // }

    return {};
    // const data = await this.PackageApi.find().first().toPromise();
    // console.log(data);
    // return {
    //   data: data.toString()
    // }
  }

  async componentDidMount() {
    LoopBackConfig.setBaseURL(this.props.baseURL);
    this.setState({ isReady: false, isLoggedIn: true });
    // const AccountApi = (await import('./../shared/sdk/services/custom/Account.js'))['AccountApi'];
    this['AccountApi'] = new AccountApi();
    this['AccountApi'].getMe(null).first().toPromise()
      .then(data => {
        if (!data['profileName']) {
          window.location.href = '/login?next=/account/';
        }
        this.setState({ accountData: data, isReady: true, isLoggedIn: data['profileName'].length > 0 ? true : false });
      });
    // this.setState({
    //   accountData: accountData
    // });
    // console.log(this.props.accountData);
    // this.PackageApi.find().subscribe(data => {
    //   console.log(data);
    //   this.props.data = data;
    // })
  }

  packagePurchase(purchase, index) {

    if (!purchase.package) {
      purchase.package = {
        name: 'Unknown'
      }
    }
      if (purchase['status'] !== 'Unknown') {
        return (
          <a class="pkgLink" href={'/account/purchases/' + purchase.id + '/'}>
            <panel className="modern" key={index}>
              <panel-body class="package-purchase" style={{fontSize: '16px', fontWeight: '600', letterSpacing: '1px'}}>
                <h4>{purchase.package.name}<span className={"badge " + {
                  'Completed': 'badge-success',
                  'Failed': 'badge-error',
                  'Reversed': 'badge-error',
                  'Pending': 'badge-info',
                  'Refunded': 'badge-error'
                }[purchase['status']]}>{purchase['status']}</span></h4>
                <p style={{marginBottom: '0px'}}>#{purchase.id}</p>
              </panel-body>
            </panel>
          </a>
        )
      }
    return null;
  }

  packageGift(gift, index) {
    if (gift.package) {
      return (
        <a class="pkgLink" href={'/package/' + gift.package.identifier}>
          <panel className="modern" key={index}>
            <panel-body class="package-purchase" style={{fontSize: '16px', fontWeight: '600', letterSpacing: '1px'}}>
              <h4>{gift.package.name}</h4>
              <p style={{marginBottom: '0px'}}>#{gift.id}</p>
            </panel-body>
          </panel>
        </a>
      )
    } else return null;
  }

  userDevice(device, index) {
      return (
        <panel className="modern" key={ index }>
          <panel-body class="user-device" style={{ fontSize: '16px', fontWeight: '600', letterSpacing:'1px'}}>
            <h4>{device.deviceModelName}</h4>
            <p style={{marginBottom: '0px'}}>#{device.id}</p>
          </panel-body>
        </panel>
      )
  }

  linkedAccount(identity, index) {
    if (identity['provider'] === 'patreon') {
      return (
        <panel className="modern panel-mini" key={ index }>
          <panel-body class="green-gradient patreon" style={{ fontSize: '16px', fontWeight: '600', letterSpacing:'1px'}}>
            <div style={{paddingTop: '0px'}} className="reviews-more">
              <label style={{color: 'white !important'}}>Patreon</label>
            </div>
          </panel-body>
        </panel>
      )
    } else if (identity['provider'] === 'facebook') {
      return (
        <panel className="modern panel-mini" key={ index }>
          <panel-body class="green-gradient facebookt" style={{ fontSize: '16px', fontWeight: '600', letterSpacing:'1px'}}>
            <div style={{paddingTop: '0px'}} className="reviews-more">
              <label style={{color: 'white !important'}}>Facebook</label>
            </div>
          </panel-body>
        </panel>
      )
    } else if (identity['provider'] === 'google') {
      return (
        <panel className="modern panel-mini" key={ index }>
          <panel-body className="green-gradient google" style={{ fontSize: '16px', fontWeight: '600', letterSpacing:'1px'}}>
            <div style={{paddingTop: '0px'}} className="reviews-more">
              <label style={{color: 'black'}}>Google</label>
            </div>
          </panel-body>
        </panel>
      )
    } else {
      return null;
    }
  }


  render() {
    const { accountData, isReady, isLoggedIn } = this.state;
    return (
      <div>
        <Head title={this.props.title} description={this.props.description} url={this.props.url.url} />
        <style jsx global>{`
          body {
               -webkit-text-size-adjust:none;
               -webkit-touch-callout:none;
               -webkit-user-select:text;
               -webkit-tap-highlight-color: rgba(0,0,0,0);
               margin: 9px auto;
               width: 100vw;
               max-width: 414px !important;
               background-color: #f4f4f4;
               min-font-size: 13px;
               text-align:center;
               font-family: "SF Pro Display","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif;
               font-weight:500;
               font-size:15px;
           }

           .package-screenshots {
              text-align:center;
              height:100%;
              margin-left: -3%;
              margin-right: -3%;
           }

           .screenshot {
            text-align: center;
            display: inline-block;
            margin: auto;
            width: 100% !important;
            height: auto !important;
           }

           .screenshotContainer {
            width: 44%;
            display: inline-block;
            text-align: center;
            margin: 3%;
           }

           .rating-stats-container {
            width: 75%;
            float: right;
           }
           .rating-stats {
            width: 100%;
           }

           .rating-stats > tbody > tr {
            border-bottom: 1.685px solid transparent;
           }

           .rating-stats > tbody > tr > td {
             width: 26%
             margin: 0px;
             padding: 0px;
             text-align: right;
             color: #eebd10;
             letter-spacing: 2.25px;
             font-size: 5.25px;
           }

           .rating-stats > tbody > tr > td:nth-child(2) {
              width: 65%;
              margin: 0px;
              padding: 0px;
              text-align: left;
              padding-left: 4%;
              height: 5.625px;
           }


           .rating-bar {
            width: 100%;
            height: 2.25px;
            margin-top: 1.6875px;
            margin-bottom: 1.6875px;
            background-color: #ececec;
            display: block;
            overflow: hidden;
            border-radius: 1px;
           }

           .rating-bar > .rating-fill {
              display: block;
              height: 3px;
              background-color: #999;

           }

           .rating-overall {
            width: 25%;
            text-align: center;
            margin-top: -7px;
            display: inline-block;
           }

           .rating-overall-header {
             font-size: 52px;
              font-weight: 700;
              display: block;
           }

           .rating-overall-footer {
            font-size: 13px;
            font-weight: 700;
             color: #999;
           }

           .ratings-count {
              font-size: 14px;
              color: #b9b9b9;
              float: right;
              text-align: right;
              margin-top: 5px;
              letter-spacing: 0.5px;
           }

           .screenshot-viewer {
              overflow: -moz-scrollbars-none;
              overflow: scroll;
              overflow-x: auto;
              overflow-y: hidden;
              -webkit-overflow-scrolling: touch;
              overflow-scrolling: touch;
              width: auto;
              min-width: 100%;
              white-space: nowrap;
              margin-left: -6px;
              margin-right: -6px;
              padding-left: 6px;
              padding-right: 6px;
              list-style: none;
              margin-top: 15px;
              -ms-overflow-style: none;
           }

           .screenshot-viewer::-webkit-scrollbar {
              display: none;  // Safari and Chrome
            }

           .screenshot-item {
              margin: 0;
              padding: 0;
              display: inline-block;
              vertical-align: bottom;
              font-size: 13px;
              margin-right: 6.25px;
              margin-left: 6.25px;
           }

           .screenshot-item:first-child {
              margin-left: 0px;
           }

           .screenshot-item:last-child {
              margin-right: 0px;
           }


           .screenshot-img {
            margin: 0;
            position: relative;
            z-index: 1;
            height: 230px;
            width: auto;
            border-radius: 6px;
            overflow: hidden;
           }

           .changes-more {
            margin-right: -20px;
            margin-left: -20px;
            padding-left: 20px;
            padding-right: 20px;
            text-align: center;
            padding-top: 15px;
            padding-bottom: 12px;
            width: 100%;
            display: block;
            margin-top: 0px;
            margin-bottom: -12px;
            text-decoration: none !important;
            -webkit-background-clip: text;
            margin-top: 0px;
           }

           .changes-more label {
            font-size: 16px;
            font-weight: 700;
            line-height: 0;
            text-decoration: none !important;
            color: #484848;
            letter-spacing: 0.5px;
            -webkit-background-clip: text;
            background: linear-gradient(90deg,#30c381, #089e46);
            -webkit-text-fill-color: transparent;
            -webkit-background-clip: text;
           }

           .fading-sep {
            margin-top: 10px;
            height: 1px;
            background: linear-gradient(90deg,white, #dddddd, white);
           }

           .hidden {
            display: none;
           }

           .user-rate-action {
             width: 1005;
             text-align: center;
             font-size: 25px;
             margin-top: -7px;
             -webkit-background-clip: text;
           }

           .user-rate-action .far:before {
            background: linear-gradient(-45deg,#f0ad0d,#fffb15);
            -webkit-text-fill-color: transparent;
            -webkit-background-clip: text;
           }

           .user-rate-action .fas:before {
            background: linear-gradient(-45deg,#f0ad0d,#fffb15);
            -webkit-text-fill-color: transparent;
            -webkit-background-clip: text;
           }

           .review-list {
            list-style:none;
            padding: 8px 0px;
            margin-left: -5px;
            margin-right: -5px;
           }

           .review-list li {
            background-color: #f8f8f8;
            border-radius: 7.5px;
            overflow: hidden;
            padding: 13px 16px;
            margin-bottom: 12px;
           }

           .review-list li:last-child {
            margin-bottom: 0px;
           }

           .review-header {
              display: flex;
              flex-wrap: nowrap;
              -webkit-box-pack: justify;
              justify-content: space-between;
              -webkit-box-align: center;
              align-items: center;
              margin-bottom: 0px;
           }

           .review-title {
            flex: 1 1 auto;
            font-size: 14px;
            line-height: 1.38462;
            font-weight: 800;
            letter-spacing: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #111;
           }

           .review-version {
              white-space: nowrap;
              font-size: 13px;
              line-height: 1.38462;
              font-weight: 400;
              letter-spacing: 0;
              text-align: right;
              color: #8e8e93;
           }

           .review-subheader {
               margin-bottom: 8px;
              display: flex;
              -webkit-flex-wrap: nowrap;
              -ms-flex-wrap: nowrap;
              flex-wrap: nowrap;
              -webkit-box-pack: justify;
              -webkit-justify-content: space-between;
              -ms-flex-pack: justify;
              justify-content: space-between;
              -webkit-box-align: center;
              -webkit-align-items: center;
              -ms-flex-align: center;
              align-items: center;
           }

           .review-rating {
             display: inline-block;
             marign: 0px;
             padding:0px;
             font-size: 11px;
             color: #eebd10;
           }

           .review-date {
              color: #8e8e93;
              margin-left: 5px;
              font-size: 13px;
              line-height: 1.38462;
              font-weight: 400;
              letter-spacing: 0;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
           }

           .review-description {
            font-size: 13px;
            line-height: 1.38462;
            font-weight: 400;
            letter-spacing: 0;
            color: #333;
            font-weight: 400
            margin-bottom: 0px;
           }

           .sf-text {
            font-family: "SF Pro Text","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif;
           }

           .reviews-more {
              margin-right: -20px;
              margin-left: -20px;
              padding-left: 20px;
              padding-right: 20px;
              text-align: center;
              padding-top: 15px;
              padding-bottom: 12px;
              width: 100%;
              display: block;
              margin-top: 0px;
              margin-bottom: -12px;
              text-decoration: none !important;
              margin-top: 0px;
           }

           .review-more label {
            font-size: 16px;
            font-weight: 700;
            line-height: 0;
            text-decoration: none !important;
            color: white !important;
            letter-spacing: 0.5px;
           }

          .green-gradient {
           background: linear-gradient(90deg,#30c381, #089e46) !important;
          }

          .profile-section {
            width: 75%;
            margin: auto;
            margin-top: 60px;
          }

          .profile {
           text-align: center;
          }

          .profile .profile-img {
            border-radius: 50%;
            height: 75px;
            width: 75px;
            margin-bottom: 10px;
            margin-top: 10px;
          }

          .profile .profile-name {
            font-size: 28px;
            color: black;
          }

          .profile .profile-email {
           font-size: 18px;
           color: #afafaf;
           font-weight: 600;
          }

          .link-button {
            width: 80%;
            padding: 12px 0px;
            border-radius: 10px;
            overflow: hidden;
            margin: auto;
            margin-top: 25px;
            text-align: left;
            padding-left: 20px;
            margin-bottom: 18px;
            background: linear-gradient(270deg, #16da82, #29a56d) !important;
            font-family: "SF Pro Text","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif;
          }

          .link-device {

          font-size: 14px;
          font-weight: 400;
          color: white;
          text-align: left;
          }

          .link-icon {
          float: right;
          margin-right: 20px;
          }

          .linked-accounts {
          margin:auto;
           margin-top:30px;
           text-align: center;
           width:90%;
          }

          .linked-header {
          font-size:22px;
          font-weight: 700;
          }

          .green-gradient {
           background: linear-gradient(270deg, #16da82, #29a56d);
           }

          .panel-mini {
            width: 50%;
            display: inline-block;
            font-size: 18px;
            margin-bottom: 14px;
            float: left;
          }

          .reviews-more {
          border: none !important;
          color: white;
          }

          .facebook {
           background: linear-gradient(270deg, #16da82, #29a56d) !important;
               box-shadow: 2px 2px 40px -12px #999;
           color: white;
          }

          .patreon {
           background: #f96854 !important;
               box-shadow: 2px 2px 40px -12px #999;
           color: white;
          }

          .google {
           background: white !important;
               box-shadow: 2px 2px 40px -12px #999;
           color: black;
          }

          .link-more {
           background: linear-gradient(270deg, #16da82, #29a56d)!important;
            box-shadow: 2px 2px 40px -12px #999;
           }

           .pkgLink {
            text-decoration: none !important;
           }

           .package-purchase span.badge {
            font-size: 9px;
            color: white;
            font-weight: 500;
            float: right;
            margin-top: 1px;
            margin-bottom: 1px;
            display: block;
            padding: 4px;
            border-radius: 5px;
            font-family: "SF Pro Text","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif !important;
           }

           .badge-success {
            background-color: #16b558;
           }

           .badge-error {
            background-color: #eb4545;
           }

           .badge-info {
            background-color: #1b97ef;
           }

        `}
        </style>
        <div>
          {isReady === false && isLoggedIn === true ? (
          <div></div>
          ) : (
          <div className="contents-container">
            <panel className="modern profile-section">
              <panel-body style={{fontSize: '14px'}}>
                <div className="profile-placeholder">
                  <img className="profile-img"/>
                  <h3 className="profile-name" />
                  <h5 className="profile-email" />
                </div>
                <div>
                  <div className="profile">
                    <img className="profile-img" src={accountData['profilePhoto']}/>
                    <h3 className="profile-name">{accountData['profileName']}</h3>
                    <h5 className="profile-email">{accountData['profileEmail']}</h5>
                  </div>
                  <div className="link-button" style={{ background: 'linear-gradient(270deg, #16da82, #29a56d) !important', fontSize: '16px', fontWeight: '700', letterSpacing:'0.5px'}}>
                    <a style={{paddingTop: '0px'}} className="link-device" target="_blank" href={'/api/link/cydia'}>
                      <label style={{color: 'white !important'}}>Link Your Device...<i className="fas fa-arrow-right link-icon"></i></label>
                    </a>
                  </div>
                </div>
              </panel-body>
            </panel>
            <div className="linked-accounts">
              <h2 className="linked-header">Linked Accounts</h2>
              {accountData.identities.map((identity, index) => {
                return this.linkedAccount(identity, index)})}
              <panel className="modern panel-mini">
                <panel-body class="green-gradient link-more" style={{ fontSize: '16px', color: 'white !important', fontWeight: '700', letterSpacing:'1px'}}>
                  <a style={{paddingTop: '0px'}} className="reviews-more" target="_blank" href={'/link'}>
                    <label style={{color: 'white !important'}}>Link More</label>
                  </a>
                </panel-body>
              </panel>
            </div>
            {accountData.devices.length > 0 && (
              <div className="linked-accounts">
                <h2 className="linked-header">Linked Devices</h2>
                {accountData.devices.map((device, index) => {
                  return this.userDevice(device, index)})}
              </div>
            )}
            {accountData.packagePurchases.length > 0 && (
              <div className="package-purchases">
                <h2 className="purchases-header">Purchases</h2>
                {accountData.packagePurchases.map((purchase, index) => {
                  return this.packagePurchase(purchase, index)})}
              </div>
            )}
            {accountData.packageGifts.length > 0 && (
              <div className="package-purchases">
                <h2 className="purchases-header">Gifted Packages</h2>
                {accountData.packageGifts.map((gift, index) => {
                  return this.packageGift(gift, index)})}
              </div>
            )}
          </div>
          )}
        </div>
      </div>
    )
  }
}

export default Package;
