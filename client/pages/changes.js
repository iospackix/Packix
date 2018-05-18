// import React from 'react';
import React, { Component as ReactComponent } from 'react';
import Head from '../components/head';
// import Moment from 'react-moment';
//import SDK, { Component } from '../shared/sdk/';
//import * as Services from './../shared/sdk/services';

import { LoopBackConfig } from './../shared/sdk/lb.config';

class Package extends ReactComponent {
  // constructor() {
  //   super(props)
  //  // super({services: ['PackageApi']});
  // }

  static async getInitialProps({ req }) {
    //  return {};
    //console.log(req);
    //console.log(req);
    if (req) {
      const protocol = req.headers['x-forwarded-proto'] || 'http';
      const baseUrlFull = req ? `${protocol}://${req.headers.host}` : '';
      LoopBackConfig.setBaseURL(baseUrlFull);
      const Services = await import('./../shared/sdk/services/index.js');
      // const LBConfigObj = await import('./../shared/sdk/lb.config.js');
      // const LBConfig = LBConfigObj.LoopBackConfig;
      // LBConfig.setBaseURL('https://' + req.get('host') + '/');
      const moment = await import('moment');
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
        include: ['latestVersion', 'versions']
      }).first().toPromise();

      // console.log(data);
      let descriptionHTML = "";
      if (data["detailedDescription"]) {
        const QuillDeltaToHtmlConverter = await import('quill-delta-to-html');
        const quillConverter = new QuillDeltaToHtmlConverter(data["detailedDescription"]["ops"], {});
        descriptionHTML = quillConverter.convert();
      }

      let url = LoopBackConfig.getPath();
      url += "/package/";
      url += data["identifier"];
      url += "/changes";

      if (!data.latestVersion.changes) data.latestVersion.changes = [];
      if (!data.screenshots) data.screenshots = [];
      // console.log(data.latestVersion.createdOn);
      //data.latestVersion.createdOn = new Date(data.latestVersion.createdOn);
      // console.log(data.latestVersion.createdOn);

      if (!descriptionHTML || descriptionHTML.length < 1) {
        descriptionHTML = "No Description has been provided for this package.";
      }

      let urlDict = {
        "url": url
      };

      const debian_compare = await import('deb-version-compare');
      let versions = data.versions;
      versions.sort((a, b) => {
        return debian_compare(b['version'], a['version']);
      });

      for (let version of versions) {
        version['createdOn'] =  moment(version.createdOn).format("LL");
      }

      data.versions = versions;



      return {
        data: data,
        descriptionHTML: descriptionHTML,
        title: "Changes",
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
               width: device-width;
               max-width: 414px !important;
               background-color: #f4f4f4;
               min-font-size: 13px;
               text-align:center;
               font-family: "SF Pro Display","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif;
               font-weight:500;
               font-size:15px;
           }

           .changes-header {
            font-family: "SF Pro Display","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif;
            font-weight: 700;
            font-size: 15px;
            float: none;
            margin: 11px 2px;
            line-height: 1.1;
            color: #111;
            text-align: left;
            color: #888;
            color: #111;
            margin-top: 0px;
            margin-bottom: 6px;
            font-size: 18px;
           }

           .change-content {
            font-size: 13px;
            font-weight: 500;
           }

           body panel > panel-body > table > tbody > tr > td {
             margin: 8px 2px;
             font-size: 13px;
           }

           body panel > panel-body > table > tbody > tr > td:nth-child(2) {
            font-size: 12px;
            padding-top: 0.5px;
            padding-bottom: 0.5px;
           }

           .information {
            margin-bottom: -5px;
           }

        `}
        </style>
        {this.props.data.versions.map((version, sindex) => {
          return (
            <panel key={sindex} className="modern">
              <panel-header>
                <label>{version.version}</label>
              </panel-header>
              <panel-body>
                <h4 className="changes-header">Changes</h4>
                {version.changes && version.changes.length > 0 ? (
                  <ul style={{marginLeft: '2px', marginRight: '2px'}}>
                    {version.changes.map(function(change, index){
                      return <li key={ index }><span className="change-content">{change}</span></li>;
                    })}
                  </ul>):(
                  <span style={{marginLeft: '2px', marginRight: '2px', marginBottom: '5px', fontSize: '13px', fontWeight: '500'}}>No changes were reported.</span>
                )}
                <div style={{height: '0.5px', borderBottom: '0px solid #cacaca', marginBottom: '11px', marginTop: '5px'}} />
                <table className="information" cols="2" border="0">
                  <tbody>
                  <tr>
                    <td>Updated</td>
                    <td>
                      {version.createdOn}
                      {/*<Moment interval={0} locale="en" date={version.createdOn} format="LL" />*/}
                    </td>
                  </tr>
                  <tr>
                    <td>Downloads</td>
                    <td>{version.downloadCount}</td>
                  </tr>
                  </tbody>
                </table>
              </panel-body>
            </panel>)
        })}
      </div>
    )
  }
}

export default Package;
