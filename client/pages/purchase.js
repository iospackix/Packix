// import React from 'react';
import React, { Component as ReactComponent } from 'react';
import Head from '../components/head';
// import Moment from 'react-moment';
const Rating = require('react-rating');
const PurchaseApi = require('./../shared/sdk/services/custom/PackagePurchase.js')['PackagePurchaseApi'];
// const moment = require('moment');
import Moment from 'react-moment';
import {LoopBackConfig} from "../shared/sdk/lb.config";
//import SDK, { Component } from '../shared/sdk/';
//import * as Services from './../shared/sdk/services';

class Purchase extends ReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      purchaseData: {},
      isReady: false,
      isLoggedIn: true,
      refundReason: undefined,
      refundError: undefined
    };

    this.submitRefundRequest = function() {
      if (this.state.refundReason !== undefined && this.state.refundReason.length > 0) {
        console.log(this.state);
        this['PurchaseApi'].createRefundRequest(this.state.purchaseData.id, this.state.refundReason).first().toPromise().then((data) => {
          console.log(data);
          this['PurchaseApi'].findById(this.props.purchaseId, {
            include: ['refundRequest', 'account']
          }).first().toPromise().then(data => {
            console.log(data);
            if (!data['accountId']) {
              window.location.href = '/account/';
            }
            this.setState({ purchaseData: data, isReady: true, isLoggedIn: data['accountId'].length >= 1, refundReason: data.refundRequest ? data.refundRequest.reason : undefined, refundError: undefined });
          }).catch((err) => {
            this.setState({refundError: 'Error: An error occurred when trying to create the Refund Request'});
          });
        });
      } else {
        this.setState({refundError: 'Error: You must give a reason in order to request a refund'});
      }
      console.log('The Submit Button was Pressed');
    }
  }


  static async getInitialProps({ req, params }) {
    //  return {};
    //console.log(req);
    //console.log(req);

    //  if (req) {

    // console.log(params);
    // const Services = await import('./../shared/sdk/services/index.js');
    // const moment = await import('moment');
    //let purchaseId = null;

    if (req) {
      const protocol = req.headers['x-forwarded-proto'] || 'http';
      const baseUrlFull = req ? `${protocol}://${req.headers.host}` : '';
      LoopBackConfig.setBaseURL(baseUrlFull);
      let purchaseId = req.params["id"];
      if (!purchaseId) {
        purchaseId = req.query['id'];
      }
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
      url += "/account/purchases/" + String(purchaseId) + '/';
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


      return {
        data: {},
        title: 'Package Purchase',
        description: 'Package Purchase',
        isCydia: isCydia,
        url: urlDict,
        purchaseId: purchaseId,
        purchaseData: null
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
    this.setState({ isReady: false, isLoggedIn: true });
    // const AccountApi = (await import('./../shared/sdk/services/custom/Account.js'))['AccountApi'];
    this['PurchaseApi'] = new PurchaseApi();
    this['PurchaseApi'].createRefundRequest = function(id, reason, customHeaders) {
      let _method = "POST";
      let _url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
        "/PackagePurchases/:id/createRefundRequest";
      let _routeParams = {
        id: id
      };
      let _postBody = {
        reason: String(reason)
      };
      let _urlParams = {};


      //if (typeof reason !== 'undefined' && reason !== null) _urlParams.reason = reason;
      let result = this.request(_method, _url, _routeParams, _urlParams, { _postBody }, null, customHeaders);
      return result;
    };

    this['PurchaseApi'].findById(this.props.purchaseId, {
      include: ['refundRequest', 'account']
    }).first().toPromise()
      .then(data => {
        console.log(data);
        if (!data['accountId']) {
          window.location.href = '/login?next=/account/';
        }
        this.setState({ purchaseData: data, isReady: true, isLoggedIn: data['accountId'].length >= 1, refundReason: data.refundRequest ? data.refundRequest.reason : undefined });
      }).catch((err) => {
      window.location.href = '/login?next=/account/';
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

  // packagePurchase(purchase, index) {
  //   if (purchase['status'] !== 'Unknown') {
  //     return (
  //       <a class="pkgLink" href={'/package/' + purchase.package.identifier}>
  //         <panel className="modern" key={ index }>
  //           <panel-body class="package-purchase" style={{ fontSize: '16px', fontWeight: '600', letterSpacing:'1px'}}>
  //             <h4>{purchase.package.name}</h4>
  //             <p style={{marginBottom: '0px'}}>#{purchase.id}</p>
  //           </panel-body>
  //         </panel>
  //       </a>
  //     )
  //   } else return null;
  // }
  //
  // packageGift(gift, index) {
  //   return (
  //     <a class="pkgLink" href={'/package/' + gift.package.identifier}>
  //       <panel className="modern" key={ index }>
  //         <panel-body class="package-purchase" style={{ fontSize: '16px', fontWeight: '600', letterSpacing:'1px'}}>
  //           <h4>{gift.package.name}</h4>
  //           <p style={{marginBottom: '0px'}}>#{gift.id}</p>
  //         </panel-body>
  //       </panel>
  //     </a>
  //   )
  // }
  //
  // userDevice(device, index) {
  //   return (
  //     <panel className="modern" key={ index }>
  //       <panel-body class="user-device" style={{ fontSize: '16px', fontWeight: '600', letterSpacing:'1px'}}>
  //         <h4>{device.deviceModelName}</h4>
  //         <p style={{marginBottom: '0px'}}>#{device.id}</p>
  //       </panel-body>
  //     </panel>
  //   )
  // }
  //
  // linkedAccount(identity, index) {
  //   if (identity['provider'] === 'patreon') {
  //     return (
  //       <panel className="modern panel-mini" key={ index }>
  //         <panel-body class="green-gradient patreon" style={{ fontSize: '16px', fontWeight: '600', letterSpacing:'1px'}}>
  //           <div style={{paddingTop: '0px'}} className="reviews-more">
  //             <label style={{color: 'white !important'}}>Patreon</label>
  //           </div>
  //         </panel-body>
  //       </panel>
  //     )
  //   } else if (identity['provider'] === 'facebook') {
  //     return (
  //       <panel className="modern panel-mini" key={ index }>
  //         <panel-body class="green-gradient facebookt" style={{ fontSize: '16px', fontWeight: '600', letterSpacing:'1px'}}>
  //           <div style={{paddingTop: '0px'}} className="reviews-more">
  //             <label style={{color: 'white !important'}}>Facebook</label>
  //           </div>
  //         </panel-body>
  //       </panel>
  //     )
  //   } else if (identity['provider'] === 'google') {
  //     return (
  //       <panel className="modern panel-mini" key={ index }>
  //         <panel-body className="green-gradient google" style={{ fontSize: '16px', fontWeight: '600', letterSpacing:'1px'}}>
  //           <div style={{paddingTop: '0px'}} className="reviews-more">
  //             <label style={{color: 'black'}}>Google</label>
  //           </div>
  //         </panel-body>
  //       </panel>
  //     )
  //   } else {
  //     return null;
  //   }
  // }


  render() {
    const { purchaseData, isReady, isLoggedIn, refundReason, refundError} = this.state;
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

          .green-gradient {
            background: linear-gradient(90deg,#46ff92, #089e46) !important;
           }

           .blue-gradient {
            background: linear-gradient(90deg,#48c1ff, #0864ff) !important;
           }

           .brown-gradient {
            background: linear-gradient(90deg,#af4901, #6d2800) !important;
           }

           .pkgLink {
            text-decoration: none !important;
           }

           .purchase-details {
            font-family: "SF Pro Text","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif !important;
           }

           .purchase-details-header {
            padding-bottom: 0px;
            font-size: 18px;
            color: black;
            font-family: "SF Pro Display","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif !important;
            padding-top: 5px;
            letter-spacing: 1px;
           }

           .purchase-details-list {
            list-style: none;
            padding: 0px;
            font-size: 12px;
            font-family: "SF Pro Text","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif !important;
            margin-bottom: 18px;
           }

           .purchase-details-list:last-child {
            margin-bottom: 0px;
           }

           .purchase-details-header:first-child {
             padding-top: 0px;
           }

           .purchase-details-list li b {
            color: black;
            font-size: 13px;
            font-weight: 700;
            margin-right: 5px;
           }

           .reason-input {
            border: none;
            outline:  none;
            max-width: 100%;
            width: 100%;
            font-size: 15px;
            margin-top:5px;
            min-width: 100%;
            min-height: 20vh;
           }

            .sf-text {
            font-family: "SF Pro Text","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif !important;
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

           .refundErr {
            font-size: 14px;
            text-align: center;
            margin: 5px 25px;
            color: red !important;
            margin-bottom: 15px;
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
            font-family: "SF Pro Text","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif !important;
           }
        `}
        </style>
        <div>
          {isReady === false && isLoggedIn === true ? (
            <div>Loading...</div>
          ) : (
            <div className="contents-container">
              <panel className="modern purchase-details">
                <panel-header style={{textAlign: 'center'}}>
                  <label style={{fontSize: '32px', paddingBottom: '10px', display: 'block', paddingTop: '10px'}}>Purchase</label>
                </panel-header>
                <panel-body style={{fontSize: '14px'}}>
                  <h3 className="purchase-details-header">Product</h3>
                  {purchaseData.package && (
                    <ul className="purchase-details-list">
                      <li><b>Package:</b>   {purchaseData.package.name}</li>
                      <li><b>Identifier:</b>   {purchaseData.package.identifier}</li>
                      <li><b>Author:</b>   {purchaseData.package.latestVersion.raw.Author}</li>
                    </ul>
                  )}
                  <h3 className="purchase-details-header">Purchase Info</h3>
                  <ul className="purchase-details-list">
                    <li><b>Date:</b>  <Moment interval={0} locale="en" date={purchaseData.createdOn} format="LL" /></li>
                    <li><b>Amount:</b>   {purchaseData.details.amount.value}</li>
                    <li><b>Currency:</b>   {purchaseData.details.amount.currency}</li>
                  </ul>
                  <h3 className="purchase-details-header">Payment Details</h3>
                  <ul className="purchase-details-list">
                    <li><b>Status:</b>   {purchaseData.status}</li>
                    <li><b>PayPal Email:</b>   {purchaseData.details.payerEmail}</li>
                    <li><b>Transaction Id:</b>   {purchaseData.details.saleId}</li>
                  </ul>
                </panel-body>
              </panel>
              {purchaseData.package && (
                <panel className="modern" style={{'marginTop': '-10px'}}>
                  <panel-body class="blue-gradient" style={{ fontSize: '16px', fontWeight: '700', letterSpacing:'0.5px'}}>
                    <a style={{paddingTop: '0px'}} className="reviews-more" href={'/package/' +  purchaseData.package.identifier + '/'}>
                      <label style={{color: 'white !important'}}>View Package</label>
                    </a>
                  </panel-body>
                </panel>
              )}
              {isLoggedIn === true && purchaseData.status === "Completed" && (
                <panel className="modern" style={{'marginTop': '-10px'}}>
                  <panel-body class="brown-gradient" style={{ fontSize: '16px', fontWeight: '700', letterSpacing:'0.5px'}}>
                    <a style={{paddingTop: '0px'}} className="reviews-more" target="_open"  href={'/api/link/cydia'}>
                      <label style={{color: 'white !important'}}>Link Device</label>
                    </a>
                  </panel-body>
                </panel>
              )}
              {purchaseData.status === "Completed" && !purchaseData.refundRequest && (
                <panel>
                  <panel-header style={{textAlign: 'center'}}>
                    <label>Request a Refund</label>
                  </panel-header>
                  {refundError !== undefined && (
                    <div className="refundErr">
                      {refundError}
                    </div>
                  )}
                  <panel-body>
                    <h4>Reason</h4>
                    <textarea className="reason-input sf-text" placeholder="Enter your reason for wanting a refund here" type="text" value={this.state.refundReason} onChange={(event) => {
                      if (event.target.value.length > 0) {
                        this.setState({refundReason: event.target.value})
                      } else {
                        this.setState({refundReason: undefined})
                      }
                    }} />
                    <div className="fading-sep" href="#!" style={{marginTop: '0px'}} />
                    <a className="changes-more" onClick={()=> {
                      this.submitRefundRequest();
                    }}>
                      <label>Send Refund Request</label>
                    </a>
                  </panel-body>
                </panel>
              )}
              {purchaseData.refundRequest && (
                <panel>
                  <panel-header style={{textAlign: 'center'}}>
                    <label>Refund Request</label>
                  </panel-header>
                  <panel-body>
                    <h3 className="purchase-details-header">Status</h3>
                    <p style={{textTransform: 'capitalize', marginBottom: '0px'}}>{purchaseData.refundRequest.status}</p>
                    <h3 className="purchase-details-header">Submitted Reason</h3>
                    <p style={{marginBottom: '0px'}}>{purchaseData.refundRequest.reason}</p>
                    {purchaseData.refundRequest.developerResponse && (
                      <h3 className="purchase-details-header">Declined Reason</h3>
                    )}
                    {purchaseData.refundRequest.developerResponse && (
                      <p style={{marginBottom: '0px'}}>{purchaseData.refundRequest.developerResponse}</p>
                    )}
                  </panel-body>
                </panel>
              )}
              <panel className="modern">
                <panel-body class="green-gradient" style={{ fontSize: '16px', fontWeight: '700', letterSpacing:'0.5px'}}>
                  <a style={{paddingTop: '0px'}} className="reviews-more" href={'/account/'}>
                    <label style={{color: 'white !important'}}>Back to Account</label>
                  </a>
                </panel-body>
              </panel>
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default Purchase;
