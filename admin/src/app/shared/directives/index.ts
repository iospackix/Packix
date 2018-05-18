import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { ModalModule } from "ngx-bootstrap/modal";
import { DataTableModule } from 'angular5-data-table';
import { ToasterModule } from 'angular2-toaster';
import { QuillModule } from 'ngx-quill';
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';
import { SortablejsModule } from "angular-sortablejs";
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSelectModule } from 'ngx-select-ex';
import { RouterModule } from "@angular/router";
// import {SwitcheryDirective} from "./switchery.directive";
import { UiSwitchModule } from 'ngx-ui-switch';
import { MomentModule } from 'ngx-moment';

//       PurchasesTableModule,
//       ReviewsTableModule,
//       RefundRequestsTableModule

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MomentModule,
    TooltipModule,
    ModalModule,
    DataTableModule,
    ToasterModule.forChild(),
    QuillModule,
    FileUploadModule,
    BrowserAnimationsModule,
    SortablejsModule,
    NgxChartsModule,
    NgxSelectModule,
    RouterModule,
    UiSwitchModule,
    MomentModule
  ],
  declarations: [
  ],
  exports: [
    CommonModule,
    FormsModule,
    MomentModule,
    TooltipModule,
    ModalModule,
    DataTableModule,
    ToasterModule,
    QuillModule,
    FileUploadModule,
    BrowserAnimationsModule,
    SortablejsModule,
    NgxChartsModule,
    NgxSelectModule,
    RouterModule,
    UiSwitchModule,
    MomentModule
  ]
})

export class SharedDirectivesModule {}
