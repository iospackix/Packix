import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import {
  PackageApi,
  LoopBackAuth,
  AccountGroup,
  AccountGroupApi
} from "../../../shared/sdk";

@Component({
    selector: 'groups-view',
    templateUrl: 'groups-view.template.html'
})

export class GroupsViewComponent implements AfterViewInit {

  public groups: AccountGroup[];

  constructor(
    private packageAPI: PackageApi,
    private auth: LoopBackAuth,
    private groupsAPI: AccountGroupApi
  ) {}

  loadGroupsData() {
    this.groupsAPI.find({
    }).subscribe((groups: AccountGroup[]) => {
      this.groups = groups;
    });
  }

  ngAfterViewInit() {
    this.loadGroupsData();
  }
}
