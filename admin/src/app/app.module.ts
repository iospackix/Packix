import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import { SDKBrowserModule } from "./shared/sdk/index";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PipesModule } from './pipes/index';
import {AppViewsModule} from "./views/views.module";
import {LayoutsModule} from "./components/common/layouts/index.module";
import {RemarkDirectivesModule} from "./helpers/directives/index";
import {SortablejsModule} from 'angular-sortablejs';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import {SharedComponentsModule} from "./shared/components/index";
import { NgxSelectModule } from 'ngx-select-ex';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ChartsModule } from 'ng2-charts-x';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DataTableModule } from 'angular5-data-table';
import { ToasterModule } from 'angular2-toaster';
import { MomentModule } from "angular2-moment";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    SDKBrowserModule.forRoot(),
    SortablejsModule.forRoot({}),
    NgxDatatableModule,
    DataTableModule,
    AppRoutingModule,
    NgxSelectModule,
    PipesModule,
    AppViewsModule,
    LayoutsModule,
    RemarkDirectivesModule,
    SharedComponentsModule,
    ChartsModule,
    NgxChartsModule,
    BrowserAnimationsModule,
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    ToasterModule.forRoot(),
    MomentModule

  ],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
