import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {RouterModule} from "@angular/router";

import {DashboardLayoutComponent} from "./dashboardLayout.component";
import {BlankLayoutComponent} from "./blankLayout.component";

import {RemarkDirectivesModule} from "../../../helpers/directives/index";
import {PipesModule} from "../../../pipes/index";
import {NavigationModule} from "../navigation/index";
import {FooterModule} from "../footer/index";
import {ToasterModule} from 'angular2-toaster';


@NgModule({
  declarations: [
    DashboardLayoutComponent,
    BlankLayoutComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    PipesModule,
    RemarkDirectivesModule,
    NavigationModule,
    FooterModule,
    ToasterModule.forChild()
  ],
  exports: [
    DashboardLayoutComponent,
    BlankLayoutComponent
  ]
})

export class LayoutsModule {}
