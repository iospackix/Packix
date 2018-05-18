import {AfterViewInit, Component, OnDestroy, ElementRef, ViewChild, ViewEncapsulation} from '@angular/core';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {PackageApi} from "../../../../shared/sdk/services/custom/Package";
import {PackageVersionApi} from "../../../../shared/sdk/services/custom/PackageVersion";
import {LoopBackAuth} from "../../../../shared/sdk/services/core/auth.service";
import {LoopBackConfig} from "../../../../shared/sdk/lb.config";
import {Account} from "../../../../shared/sdk/models/Account";
import {PackageFile} from "../../../../shared/sdk/models/PackageFile";
import {RemarkPlugin} from "../../../../helpers/remark-plugin";
import {ScrollablePlugin} from "../../../../helpers/plugins/scrollable";
import {ActivatedRoute} from "@angular/router";
// import {QuillEditorComponent} from "ngx-quill";
import {PackageVersion} from "../../../../shared/sdk/models/PackageVersion";
import {PackageDownloadApi} from "../../../../shared/sdk/services/custom/PackageDownload";
import {AccountApi, DeviceLinkNonceApi} from "../../../../shared/sdk/services/custom";
import {DeviceLinkNonce} from "../../../../shared/sdk/models";

@Component({
    selector: 'account-view',
    templateUrl: 'account-view.template.html'
})

export class AccountViewComponent implements AfterViewInit, OnDestroy{

  public account: Account;
  public accountId: string;
  public linkNonces: DeviceLinkNonce[] = [];


  // @ViewChild('editor') editor: QuillEditorComponent;

  constructor(
    private accountAPI: AccountApi,
    private deviceLinkNonceAPI: DeviceLinkNonceApi,
    private route: ActivatedRoute
  ) {

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.accountId = params['id'];
        this.loadData();
      }
    });

    RemarkPlugin.register('scrollable', ScrollablePlugin);
  }

  loadData() {
    this.accountAPI.findById(this.accountId,{
      include: [
        { relation: 'devices' },
        { relation: 'groups' },
        { relation: 'packagePurchases',
          scope: {
            include: ['package'],
            where: {
              status: 'Completed'
            }
          }
        },
        { relation: 'identities' },
        { relation: 'packageGifts',
          scope: {
            include: ['package']
          }
        }
      ]
    }).subscribe((account: Account) => {
      this.account = account;
    });

    this.deviceLinkNonceAPI.find({
      where: {
        accountId: this.accountId
      }
    }).subscribe((nonces: DeviceLinkNonce[]) => {
      this.linkNonces = nonces;
    });
  }

  ngAfterViewInit() {
    jQuery('body').addClass('app-packages');
  }

  ngOnDestroy() {
    jQuery('body').removeClass('app-packages');
  }
}
