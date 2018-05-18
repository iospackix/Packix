/**
 * Created by awiik on 1/21/2018.
 */
// import React from 'react';
import React, { Component as ReactComponent } from 'react';
import Head from '../components/head';
// import Moment from 'react-moment';
const Rating = require('react-rating');
//import SDK, { Component } from '../shared/sdk/';
//import * as Services from './../shared/sdk/services';
import 'isomorphic-fetch';

import { LoopBackConfig } from './../shared/sdk/lb.config';

class WriteReview extends ReactComponent {
  constructor(props) {
    super(props);

    this.state = {
      ratingR: 0,
      titleR: "",
      descriptionR: "",
      submitted: false
    };

    this.setRating = (rate) => {
      this.setState({
        ratingR: rate
      });
    };

    this.submitReview = async () => {
      console.log(this.props.baseURL);
      let url = this.props.baseURL + '/api/PackageVersions/' + this.props.data.latestVersionId + '/review';
      console.log("URL: "  + url);

      let postData = {
        title: this.state.titleR,
        description: this.state.descriptionR,
        rating: 0
      };

      if (this.state.ratingR > 0) {
        postData.rating = this.state.ratingR;
      }


      let response = await fetch(
        url,
        {
          method: 'post',
          headers: {
            'x-forced-ip': this.props.ip,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(postData)
        },
      );
      let responseJson = await response.json();
      console.log(responseJson);

      // if (this.state.ratingR > 0) {
      //
      //   let rateURL = this.props.baseURL + '/api/PackageVersions/' + this.props.data.latestVersionId + '/rate?rating=' + this.state.ratingR;
      //
      //   let response1 = await fetch(
      //     rateURL,
      //     {
      //       method: 'get',
      //       headers: {
      //         'x-forced-ip': this.props.ip,
      //         'Content-Type': 'application/json'
      //       }
      //     },
      //   );
      //
      //   let responseJson1 = await response1.json();
      //   console.log(responseJson1);
      // }

      this.setState({submitted: true});
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
    // const LBConfigObj = await import('./../shared/sdk/lb.config.js');
    // const LBConfig = LBConfigObj.LoopBackConfig;
    // if (window) {
    //   LBConfig.setBaseURL('https://' + window.location.hostname + '/');
    // }

    if (req) {
     // LBConfig.setBaseURL('https://' + req.get('host') + '/');
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
      // this['PackageApi'] = new Services['PackageApi']();
      // const data = await this.PackageApi.findOne({
      //   where: {
      //     identifier: packageId
      //   },
      //   include: ['latestVersion']
      // }).first().toPromise();

     // console.log(req);
      let data = null;
      let reviewData = null;
      let ratingData = null;
      let ip = '';
      let baseUrl = '';

      try {
        const protocol = req.headers['x-forwarded-proto'] || 'http';
        const baseUrlFull = req ? `${protocol}://${req.headers.host}` : '';
        LoopBackConfig.setBaseURL(baseUrlFull);
        baseUrl = LoopBackConfig.getPath();
        ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        const clientTypeHeaderNames = ['X-Machine','x-machine', 'HTTP_X_MACHINE'];

        const clientTypeForHeaders = async (headers) => {
          for (let headerName of clientTypeHeaderNames) {
            if (headers[headerName] && headers[headerName].length > 0) {
              return headers[headerName];
            }
          }
          return Promise.reject(new Error('Client Type Not Defined in Request Headers'));
        };

        let clientType = await clientTypeForHeaders(req.headers);
        let response = await fetch(
          baseUrl + '/api/Packages/writeReview?id=' + packageId,
          {
            method: 'get',
            headers: {
              'x-forced-ip': ip,
              'X-Machine': clientType
            }
          },
        );
        let responseJson = await response.json();
        data = responseJson['packageData'];
        reviewData = responseJson['reviewData'];
        ratingData = responseJson['ratingData'];
      } catch (err) {
        console.log(err);
      }

      let url = "";
      url += LoopBackConfig.getPath() + "/package/";
      url += data["identifier"];
      url += '/review';

      let urlDict = {
        "url": url
      };


      const isCydia = req.headers['user-agent'].search(/Cydia/) !== -1;

      let ratingValue = 0;
      if (ratingData) {
        ratingValue = ratingData.value;
      }

      let titleValue = "";
      let descriptionValue  = "";
      if (reviewData) {
        titleValue = reviewData['title'];
        descriptionValue = reviewData['description'];
      }

      this.state = {
        titleR: titleValue,
        descriptionR: descriptionValue,
        ratingR: ratingValue,
        submitted: false
      };

      console.log("The State");
      console.log(this.state);

      this.ratingV = ratingValue;
      this.titleR = titleValue;
      this.descriptionR = descriptionValue;

      return {
        data: data,
        ratingData: ratingData,
        reviewData: reviewData,
        title: 'Write Review',
        description: 'Write a Review for ' + data['name'],
        url: urlDict,
        isCydia: isCydia,
        ratingR: ratingValue,
        titleR: titleValue,
        descriptionR: descriptionValue,
        ip: ip,
        baseURL: baseUrl
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

  componentDidMount() {
    this.setState({
      titleR: this.props.titleR,
      descriptionR: this.props.descriptionR,
      ratingR: this.props.ratingR,
      submitted: false
    });
  }

  render() {

    const { ratingR, titleR, descriptionR } = this.state;

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

           .description-input {
            border: none;
            outline:  none;
            max-width: 100%;
            width: 100%;
            font-size: 15px;
            margin-top:5px;
            min-width: 100%;
            min-height: 35vh;
           }

           .title-input {
            border: none;
            outline:  none;
            width:100%;
            max-width: 100%;
            font-size: 15px;
            margin-top:5px;
           }

           .rating-sub {
            display:block;
            font-size:12px;
            text-align:center;
            margin-top: 7px;
            margin-bottom: 3px;
           }

           .submit-success {
            width: 100vw;
            text-align: center;
            margin-top: 30vh;
           }


        `}
        </style>

        <div>
          <div className="contents-container">
            {this.state.submitted === false ? (
            <panel className="modern">
              <panel-header>
                <label>Write Review</label>
              </panel-header>
              <panel-body style={{fontSize: '14px'}}>
                <div className="user-rate-action" style={{marginTop: '4px'}}>
                  <Rating emptySymbol="far fa-star" fullSymbol="fas fa-star"
                          initialRating={ratingR} stop={5} onChange={(rate) => {
                            if (rate > 0 && rate <= 5 && (rate % 1 === 0)) {
                              this.setRating(rate)
                            }}} />
                  <span className="rating-sub">Tap to Rate</span>
                </div>
                <div className="fading-sep" style={{marginBottom: '13px'}} />
                <h4>Title</h4>
                  <input type="text" className="title-input sf-text" placeholder="Sum up your review in a few words" value={this.state.titleR} onChange={(event) => {
                    if (event.target.value.length > 0) {
                      this.setState({titleR: event.target.value})
                    } else {
                      this.setState({titleR: undefined})
                    }
                  }} />
                <div className="fading-sep" style={{marginBottom: '13px'}} />
                <h4>Description</h4>
                  <textarea className="description-input sf-text" placeholder="Enter your detailed review here" type="text" value={this.state.descriptionR} onChange={(event) => {
                    if (event.target.value.length > 0) {
                      this.setState({descriptionR: event.target.value})
                    } else {
                      this.setState({descriptionR: undefined})
                    }
                  }} />
                <div className="fading-sep" href="#!" style={{marginTop: '0px'}} />
                <a className="changes-more" onClick={()=> {
                  this.submitReview();
                }}>
                  <label>Submit Review</label>
                </a>
              </panel-body>
            </panel>): (
              <div className="submit-success">
                <h3>Submission Sucessfull</h3>
              </div>)}
          </div>
        </div>
      </div>
    )
  }
}

export default WriteReview;
