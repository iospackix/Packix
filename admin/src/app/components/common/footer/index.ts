import {FooterComponent} from "./footer.component";
import {RouterModule} from "@angular/router";
import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";

@NgModule({
  declarations: [
    FooterComponent
  ],
  imports: [
    BrowserModule,
    RouterModule
  ],
  exports: [
    FooterComponent
  ]
})

export class FooterModule {}
