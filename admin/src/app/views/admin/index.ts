import {NgModule} from "@angular/core";
import { FormsModule }   from '@angular/forms';
import {BrowserModule} from "@angular/platform-browser";
import {RouterModule} from "@angular/router";
import {PackagesViewComponent} from "./packages/index";
import {GroupsViewComponent} from "./groups/index";
import {GroupViewComponent} from "./group/index";
import {AccountsViewComponent, AccountViewComponent} from "./accounts";
import {SharedDirectivesModule} from "../../shared/directives";
import {SharedComponentsModule} from "../../shared/components";

import {PackageVersionViewComponent, PackageViewComponent } from './package/index';
import {DeveloperSettingsViewComponent, DeveloperInfoViewComponent} from "./developer/index";

@NgModule({
  declarations: [
    PackagesViewComponent,
    PackageVersionViewComponent,
    PackageViewComponent,
    DeveloperInfoViewComponent,
    DeveloperSettingsViewComponent,
    AccountsViewComponent,
    AccountViewComponent,
    GroupsViewComponent,
    GroupViewComponent
  ],
  imports: [
    SharedDirectivesModule,
    SharedComponentsModule,
    BrowserModule,
    RouterModule,
    FormsModule,
  ],
  exports: [
    PackagesViewComponent,
    PackageVersionViewComponent,
    PackageViewComponent,
    DeveloperInfoViewComponent,
    DeveloperSettingsViewComponent,
    AccountsViewComponent,
    AccountViewComponent,
    GroupsViewComponent,
    GroupViewComponent
  ],
})

export class AdminDashboardViewsModule {
}
