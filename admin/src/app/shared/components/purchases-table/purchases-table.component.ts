import { Component, Input } from '@angular/core';
import {PackagePurchaseApi} from "../../sdk/services/custom";
import {PackagePurchase} from "../../sdk/models";
import {DataTableResource} from 'angular5-data-table';

@Component({
  selector: 'purchases-table',
  templateUrl: 'purchases-table.template.html'
})
export class PurchasesTableComponent {

  public data: PackagePurchase[] = [];
  public items: any = [];
  public itemCount: number = 0;
  public params: any = {};
  public searchText: string = "";
  public itemResource: DataTableResource<PackagePurchase> = new DataTableResource(this.purchases);

  constructor(public packagePurchaseAPI: PackagePurchaseApi) {
    this.reloadAndFilterPurchases();
  }

  public get purchases(): Array<PackagePurchase> {
    return this.data.filter(purchase => this.filter(purchase)) as Array<PackagePurchase>;
  }

  reloadItems(params) {
    this.params = params || {};
    this.itemResource.query(this.params).then((items) => {
      this.items = items;
      //this.itemCount = this.items ? this.items.length : 0;
    });

  }

  public reloadAndFilterPurchases() {
    let purchasesData = this.purchases;
    this.itemCount = purchasesData.length;
    this.itemResource = new DataTableResource(purchasesData);
    this.reloadItems(this.params);
  }

  @Input('purchases')
  public set purchases(val: Array<PackagePurchase>) {
    this.data = val || [];
    for (let purchase of this.data) {
      purchase['profileName'] = purchase['account'] ? (purchase['account']['profileName'] ? purchase['account']['profileName'] : "Unknown") : "Unknown";
      purchase['amountPaid'] = purchase.details.amount.value;
      purchase['feePaid'] = purchase.details.feeAmount;
      purchase['payerEmail'] = purchase.details.payerEmail;
      purchase['searchText'] = purchase['profileName'] + purchase['payerEmail'] + purchase['account']['profileEmail'];
    }
    this.reloadAndFilterPurchases();

  }

  rowColors(purchase) {
    return 'transparent';
  }

  public searchStroke(value) {
    //if ((value || "") !== this.searchText) {
    this.searchText = value || "";
    this.reloadAndFilterPurchases();
    //}
  }

  filter(purchase): boolean {
    if (this.searchText.length > 2) {
      return purchase['searchText'].match(new RegExp(this.searchText, 'i')) !== null;
    } else return true;
  }
}
