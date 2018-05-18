// import React from 'react';
import React, { Component as ReactComponent } from 'react';
import Head from '../components/head';
import { LoopBackConfig } from './../shared/sdk/lb.config';
import Link from 'next/link';
import DataPrefetchLink from 'data-prefetch-link'
import Router from 'next/router'
// import Moment from 'react-moment';
//import SDK, { Component } from '../shared/sdk/';
//import * as Services from './../shared/sdk/services';

class Index extends ReactComponent {
  // constructor() {
  //   super(props)
  //  // super({services: ['PackageApi']});
  // }

  static async getInitialProps({ req }) {
    //  return {};
    //console.log(req);
    //if (req) {
    const protocol = (req ? req.headers['x-forwarded-proto'] : 'http') || 'http';
    const baseUrlFull = req ? `${protocol}://${req.headers.host}` : '';
    LoopBackConfig.setBaseURL(baseUrlFull);
      const Services = await import('./../shared/sdk/services/index.js');
      //console.log(packageId);
      // console.log(req.params.id);
      // console.log(req.query["package"]);
      // const LBConfigObj = await import('./../shared/sdk/lb.config.js');
      // const LBConfig = LBConfigObj.LoopBackConfig;
      // if (req) {
      //   console.log(req.headers);
      //   LBConfig.setBaseURL('https://' + String(req.headers['host']) + '/');
      // } else {
      //   if (window !== null) {
      //     LBConfig.setBaseURL('https://' + window.location.hostname + '/');
      //   }
      // }
      this['PackageApi'] = new Services['PackageApi']();
      //this.PackageApi.

    //
    // this.PackageApi.find({
    //   sort: 'name ASC',
    //   include: ['latestVersion', 'section']
    // }).subscribe((data)  => {
    //  // console.log(data);
    // });

      const packages = await this.PackageApi.find({
        sort: 'name ASC',
        include: ['latestVersion', 'section']
      }).first().toPromise();

      for (let packageObj of packages) {
       packageObj['descriptionURL'] = "/package/" + packageObj["identifier"] + '/';
        //Router.prefetch(packageObj['descriptionURL'])};
      }

      // console.log(data);
      // let extraHead = "<link rel=\"stylesheet\" type=\"text/css\" href=\"/assets/css/index.css\">";

      return {
        packages: packages,
        title: "Packix",
        description: "Main Repository for Packix",
        baseUrl: LoopBackConfig.getPath()
      }
   // }

   // return {};
    // const data = await this.PackageApi.find().first().toPromise();
    // console.log(data);
    // return {
    //   data: data.toString()
    // }
  }

  async componentDidMount() {
    // const Services = await import('./../shared/sdk/services/index.js');
    // //console.log(packageId);
    // // console.log(req.params.id);
    // // console.log(req.query["package"]);
    // this['PackageApi'] = new Services['PackageApi']();
    // const packages = await this.PackageApi.find({
    //   sort: 'name ASC',
    //   include: ['latestVersion', 'section']
    // }).first().toPromise();
    //
    // for (var packageObj of packages) {
    //   packageObj['descriptionURL'] = "/package/" + packageObj["identifier"];
    // }
    //
    // // console.log(data);
    // // let extraHead = "<link rel=\"stylesheet\" type=\"text/css\" href=\"/assets/css/index.css\">";
    //
    // return {
    //   packages: packages,
    //   title: "Packix",
    //   description: "Archival Repository for iOS Creatix"
    // }
  }

  render() {
    return (
      <div>
        <Head title={this.props.title} description={this.props.description} url={this.props.baseUrl} />
        <link rel="stylesheet" type="text/css" href="/assets/css/index.css" />
        <div className="packages-container">
          <h1>Packages</h1>
          <panel className="modern">
            <panel-body className="green-gradient" style={{ background: 'linear-gradient(90deg,#30c381, #089e46) !important', width: '80px', margin: 'auto', paddingTop: '7px', paddingBottom: '7px;', fontSize: '14px', fontWeight: '600', letterSpacing:'0.5px'}}>
              <a style={{paddingTop: '0px'}} className="reviews-more" target="_blank" href={'/login'}>
                <label style={{color: 'white !important'}}>Login</label>
              </a>
            </panel-body>
          </panel>
          <br />
          {this.props.packages.map(function(packageObj, index){
            return (
              <div className="package-container" key={index}>
                <panel>
                  <a href={'/package/' + packageObj.identifier + '/'} as={packageObj.descriptionURL}>
                    <panel-body>
                      <h3 style={{marginTop: '-4px'}}>{packageObj.name}</h3>
                      <h5>
                        <span style={{float: 'left'}}>{packageObj.section.name}</span>
                        <span style={{float: 'right', color: '#777', fontSize: 'smaller', paddingTop: '3px'}}>{packageObj.latestVersion.version}</span>
                      </h5>
                    </panel-body>
                  </a>
                </panel>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

export default Index;
