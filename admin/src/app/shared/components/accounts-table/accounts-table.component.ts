import { Component, Input } from '@angular/core';
import {AccountApi} from "../../sdk/services/custom/Account";
import {Account} from "../../sdk/models/Account";
import {PackagePurchaseApi} from "../../sdk/services/custom";
import {PackagePurchase} from "../../sdk/models";
import {DataTableResource} from 'angular5-data-table';
import {PatreonReward} from "../../objects/PatreonReward";

@Component({
  selector: 'accounts-table',
  templateUrl: 'accounts-table.template.html'
})
export class AccountsTableComponent {

  public data: Account[] = [];
  public items: any = [];
  public itemCount: number = 0;
  public params: any = {};
  public searchText: string = "";
  public itemResource: DataTableResource<Account> = new DataTableResource(this.accounts);
  public shouldAllowSearch: boolean = true;

  constructor(public accountAPI: AccountApi) {
    this.reloadAndFilterAccounts();
  }

  public get allowSearch(): boolean {
    return this.shouldAllowSearch;
  }

  public get accounts(): Array<Account> {
    if (!this.shouldAllowSearch) return this.data;
    return this.data.filter(account => this.filter(account)) as Array<Account>;
  }

  reloadItems(params) {
    this.params = params || {};
    this.itemResource.query(this.params).then((items) => {
      this.items = items;
      //this.itemCount = this.items ? this.items.length : 0;
    });

  }

  public reloadAndFilterAccounts() {
    let accountsData = this.accounts;
    this.itemCount = accountsData.length;
    this.itemResource = new DataTableResource(accountsData);
    this.reloadItems(this.params);
  }

  @Input('allowSearch')
  public set allowSearch(allowSearch: boolean) {
    this.shouldAllowSearch = allowSearch;
  }

  @Input('accounts')
  public set accounts(val: Array<Account>) {
    this.data = val || [];
    for (let account of this.data) {
      account['searchText'] = account['profileName'] + account['profileEmail'] + account['id'];
    }
    this.reloadAndFilterAccounts();

  }

  rowColors(account) {
    return 'transparent';
  }

  public searchStroke(value) {
    //if ((value || "") !== this.searchText) {
    this.searchText = value || "";
    this.reloadAndFilterAccounts();
    //}
  }

  filter(account): boolean {
    if (this.searchText.length > 2) {
      return account['searchText'].match(new RegExp(this.searchText, 'i')) !== null;
    } else return true;
  }


}

