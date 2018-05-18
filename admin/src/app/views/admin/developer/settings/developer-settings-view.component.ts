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
import {AccountSelectComponent} from "../../../../shared/components/account-select";
import {
  DeveloperPreferencesApi,
  RepositoryApi,
  DeveloperPreferences,
  Account
} from "../../../../shared/sdk";
import {ToasterService} from 'angular2-toaster';
;

@Component({
    selector: 'developer-settings-view',
    templateUrl: 'developer-settings-view.template.html'
})

export class DeveloperSettingsViewComponent {

  public accounts: Account[] = [];
  public devSettings: DeveloperPreferences;
  public paypalTestStatus: number = 0;
  public patreonTestStatus: number = 0;

  @ViewChild(AccountSelectComponent) accountSelect: AccountSelectComponent;

  constructor(
    private route: ActivatedRoute,
    private repositoryApi: RepositoryApi,
    private devSettingsApi: DeveloperPreferencesApi,
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
    this.devSettingsApi.getSettings().subscribe((settings: DeveloperPreferences) => {
      this.devSettings = settings;
      this.testTokens();
    });
  }

  saveSettingsData() {
    console.log(this.devSettings);
    let updatedSettings = this.devSettings;
    delete updatedSettings.id;
    delete updatedSettings.accountId;

    updatedSettings.paypalClientId = updatedSettings.paypalClientId.replace(/(\r\n|\n|\r)/gm,"");
    updatedSettings.paypalClientId = updatedSettings.paypalClientId.replace(/\s/g,'');
    updatedSettings.paypalClientSecret = updatedSettings.paypalClientSecret.replace(/(\r\n|\n|\r)/gm,"");
    updatedSettings.paypalClientSecret = updatedSettings.paypalClientSecret.replace(/\s/g,'');
    this.devSettingsApi.updateSettings(updatedSettings).subscribe((settings: DeveloperPreferences) => {
      this.devSettings = settings;
      this.testTokens();
      this.toasterService.pop({
        type: 'success',
        title: 'Saved Successfully',
        body: 'The settings have been saved successfully',
        //toastContainerId: toastContainerId
      });
    })
  }

  testTokens() {
    if (this.devSettings.usePaypal === true) {
      this.devSettingsApi.testPayPal().subscribe((testResult: any) => {
        if (testResult.status === 'success') {
          this.paypalTestStatus = 2;
        } else {
          this.paypalTestStatus = 1;
        }
      });
    } else {
      this.paypalTestStatus = 0;
    }

    if (this.devSettings.usePatreon === true) {
      this.devSettingsApi.testPatreon().subscribe((testResult: any) => {
        if (testResult.status === 'success') {
          this.patreonTestStatus = 2;
        } else {
          this.patreonTestStatus = 1;
        }
      });
    } else {
      this.patreonTestStatus = 0;
    }
  }

  // testPayPalInfo() {
  //   console.log(this.devSettings);
  //   let updatedSettings = this.devSettings;
  //   delete updatedSettings.id;
  //   delete updatedSettings.accountId;
  //
  //   updatedSettings.paypalClientId = updatedSettings.paypalClientId.replace(/(\r\n|\n|\r)/gm,"");
  //   updatedSettings.paypalClientId = updatedSettings.paypalClientId.replace(/\s/g,'');
  //   updatedSettings.paypalClientSecret = updatedSettings.paypalClientSecret.replace(/(\r\n|\n|\r)/gm,"");
  //   updatedSettings.paypalClientSecret = updatedSettings.paypalClientSecret.replace(/\s/g,'');
  //   this.devSettingsApi.updateSettings(updatedSettings).subscribe((settings: DeveloperPreferences) => {
  //     // this.devSettings = settings;
  //     // this.devSettingsApi.testPayPal().subscribe((testResult: any) => {
  //     //   if (testResult.status === 'success') {
  //     //     this.paypalTestStatus = 2;
  //     //   } else {
  //     //     this.paypalTestStatus = 1;
  //     //   }
  //     // });
  //     // this.toasterService.pop({
  //     //   type: 'success',
  //     //   title: 'Saved Successfully',
  //     //   body: 'The setting have been saved successfully',
  //     //   //toastContainerId: toastContainerId
  //     // });
  //   })
  // }

  addAccountToDevelopers() {

    let accountId = this.accountSelect.selectedAccount;
    if (accountId && accountId.length > 0) {
      this.repositoryApi.makeUserDeveloper(accountId).subscribe((data: any) => {
        console.log(data);
        this.accountSelect.selectedAccount = null;
        this.toasterService.pop({
          type: 'success',
          title: 'Success',
          body: 'The user has been successfully made a developer',
          //toastContainerId: toastContainerId
        });
      });
    }
    console.log(this.accountSelect.selectedAccount);
  }
}
