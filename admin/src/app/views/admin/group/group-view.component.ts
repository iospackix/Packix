import {
  Component,
  Directive,
  ViewChild
} from '@angular/core';

import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import {
  PackageApi,
  LoopBackAuth,
  Account,
  AccountGroupApi,
  AccountGroup,
  AccountGroupLinkApi
} from "../../../shared/sdk";

import {ActivatedRoute} from "@angular/router";
import {AccountSelectComponent} from "../../../shared/components/account-select";

@Component({
    selector: 'group-view',
    templateUrl: 'group-view.template.html'
})

export class GroupViewComponent {

  public group: AccountGroup;
  public groupId: string;
  public accounts: Account[] = [];

  @ViewChild(AccountSelectComponent) accountSelect: AccountSelectComponent;

  constructor(
    private packageAPI: PackageApi,
    private auth: LoopBackAuth,
    private groupsAPI: AccountGroupApi,
    private route: ActivatedRoute,
    private accountGroupLinkApi: AccountGroupLinkApi
  ) {
    this.route.params.subscribe(params => {
      this.groupId = params['id'];
      this.loadGroupData();
    });
  }

  loadGroupData() {
    this.groupsAPI.findById(this.groupId, {
      include: ['accounts']
    }).subscribe((groupObject : AccountGroup) => {
      this.group = groupObject;
      this.accounts = this.group.accounts || [];
    });
  }

  addAccountToGroup() {

    let accountId = this.accountSelect.selectedAccount;
    if (accountId && accountId.length > 0) {
      for (let account of this.group.accounts) {
        if (account.id === accountId) return;
      }
      this.accountGroupLinkApi.create({
        accountId: accountId,
        accountGroupId: this.groupId
      }).subscribe((data: any) => {
        this.loadGroupData();
        this.accountSelect.selectedAccount = null;
      })
    }
  }
}
