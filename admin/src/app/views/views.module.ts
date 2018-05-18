import {NgModule} from "@angular/core";
import { FormsModule }   from '@angular/forms';
import {BrowserModule} from "@angular/platform-browser";
import {RouterModule} from "@angular/router";
import {AdminDashboardViewsModule} from "./admin/index";


@NgModule({
  declarations: [
  ],
  imports: [
    BrowserModule,
    RouterModule,
    FormsModule,
    AdminDashboardViewsModule
  ],
  exports: [
  ],
})

export class AppViewsModule {
}
