import { Component } from '@angular/core';
import {AccountApi} from "../../sdk/services/custom/Account";
import {Account} from "../../sdk/models/Account";

@Component({
  selector: 'account-select',
  templateUrl: 'account-select.template.html'
})
export class AccountSelectComponent {

  public accounts: Account[];
  public selectedAccount: any = [];
  constructor(public accountAPI: AccountApi) {
  }

  public loadAccountsWithText(text: string) {
    console.log('Search Text: ' + text);
   // var txtPattern = new RegExp('.*'+text+'.*', "i");
    this.accountAPI.find({
      where: {
        or: [
          {profileName: { regexp: '/' + text + '/i'}},
          {profileEmail: { regexp: '/' + text + '/i' }}
        ]
      }
    }).subscribe((accounts: Account[]) => {
      for (let account of accounts) {
        account['text'] = account['profileName'] + account['profileEmail'];
      }
      this.accounts = accounts;
    });
  }

  public inputTyped(source: string, text: string) {
    if (text && text.length > 2) {
      this.loadAccountsWithText(text);
    } else {
      this.accounts = [];
    }
    console.log(this.accounts);
  }


}
