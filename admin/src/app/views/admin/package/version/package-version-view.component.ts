import {AfterViewInit, Component, OnDestroy, ElementRef, ViewChild, ViewEncapsulation} from '@angular/core';

import {
  PackageApi,
  PackageVersionApi,
  LoopBackAuth,
  Package,
  PackageVersion,
  PackageDownloadApi
} from "../../../../shared/sdk";

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {RemarkPlugin} from "../../../../helpers/remark-plugin";
import {ScrollablePlugin} from "../../../../helpers/plugins/scrollable";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'package-version-view',
    templateUrl: 'package-version-view.template.html'
})

export class PackageVersionViewComponent implements AfterViewInit, OnDestroy{

  public package: Package;
  public packageVersion: PackageVersion;
  public packageID: string;
  public packageVersionID: string;
  public detailedPackageDescription: any;
  public versionChanges: string[];
  public changeToBeAdded: string = "";
  // public downloadsChartType:string = 'line';
  // public downloadsChartData:Array<any> = [
  //   {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
  //   {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'},
  //   {data: [18, 48, 77, 9, 100, 27, 40], label: 'Series C'}
  // ];
  // public downloadsChartLabels:Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  // public downloadsChartOptions:any = {
  //   responsive: true
  // };

  public deviceTypeChartLabels:string[] = ['Lol'];
  public deviceTypeChartData:number[] = [50];
  public deviceTypeChartLegend:boolean = true;

  public deviceTypeChartType:string = 'pie';

  public deviceModelStats:any = [];
  public deviceVersionStats:any = [];
  public deviceTypeStats:any = [];
  public activeStats:any = [];


  // @ViewChild('editor') editor: QuillEditorComponent;

  constructor(
    private packageAPI: PackageApi,
    private packageVersionAPI: PackageVersionApi,
    private auth: LoopBackAuth,
    private downloadsAPI: PackageDownloadApi,
    private route: ActivatedRoute
  ) {

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.packageID = params['id'];
        this.packageVersionID = params['version'];
        this.loadData();
      }
    });

    RemarkPlugin.register('scrollable', ScrollablePlugin);
  }

  loadData() {
    this.packageVersionAPI.findById(this.packageVersionID,{
      include: ['package', 'file', 'downloads']
    }).subscribe((packageVersionObject : PackageVersion) => {
      this.package = packageVersionObject.package;
      this.packageVersion = packageVersionObject;
      if (this.packageVersion.changes) {
        this.versionChanges = this.packageVersion.changes;
      } else {
        this.versionChanges = [];
      }
      this.detailedPackageDescription = this.package.detailedDescription;
      // if (this.editor) {
      //   this.editor.writeValue(this.package.detailedDescription);
      //   console.log(this.editor);
      // }
      console.log(this.package);
    });

    this.packageVersionAPI.downloadStats(
      this.packageVersionID
    ).subscribe((downloadStats : any) => {
      this.deviceModelStats = downloadStats['deviceTypeStats'] || [];
      this.deviceVersionStats = downloadStats['deviceVersionStats'] || [];
      this.deviceTypeStats = downloadStats['deviceTypeGeneralStats'] || [];
      if (this.activeStats.length === 0) {
        this.activeStats = this.deviceTypeStats;
      }
      // for (let stat of deviceTypeStats) {
      //   this.deviceTypeChartData.push(stat['count']);
      //   this.deviceTypeChartLabels.push(stat['label']);
      // }
      //
      // console.log(this.deviceTypeChartLabels);
      // console.log(this.deviceTypeChartData);
    });
  }

  addChange() {
    let changes = this.versionChanges;
    if (this.changeToBeAdded && this.changeToBeAdded.length > 0) {
      changes.push(this.changeToBeAdded);
      this.versionChanges = changes;
      this.changeToBeAdded = "";
      // this.packageVersionAPI.patchAttributes(this.packageVersion.id,{
      //   "changes": changes
      // }).subscribe((packageVersionChanges : any) => {
      //     console.log(packageVersionChanges);
      //     this.versionChanges = changes;
      //     this.changeToBeAdded = "";
      //   });

    }
  }

  saveChanges() {
    let changes = this.versionChanges;
    this.packageVersionAPI.patchAttributes(this.packageVersion.id,{
      "changes": changes
    }).subscribe((packageVersionChanges : any) => {
      console.log(packageVersionChanges);
      this.versionChanges = changes;
    });
  }

  removeChange(i: any) {
    let changes = this.versionChanges;
    changes.splice(i, 1);
    this.versionChanges = changes;
    console.log(i);
    console.log(changes);
  }

  ngAfterViewInit() {
    // jQuery('body').addClass('page-aside-left');
    // jQuery('body').addClass('page-aside-scroll');
    jQuery('body').addClass('app-packages');
  }

  switchStats(stats:any) {
    this.activeStats = stats;
  }


  // savePackageDescription() {
  //   if (this.package) {
  //     this.package.detailedDescription = this.detailedPackageDescription;
  //     this.packageAPI.patchAttributes(this.package.id,{
  //       "detailedDescription": this.detailedPackageDescription
  //     })
  //       .subscribe((packageChanges : any) => {
  //         console.log(packageChanges);
  //       });
  //   }
  // }

    ngOnDestroy() {
      jQuery('body').removeClass('app-packages');
      // jQuery('body').removeClass('page-aside-scroll');
      // jQuery('body').removeClass('page-aside-left');
    }
}
