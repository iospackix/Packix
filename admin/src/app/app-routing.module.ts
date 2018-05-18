import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BlankLayoutComponent} from "./components/common/layouts/blankLayout.component";
import {DashboardLayoutComponent} from "./components/common/layouts/dashboardLayout.component";
import {PackagesViewComponent} from "./views/admin/packages/packages-view.component";
import {PackageViewComponent} from "./views/admin/package";
// import {PackageViewComponent} from "./views/admin/package/package-view.component";
// import {PackageVersionViewComponent} from "./views/admin/package/version/package-version-view.component";
import {GroupsViewComponent} from "./views/admin/groups/groups-view.component";
import {GroupViewComponent} from "./views/admin/group/group-view.component";
import {AccountsViewComponent} from "./views/admin/accounts/accounts-view.component";
import {AccountViewComponent} from "./views/admin/accounts/account/account-view.component";
import { DeveloperSettingsViewComponent, DeveloperInfoViewComponent} from "./views/admin/developer/index";
import {PackageVersionViewComponent} from "./views/admin/package/version";
const routes: Routes = [
  {
    path: '', component: DashboardLayoutComponent,
    children: [
      { path: 'packages', component: PackagesViewComponent },
      { path: 'packages/:id', component: PackageViewComponent },
      { path: 'packages/:id/version/:version', component: PackageVersionViewComponent },
      { path: 'groups', component: GroupsViewComponent },
      { path: 'groups/:id', component: GroupViewComponent },
      { path: 'accounts', component: AccountsViewComponent },
      { path: 'accounts/:id', component: AccountViewComponent },
      { path: 'developer/settings', component: DeveloperSettingsViewComponent },
      { path: 'developer/info', component: DeveloperInfoViewComponent }
    ]
  },
  { path: '', redirectTo: '/packages', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
