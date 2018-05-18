import {Component, Directive, ViewChild} from '@angular/core';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
// import {PackageApi} from "../../../shared/sdk/services/custom/Package";
// import {LoopBackAuth} from "../../../shared/sdk/services/core/auth.service";
// import {Account} from "../../../shared/sdk/models/Account";
// import {AccountGroupApi} from "../../../shared/sdk/services/custom/AccountGroup";
// import {AccountGroup} from "../../../shared/sdk/models/AccountGroup";
import {ActivatedRoute} from "@angular/router";
import {
  RepositoryApi,
  DeveloperInfo,
  DeveloperInfoApi
} from "../../../../shared/sdk";
// import {DeveloperPreferencesApi, RepositoryApi} from "../../../shared/sdk/services/custom";
// import {DeveloperPreferences} from "../../../shared/sdk/models";
import {ToasterService} from 'angular2-toaster';


@Component({
    selector: 'developer--view',
    templateUrl: 'developer-info-view.template.html'
})

export class DeveloperInfoViewComponent {

  public devInfo: DeveloperInfo;

  constructor(
    private route: ActivatedRoute,
    private repositoryApi: RepositoryApi,
    private devInfoApi: DeveloperInfoApi,
    private toasterService: ToasterService
  ) {
    this.loadSettingsData();
    // this.route.params.subscribe(params => {
    //   this.groupId = params['id'];
    //   console.log(this.groupId);
    //   this.loadGroupData();
    // });
  }

  loadSettingsData() {
    // this.devSettingsApi.getSettings().subscribe((settings: DeveloperPreferences) => {
    //   this.devSettings = settings;
    // });
    this.devInfoApi.getSettings().subscribe((info: DeveloperInfo) => {
      this.devInfo = info;
    });
  }

  // saveSettingsData() {
  //   console.log(this.devSettings);
  //   let updatedSettings = this.devSettings;
  //   delete updatedSettings.id;
  //   delete updatedSettings.accountId;
  //   this.devSettingsApi.updateSettings(updatedSettings).subscribe((settings: DeveloperPreferences) => {
  //     this.devSettings = settings;
  //     this.toasterService.pop({
  //       type: 'success',
  //       title: 'Saved Successfully',
  //       body: 'The setting have been saved successfully',
  //       //toastContainerId: toastContainerId
  //     });
  //   })
  // }

  saveInfoData() {
    let updatedSettings = this.devInfo;
    delete updatedSettings.id;
    delete updatedSettings.accountId;
    this.devInfoApi.updateSettings(updatedSettings).subscribe((info: DeveloperInfo) => {
      this.devInfo = info;
      this.toasterService.pop({
        type: 'success',
        title: 'Saved Successfully',
        body: 'The Developer Info has been saved successfully',
        //toastContainerId: toastContainerId
      });
    })
  }
}
