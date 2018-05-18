// import React from 'react';
import React, { Component as ReactComponent } from 'react';
import Head from '../components/head';
// import Moment from 'react-moment';
const Rating = require('react-rating');
//import SDK, { Component } from '../shared/sdk/';
//import * as Services from './../shared/sdk/services';

import { LoopBackConfig } from './../shared/sdk/lb.config';

class Screenshots extends ReactComponent {
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


  static async getInitialProps({ req }) {
    //  return {};
    //console.log(req);
    //console.log(req);

    if (req) {
      const protocol = req.headers['x-forwarded-proto'] || 'http';
      const baseUrlFull = req ? `${protocol}://${req.headers.host}` : '';
      LoopBackConfig.setBaseURL(baseUrlFull);
      // const LBConfigObj = await import('./../shared/sdk/lb.config.js');
      // const LBConfig = LBConfigObj.LoopBackConfig;
      // LBConfig.setBaseURL('https://' + req.get('host') + '/');
      const Services = await import('./../shared/sdk/services/index.js');
      let packageId = req.params["id"];
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
        include: ['latestVersion']
      }).first().toPromise();

      // console.log(data);
      let url = "";
      url += LoopBackConfig.getPath() + "/package/";
      url += data["identifier"];

      if (!data.screenshots) data.screenshots = [];
      // console.log(data.latestVersion.createdOn);
      //data.latestVersion.createdOn = new Date(data.latestVersion.createdOn);
      // console.log(data.latestVersion.createdOn);

      let urlDict = {
        "url": url
      };



      return {
        data: data,
        title: 'Screenshots',
        description: data["shortDescription"],
        url: urlDict
      }
    }

    return {};
    // const data = await this.PackageApi.find().first().toPromise();
    // console.log(data);
    // return {
    //   data: data.toString()
    // }
  }

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

           .screenshot-viewer {
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
              width: 100%;
              height: auto;
              margin-bottom: 15px;
           }

           .screenshot-item:first-child {
              margin-left: 0px;
              margin-top: 10px;
           }

           .screenshot-item:last-child {
              margin-right: 0px;
           }


           .screenshot-img {
            margin: 0;
            position: relative;
            z-index: 1;
            width: 100%;
            height: auto;
            border-radius: 6px;
            overflow: hidden;
           }
        `}
        </style>
        <div>
          <div className="contents-container">
            <panel className="modern">
              <panel-header>
                <label>Screenshots</label>
              </panel-header>
              <panel-body style={{fontSize: '14px', paddingRight: '5px', paddingLeft:'5px'}}>
                {this.props.data.screenshots.length > 0 && (
                  <ul className="screenshot-viewer">
                    {this.props.data.screenshots.map((screenshot, index) => {
                      return (
                        <li id={screenshot.id + '1'} className={'screenshot-item ' + (openScreenshotId === screenshot.id ? 's-open' : '')}>
                          <a target="_blank" href={'/api/PackageScreenshots/' + screenshot.id + '/download.jpg?size=full'}>
                            <img className="screenshot-img" key={ index } src={'/api/PackageScreenshots/' + screenshot.id + '/download.jpg?size=full'} />
                          </a>
                        </li>);
                    })}
                  </ul>
                )}
              </panel-body>
            </panel>
          </div>
        </div>
      </div>
    )
  }
}

export default Screenshots
