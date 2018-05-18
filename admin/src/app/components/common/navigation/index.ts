import {SidebarComponent} from "./sidebar/sidebar.component";
import {RouterModule} from "@angular/router";
import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";

@NgModule({
  declarations: [
    SidebarComponent
  ],
  imports: [
    BrowserModule,
    RouterModule
  ],
  exports: [
    SidebarComponent
  ]
})

export class NavigationModule {}
