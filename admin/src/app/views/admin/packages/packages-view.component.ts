import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { Observable } from 'rxjs/Observable';
import { ToasterService } from 'angular2-toaster';
import 'rxjs/add/operator/map';

import {
  PackageApi,
  Package,
  LoopBackConfig,
  LoopBackAuth, PackageDownloadRestriction
} from "../../../shared/sdk";
// import {PackageApi} from "../../../shared/sdk/services/custom/Package";
// import {LoopBackAuth} from "../../../shared/sdk/services/core/auth.service";
// import {LoopBackConfig} from "../../../shared/sdk/lb.config";
// import {Package} from "../../../shared/sdk/models/Package";
// import {PackageFile} from "../../../shared/sdk/models/PackageFile";
import {RemarkPlugin} from "../../../helpers/remark-plugin";
import {ScrollablePlugin} from "../../../helpers/plugins/scrollable";

@Component({
    selector: 'packages-view',
    templateUrl: 'packages-view.template.html'
})

export class PackagesViewComponent implements AfterViewInit, OnDestroy{

  public packageUploader:FileUploader;
  public packages: Package[];

  constructor(
    private packageAPI: PackageApi,
    private auth: LoopBackAuth,
    private toasterService: ToasterService
  ) {
      this.packageUploader = new FileUploader({
        autoUpload: true,
        authToken: this.auth.getAccessTokenId(),
        url: LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/Packages/upload",
        isHTML5: true
      });

      this.packageUploader.onBuildItemForm = this.onBuildItemForm;
      // this.packageUploader.onCompleteItem = this.onCompleteItem;
      this.packageUploader.onCompleteAll = () => {
        this.loadData();
      };

      RemarkPlugin.register('scrollable', ScrollablePlugin);
  }

  onBuildItemForm(item: any, form: any) {
    // form.append('packageId', '35kj32hj3h324kjh234');
  }

  onCompleteItem(item:any, response:any, status:number, headers:any):any {
    // let packageData:Package = new Package(JSON.parse(response));
   // packageData.versions = new PackageFile(packageData.file);
   //  item["packageData"] = packageData;
   //  item["isUploadComplete"] = true;
   //  console.log(item);
    this.loadData();
  }


  ngAfterViewInit() {
    // jQuery('body').addClass('page-aside-left');
    // jQuery('body').addClass('page-aside-scroll');
   // jQuery('body').addClass('app-packages');
   // console.log("test reload");
    this.loadData();
   //  this.packageAPI.developerPackages().subscribe((packages : Package[]) => {
   //      this.packages = packages;
   //      console.log(this.packages);
   //    });
  }

  loadData() {
    this.packageAPI.developerPackages().subscribe((packages : Package[]) => {
      this.packages = packages;
      console.log(this.packages);
    });
  }

  togglePackageVisibility(packageObj: Package) {
    packageObj.visible = !packageObj.visible;
    this.packageAPI.patchAttributes(packageObj.id, {
      visible: packageObj.visible
    }).subscribe((data: Package) => {
      if (data.visible === packageObj.visible) {
        let visString = packageObj.visible ? 'Visible' : 'Hidden';
        this.toasterService.pop({
          type: 'success',
          title: 'Visibility Changed',
          body: String('' + packageObj.name + ' was successfully set to ' + visString + '.'),
        });
      } else {
        packageObj.visible = !packageObj.visible;
        this.toasterService.pop({
          type: 'error',
          title: 'Failed',
          body: String('' + packageObj.name + ' visibility was unable to be changed.'),
        });
      }
    });
  }

  onUploadError(event: any) {
      console.log('onUploadError:', event);
    }

    onUploadSuccess() {
      this.loadData();
    }

    ngOnDestroy() {
     // jQuery('body').removeClass('app-packages');
      // jQuery('body').removeClass('page-aside-scroll');
      // jQuery('body').removeClass('page-aside-left');
    }
}
