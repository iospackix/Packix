import {
  Component,
  ElementRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Account, AccountApi} from "../../../shared/sdk";

import {AccountsTableComponent} from "../../../shared/components/accounts-table";

@Component({
  selector: 'accounts-view',
  templateUrl: 'accounts-view.template.html'
})

export class AccountsViewComponent {

  public accounts: Account[];
  public searchText: string = "";

  @ViewChild(AccountsTableComponent) accountsTable: AccountsTableComponent;

  constructor(
    private accountAPI: AccountApi,
  ) {
    this.loadData();
  }

  loadData() {
    if (this.searchText.length > 2) {
      this.accountAPI.find({
        where: {
          or: [
            {profileName: {regexp: '/' + this.searchText + '/i'}},
            {profileEmail: {regexp: '/' + this.searchText + '/i'}},
            {id: {regexp: '/' + this.searchText + '/i'}},

          ]
        }
      }).subscribe((accounts: Account[]) => {
        this.accounts = accounts;
      });
    } else {
      this.accounts = [];
    }
  }

  public searchStroke(value) {
    this.searchText = value || "";
    this.loadData();
  }
}
