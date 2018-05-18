import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {PatreonRewardSelectComponent} from "./patreon-reward-select.component";
import {RemarkDirectivesModule} from "../../helpers/directives";
import {AccountsTableComponent} from "./accounts-table";
import {PurchasesTableComponent} from "./purchases-table";
import {ReviewsTableComponent} from "./reviews-table";
import {RefundRequestsTableComponent} from "./refund-requests-table";
import {SharedDirectivesModule} from "../directives";
import {AccountSelectComponent} from "./account-select";

@NgModule({
  declarations: [
    PatreonRewardSelectComponent,
    AccountsTableComponent,
    PurchasesTableComponent,
    ReviewsTableComponent,
    RefundRequestsTableComponent,
    AccountSelectComponent
  ],
  imports: [
    CommonModule,
    RemarkDirectivesModule,
    SharedDirectivesModule
  ],
  exports: [
    CommonModule,
    PatreonRewardSelectComponent,
    AccountsTableComponent,
    PurchasesTableComponent,
    ReviewsTableComponent,
    RefundRequestsTableComponent,
    AccountSelectComponent
  ]
})

export class SharedComponentsModule {}
