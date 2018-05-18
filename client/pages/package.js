// import React from 'react';
import React, { Component as ReactComponent } from 'react';
import Head from '../components/head';
// import {LoopBackConfig} from "../shared/sdk/lb.config";
// import Moment from 'react-moment';
const Rating = require('react-rating');
const Currency = require('react-currency-formatter');
// const ReactPlaceholder = require ('react-placeholder');
//import SDK, { Component } from '../shared/sdk/';
//import * as Services from './../shared/sdk/services';

import { LoopBackConfig } from './../shared/sdk/lb.config';
import { IOS } from './../shared/helpers/ios';

class Package extends ReactComponent {
  constructor(props) {
    super(props);

    this.state = {
      openScreenshotId: null,
      isOpen: false,
    };

    this.preventDefault = (e) => {
      e = e || window.event;
      if (e.preventDefault)
        e.preventDefault();
      e.returnValue = false;
    };

    this.sKeys = {37: 1, 38: 1, 39: 1, 40: 1};

    this.preventDefaultForScrollKeys = (e) => {
      if (this.sKeys[e.keyCode]) {
        this.preventDefault(e);
        return false;
      }
    };

    this.disableScroll = () => {
      if (window.addEventListener) {// older FF
        window.addEventListener('DOMMouseScroll', this.preventDefault, false);
      }
      window.onwheel = this.preventDefault; // modern standard
      window.onmousewheel = document.onmousewheel = this.preventDefault;
      window.ontouchmove  = this.preventDefault; // mobile
      document.onkeydown  = this.preventDefaultForScrollKeys;
      document.ontouchmove = function(e){
        e.preventDefault();
      }
    };

    this.enableScroll = () => {
      if (window.removeEventListener)
        window.removeEventListener('DOMMouseScroll', this.preventDefault, false);
      window.onmousewheel = document.onmousewheel = null;
      window.onwheel = null;
      window.ontouchmove = null;
      document.onkeydown = null;
      document.ontouchmove = function(e){
        return true;
      }
    }
  }


  static async getInitialProps({ req, params }) {
  //  return {};
    //console.log(req);
    //console.log(req);

  //  if (req) {

    console.log(params);
      const Services = await import('./../shared/sdk/services/index.js');
      const moment = await import('moment');
      let packageId = null;

      if (req) {
        const protocol = req.headers['x-forwarded-proto'] || 'http';
        const baseUrlFull = req ? `${protocol}://${req.headers.host}` : '';
        LoopBackConfig.setBaseURL(baseUrlFull);

        let accountId = "";
        if (req.session && req.session.user) {
          accountId = req.session.user.id;
        }
        // const LBConfigObj = await import('./../shared/sdk/lb.config.js');
        // const LBConfig = LBConfigObj.LoopBackConfig;
        // LBConfig.setBaseURL('https://' + req.get('host') + '/');
        const baseUrl = LoopBackConfig.getPath();
        packageId = req.params["id"];
        if (!packageId) {
          packageId = req.query['id'];
        }

        if (!packageId) {
          // console.log(req);
        }

        // console.log(req.params);
        // console.log(packageId);
        //console.log(packageId);
        // console.log(req.params.id);
        // console.log(req.query["package"]);
        this['PackageApi'] = new Services['PackageApi']();
        const data = await this.PackageApi.findOne({
          where: {
            identifier: packageId
          },
          include: ['latestVersion', 'downloadRestrictions']
        }).first().toPromise();

        // console.log(data);
        let descriptionHTML = "";
        if (data["detailedDescription"]) {
          const QuillDeltaToHtmlConverter = await import('quill-delta-to-html');
          const quillConverter = new QuillDeltaToHtmlConverter(data["detailedDescription"]["ops"], {});
          descriptionHTML = quillConverter.convert();
        }

        let url = "";
        url += baseUrl + "/package/";
        url += data["identifier"];

        if (!data.latestVersion.changes) data.latestVersion.changes = [];
        if (!data.screenshots) data.screenshots = [];
        // console.log(data.latestVersion.createdOn);
        //data.latestVersion.createdOn = new Date(data.latestVersion.createdOn);
        // console.log(data.latestVersion.createdOn);

        if (!descriptionHTML || descriptionHTML.length < 1) {
          descriptionHTML = '<h5 style="text-align:center;">This package currently does not have a description</h5>';
        }

        let urlDict = {
          "url": url
        };

        if (data.latestVersion.ratingStats) {
          data.latestVersion.ratingStats.ratings.sort((a, b) => {
            return a.value - b.value;
          });
        }

        let lightboxImages = [];

        for (let screenshot of data.screenshots) {
          lightboxImages.push('/api/PackageScreenshots/' + screenshot.id + '/download.jpg?size=full')
        }

        let recentReviews = data.latestVersion.recentReviews;
        let reviewIds = {};
        for (let review of recentReviews) {
          reviewIds[review.id] = true;
        }

        if (recentReviews.length < 3) {
          for (let review of data.recentReviews) {
            if (recentReviews.length >= 3) break;
            if(reviewIds[review.id]) {
            } else {
              recentReviews.push(review);
              reviewIds[review.id] = true;
            }
          }
        }

        for (let review of recentReviews) {
          review.updatedOn = moment(review.updatedOn).format("ll");
        }

        const isCydia = req.headers['user-agent'].search(/Cydia/) !== -1;
        let isIOSVersionCompatible = true;
        let didSpecifyCompatible = false;
        let didGetVersion = false;
        //if (isCydia) {
          let deviceVersion = IOS.clientVersionForHeaders(req.headers);
          if (deviceVersion.length > 0) {
            didGetVersion = true;
            if (data["minIOSVersion"] && data["minIOSVersion"].length > 0) {
              didSpecifyCompatible = true;
              let minResult = IOS.compVersions(deviceVersion, data["minIOSVersion"]);
              if (minResult < 0) {
                isIOSVersionCompatible = false;
              } else {
                if (data["maxIOSVersion"] && data["maxIOSVersion"].length > 0) {
                  let maxResult = IOS.compVersions(deviceVersion, data["maxIOSVersion"]);
                  if (maxResult > 0) {
                    isIOSVersionCompatible = false;
                  }
                }
              }
            }
          }
        //}

        return {
          data: data,
          descriptionHTML: descriptionHTML,
          title: data["name"],
          description: data["shortDescription"],
          url: urlDict,
          lightboxImages: lightboxImages,
          versionDate: moment(data.latestVersion.createdOn).format("LL"),
          isCydia: isCydia,
          recentReviews: recentReviews,
          hostURL: baseUrl,
          isCompatible: isIOSVersionCompatible,
          specifiedCompatible: didSpecifyCompatible,
          didGetVersion: didGetVersion,
          accountId: accountId
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

  generatePatreonRestriction(restrictions) {
    for (let restriction of restrictions) {
      if (restriction.type === 'patreon') {
        return (
          <span>Patreon: <Currency quantity={restriction['data']['rewardAmount']/100}
                                   currency="USD" /> or More</span>
        )
      }
    }
    return null;
  }

  generateCydiaStoreRestriction(restrictions) {
    for (let restriction of restrictions) {
      if (restriction.type === 'cydia-store') {
        return (
          <span>Cydia Store: {restriction['data']['packageIdentifier']}</span>
      )
      }
    }
    return null;
  }

  generatePaypalRestriction(restrictions) {
    for (let restriction of restrictions) {
      if (restriction.type === 'paypal-payment') {
        return (
          <span>PayPal: <Currency quantity={restriction['data']['price']}
                                  currency="USD" /></span>
        )
      }
    }
    return null;
  }

  // generateLicenseSection(restrictions) {
  //   let patreonRestriction = null;
  //   let paypalRestriction = null;
  //   for (let restriction of restrictions) {
  //     if (restriction.type === 'patreon') {
  //       patreonRestriction = this.generatePatreonRestriction(restriction);
  //     } else if (restriction.type === 'paypal-payment') {
  //       paypalRestriction = this.generatePaypalRestriction(restriction);
  //     }
  //   }
  //
  //   if (patreonRestriction || paypalRestriction) {
  //     if (!patreonRestriction) {
  //       return paypalRestriction;
  //     }
  //     if (!paypalRestriction) {
  //       return patreonRestriction;
  //     }
  //     return patreonRestriction + paypalRestriction;
  //   }
  //   return null;
  // }

  // componentDidMount() {
  //   this.PackageApi.find().subscribe(data => {
  //     console.log(data);
  //     this.props.data = data;
  //   })
  // }


  render() {
    const { openScreenshotId, isOpen } = this.state;

    const enScr = this.enableScrolling;
    const disScr = this.disableScrolling;
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

          .restrict-detail > span {
            display: block;
            padding-bottom: 7px;
          }

          .restrict-detail > span:last-child {
            padding-bottom: 0px;
          }

          .author-section {
            min-height: 100%;
            overflow-y: hidden;
            position: relative;
          }

          .author-section .author-photo {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            overflow: hidden;
            margin-right: 14px;
            float: left;
            display: inline-block;
          }

          .author-section .author-description {
            position: absolute;
            top: 50%;
            display: inline-block;
            transform: translateY(-50%);
          }

          .author-section .author-name {
            display: block;
            font-size: 21px;
            font-weight: bold !important;
            color: #666666;
            letter-spacing: 1px;
          }

          .author-section .author-email {
            display: block;
            color: #b9b9b9;
            font-size: 13px;
          }
        `}
        </style>

        <div>
          <div className="contents-container">
            {this.props.didGetVersion === true && this.props.isCompatible === false && this.props.specifiedCompatible === true && (
              <panel className="modern" style={{paddingTop: '10px', marginBottom: '-5px', lineHeight: '1.3'}}>
                <panel-body style={{ background: 'linear-gradient(90deg,#ff0000, #c10000) !important', fontSize: '16px', fontWeight: '500'}}>
                  <div style={{paddingTop: '0px'}} className="reviews-more sf-text">
                    <label style={{color: 'white !important', display: 'block !important', marginTop: '-6px', marginBottom: '-6px'}}>This package is not compatible with your device.</label>
                  </div>
                </panel-body>
              </panel>
            )}
            {this.props.didGetVersion === true && this.props.isCompatible === true && this.props.specifiedCompatible === true && (
              <panel className="modern" style={{paddingTop: '10px', marginBottom: '-5px', lineHeight: '1.3'}}>
                <panel-body style={{ background: 'linear-gradient(90deg,#18f272, #07b856) !important', fontSize: '16px', fontWeight: '500'}}>
                  <div style={{paddingTop: '0px'}} className="reviews-more sf-text">
                    <label style={{color: 'white !important', display: 'block !important', marginTop: '-6px', marginBottom: '-6px'}}>This package is compatible with your device.</label>
                  </div>
                </panel-body>
              </panel>
            )}
            {this.props.didGetVersion === true && this.props.specifiedCompatible === false && (
              <panel className="modern" style={{paddingTop: '10px', marginBottom: '-5px', lineHeight: '1.3'}}>
                <panel-body style={{ background: 'linear-gradient(90deg,#ffd400,#ffa500) !important;', fontSize: '16px', fontWeight: '500'}}>
                  <div style={{paddingTop: '0px'}} className="reviews-more sf-text">
                    <label style={{color: 'white !important', display: 'block !important', marginTop: '-6px', marginBottom: '-6px'}}>The author didn't specify if this package is compatible with your device.</label>
                  </div>
                </panel-body>
              </panel>
            )}
            <panel className="modern">
              <panel-header>
                <label>Description</label>
              </panel-header>
              <panel-body style={{fontSize: '14px'}}>
                <div className="package-description" dangerouslySetInnerHTML={{ __html: this.props.descriptionHTML }}>
                </div>
                {this.props.data.screenshots.length > 0 && (
                  <div>
                    <ul className="screenshot-viewer">
                      {this.props.data.screenshots.map((screenshot, index) => {
                        return (
                          <li id={screenshot.id + '1'} className={'screenshot-item ' + (openScreenshotId === screenshot.id ? 's-open' : '')}>
                            <a target="_blank" href={'/api/PackageScreenshots/' + screenshot.id + '/download.jpg?size=full'}>
                              <img className="screenshot-img" key={ index } src={'/api/PackageScreenshots/' + screenshot.id + '/download.jpg?size=medium'} />
                            </a>
                          </li>);
                      })}
                    </ul>
                    <div className="fading-sep"></div>
                      <a className="changes-more" target="_blank" href={'/package/' + this.props.data.identifier + '/screenshots'}>
                        <label>View all Screenshots</label>
                      </a>
                  </div>
                )}
              </panel-body>
            </panel>

            <panel className="modern">
              <panel-header>
                <label>What's New?</label>
              </panel-header>
              <panel-body>
                {this.props.data.latestVersion.changes && this.props.data.latestVersion.changes.length > 0 ? (
                  <ul>
                    {this.props.data.latestVersion.changes.map(function(change, index){
                      return <li key={ index }><span className="change-content">{change}</span></li>;
                    })}
                  </ul>):(
                  <h5 style={{textAlign: 'center'}}>No changes were reported for this version</h5>
                )}
                <div className="fading-sep"></div>
                <a className="changes-more" target="_blank" href={'/package/' + this.props.data.identifier + '/changes'}>
                  <label>Previous Changes</label>
                </a>
              </panel-body>
            </panel>
            {this.props.data.developer && this.props.data.developer.name.length > 0 && (
              <panel className="modern">
                <panel-header>
                  <label>Author</label>
                </panel-header>
                <panel-body>
                <div className="author-section">
                  <img className="author-photo" src={ this.props.data.developer.profileImageUrl } />
                  <div className="author-description">
                    <span className="author-name">{this.props.data.developer.name}</span>
                    <span className="author-email sf-text">{this.props.data.developer.email}</span>
                  </div>
                </div>
                </panel-body>
              </panel>
            )}
            <panel className="modern">
              <panel-header>
                <label>Information</label>
              </panel-header>
              <panel-body style={{paddingTop: '13px', paddingBottom: '13px'}}>
                    <table className="information" cols="2" border="0">
                      <tbody>
                      <tr>
                        <td>Version</td>
                        <td>{this.props.data.latestVersion.version}</td>
                      </tr>
                      <tr>
                        <td>Updated</td>
                        <td>
                          {this.props.versionDate}
                          {/*<Moment interval={0} locale="en" date={this.props.data.latestVersion.createdOn} format="LL" />*/}
                        </td>
                      </tr>
                      <tr>
                        <td>License</td>
                        {this.props.data.hasRestrictions && (
                          <td>Restricted</td>
                        )}
                        {!this.props.data.hasRestrictions && (
                          <td>Free Package</td>
                        )}
                      </tr>
                      {this.props.data.hasRestrictions && (
                        <tr>
                          <td>Restriction(s)</td>
                          <td className="restrict-detail">{this.generatePatreonRestriction(this.props.data.downloadRestrictions)} {this.generatePaypalRestriction(this.props.data.downloadRestrictions)} {this.generateCydiaStoreRestriction(this.props.data.downloadRestrictions)}</td>
                        </tr>
                      )}
                      {this.props.data.minIOSVersion && this.props.data.minIOSVersion.length > 0 && (
                        <tr>
                          <td>Supported iOS Version(s)</td>
                          {(this.props.data.maxIOSVersion && this.props.data.maxIOSVersion.length > 0) ? (
                            <td>{this.props.data.minIOSVersion} - {this.props.data.maxIOSVersion}</td>
                          ):(
                            <td>{this.props.data.minIOSVersion} or later</td>
                          )}
                        </tr>
                      )}
                      <tr>
                        <td>Downloads</td>
                        <td>{this.props.data.latestVersion.downloadCount}</td>
                      </tr>
                      </tbody>
                    </table>
              </panel-body>
            </panel>

            <panel className="modern">
              <panel-header>
                <label>Ratings &amp; Reviews</label>
              </panel-header>
              <panel-body>
                {this.props.data.latestVersion.ratingStats ? (
                  <div>
                    <div className="rating-overall">
                      <span className="rating-overall-header">{this.props.data.latestVersion.ratingStats['average'].toFixed(1)}</span>
                      <span className="rating-overall-footer">out of 5</span>
                    </div>
                    <div className="rating-stats-container">
                      <table className="rating-stats" cols="2" border="0">
                        <tbody>
                        {this.props.data.latestVersion.ratingStats.ratings.map((rating, index) => {
                          return (
                            <tr key={ index }>
                              <td>
                                <Rating emptySymbol="far fa-star" fullSymbol="fas fa-star"
                                        initialRating={rating.star} readonly stop={rating.star}/>
                              </td>
                              <td>
                              <span className="rating-bar">
                                <span style={{width: (rating.starCount / this.props.data.latestVersion.ratingStats['total']) * 100 + '%'}} className="rating-fill" />
                              </span>
                              </td>
                            </tr>
                          )})}
                        </tbody>
                      </table>
                      <label className="ratings-count">{this.props.data.latestVersion.ratingStats['total'] + ' Rating' + (this.props.data.latestVersion.ratingStats['total'] > 1 ? 's' : '' )}</label>
                    </div>
                  </div>):(
                    <h5 style={{textAlign: 'center'}}>No Ratings Available</h5>
                  )}
                {this.props.recentReviews && this.props.recentReviews.length > 0 ? (
                  <div style={{marginTop: '5px'}}>
                    <ul className="review-list">
                      {this.props.recentReviews.map(function(review, index){
                        return (
                          <li key={ index }>
                            <div className="review-header">
                              <span className="review-title sf-text">{review.title}</span>
                              <span className="review-version sf-text">{review.versionName}</span>
                            </div>
                            <div className="review-subheader">
                              <span className="review-rating">
                                {review.rating && (
                                  <Rating emptySymbol="far fa-star" fullSymbol="fas fa-star"
                                          initialRating={review.rating.value} readonly stop={5}/>
                                )}
                              </span>
                              <span className="review-date sf-text">{review.updatedOn + ' - ' + review.clientTypeN}</span>
                            </div>
                            <p style={{whiteSpace: 'pre-line'}} className="review-description sf-text" dangerouslySetInnerHTML={{ __html: review.description }} />
                          </li>
                        )})}
                    </ul>
                    <div className="fading-sep"></div>
                    <a className="changes-more" target="_blank" href={'/package/' + this.props.data.identifier + '/reviews'}>
                      <label>See More Reviews</label>
                    </a>
                  </div>
                ):(
                  <div>
                    <div className="fading-sep" style={{marginBottom: '13px'}} />
                    <h5 style={{textAlign: 'center'}}>No Reviews Available</h5>
                  </div>
                )}
              </panel-body>
            </panel>
            {this.props.isCydia === true && !(this.props.isCydia === true && this.props.isCompatible === false) && (
              <div>
                <panel className="modern">
                  <panel-body className="green-gradient" style={{ background: 'linear-gradient(-45deg,#f0ad0d,#fbf72f) !important', fontSize: '16px', fontWeight: '700', letterSpacing:'0.5px'}}>
                    <a style={{paddingTop: '0px'}} className="reviews-more" target="_blank" href={'/package/' + this.props.data.identifier + '/review'}>
                      <label style={{color: 'white !important'}}>Write a Review</label>
                    </a>
                  </panel-body>
                </panel>
                <div className="user-rate-action" style={{marginBottom: '25px'}}>
                  <Rating emptySymbol="far fa-star" fullSymbol="fas fa-star"
                          initialRating={0} stop={5} onChange={(rate) => {
                            if (rate > 0 && rate <= 5) {
                              if (rate <= 3) {
                                window.open(this.props.hostURL + '/package/' + this.props.data.identifier + '/review', "_blank");
                              } else {
                                let i = document.createElement("img");
                                i.src = '/api/PackageVersions/' + this.props.data.latestVersionId + '/rate?rating=' + rate;
                              }
                            }
                  }}/>
                </div>
              </div>
            )}

            {this.props.data.bugsReportURL && this.props.data.bugsReportURL.length > 0 && !(this.props.didGetVersion === true && this.props.isCompatible === false) && (
              <panel className="modern">
                <panel-body className="green-gradient" style={{ background: 'linear-gradient(90deg,#cb76d6, #9100ff) !important', fontSize: '16px', fontWeight: '700', letterSpacing:'0.5px'}}>
                  <a style={{paddingTop: '0px'}} className="reviews-more" target="_open"  href={this.props.data.bugsReportURL}>
                    <label style={{color: 'white !important'}}>Submit Bug Report</label>
                  </a>
                </panel-body>
              </panel>
            )}

            <panel className="modern">
              <panel-body className="green-gradient" style={{ background: 'linear-gradient(90deg,#46ff92, #089e46) !important', fontSize: '16px', fontWeight: '700', letterSpacing:'0.5px'}}>
                <a style={{paddingTop: '0px'}} className="reviews-more" target="_open" href={'/login?next=/account/'}>
                  <label style={{color: 'white !important'}}>Login or Register</label>
                </a>
              </panel-body>
            </panel>

            {this.props.data.isPaid === true && !(this.props.didGetVersion === true && this.props.isCompatible === false) && (
              <panel className="modern" style={{'marginTop': '-10px'}}>
                <panel-body className="green-gradient" style={{ background: 'linear-gradient(90deg,#48c1ff, #0864ff) !important', fontSize: '16px', fontWeight: '700', letterSpacing:'0.5px'}}>
                  <a style={{paddingTop: '0px'}} className="reviews-more" target="_open"  href={'/package/' + this.props.data.identifier + '/purchase'}>
                    <label style={{color: 'white !important'}}>Purchase</label>
                  </a>
                </panel-body>
              </panel>
            )}

            {this.props.isCydia === false && (
              <panel className="modern" style={{'marginTop': '-10px'}}>
                <panel-body className="green-gradient" style={{ background: 'linear-gradient(90deg,#af4901, #6d2800) !important', fontSize: '16px', fontWeight: '700', letterSpacing:'0.5px'}}>
                  <a style={{paddingTop: '0px'}} className="reviews-more" target="_open"  href={'/api/link/cydia'}>
                    <label style={{color: 'white !important'}}>Add to Cydia</label>
                  </a>
                </panel-body>
              </panel>
            )}

            {this.props.isCydia === true && (
              <panel className="modern" style={{'marginTop': '-10px'}}>
                <panel-body className="green-gradient" style={{ background: 'linear-gradient(90deg,#af4901, #6d2800) !important', fontSize: '16px', fontWeight: '700', letterSpacing:'0.5px'}}>
                  <a style={{paddingTop: '0px'}} className="reviews-more" target="_open"  href={'/api/link/cydia'}>
                    <label style={{color: 'white !important'}}>Link Device</label>
                  </a>
                </panel-body>
              </panel>
            )}

            {this.props.accountId}
          </div>
        </div>
      </div>
    )
  }
}

export default Package;
