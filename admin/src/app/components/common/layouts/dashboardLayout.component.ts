import {AfterViewInit, Component} from '@angular/core';
import {RemarkPlugin} from "../../../helpers/remark-plugin";
import {ScrollablePlugin} from "../../../helpers/plugins/scrollable";
import {AccountApi} from "../../../shared/sdk/services/custom/Account";
import {DeveloperInfoApi} from "../../../shared/sdk/services/custom";
import {DeveloperInfo} from "../../../shared/sdk";
import { Router, NavigationEnd } from '@angular/router';

declare var jQuery:any;

@Component({
  selector: 'basic',
  templateUrl: 'dashboardLayout.template.html'
})
export class DashboardLayoutComponent implements AfterViewInit {

  // public ngOnInit():any {
  //   detectBody();
  // }
  //
  // public onResize(){
  //   detectBody();
  // }

  public profilePhotoURL:string = '';
  public profileDisplayName:string = '';
  public hasSetDevInfo = true;

  constructor(private accountApi: AccountApi, private devInfoApi: DeveloperInfoApi, private router: Router) {
    RemarkPlugin.register('scrollable', ScrollablePlugin);
    this.accountApi.getMe().subscribe((profile : any) => {
      this.profilePhotoURL = profile['profilePhoto'];
      this.profileDisplayName = profile['profileName'];
    });
  }

  reloadNotifications(): void {
    this.devInfoApi.getSettings().subscribe((info: DeveloperInfo) => {
      this.hasSetDevInfo = true;
      if (this.router.url == '/developer/info') return;
      if (info && info.name && info.name.length > 0) return;
      this.hasSetDevInfo = false;
    });
  }

  ngAfterViewInit() {
    //RemarkPlugin.register('scrollable', ScrollablePlugin);
  }

}
