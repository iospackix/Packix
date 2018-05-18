
import {RouterModule} from "@angular/router";
import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {AsScrollableDirective} from "./as-scrollable.directive";
import {RemarkDropdownDirective} from "./remark-dropdown.directive";
import {RemarkPageAsideDirective} from "./remark-page-aside.directive";
import { BootstrapSelectDirective } from "./bootstrap-select.directive";

@NgModule({
  declarations: [
    AsScrollableDirective,
    RemarkDropdownDirective,
    RemarkPageAsideDirective,
    BootstrapSelectDirective
  ],
  imports: [
    BrowserModule,
    RouterModule
  ],
  exports: [
    AsScrollableDirective,
    RemarkDropdownDirective,
    RemarkPageAsideDirective,
    BootstrapSelectDirective
  ]
})

export class RemarkDirectivesModule {}
