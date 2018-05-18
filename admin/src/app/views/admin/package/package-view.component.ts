import {AfterViewInit, Component, OnDestroy, ElementRef, ViewChild, ViewEncapsulation, TemplateRef} from '@angular/core';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import {
  Package,
  PackageApi,
  LoopBackAuth,
  LoopBackConfig,
  PackageScreenshotApi,
  RepositoryApi,
  PackageDownloadRestriction,
  PackageDownloadRestrictionApi,
  PackagePurchaseApi,
  PackageGiftLinkApi,
  PackagePurchase,
  DeveloperPreferences,
  DeveloperPreferencesApi,
  PackageRefundRequest,
  PackageVersionReview,
  PackageVersionReviewApi
} from "../../../shared/sdk";

import {RemarkPlugin} from "../../../helpers/remark-plugin";
import {ScrollablePlugin} from "../../../helpers/plugins/scrollable";
import {ActivatedRoute} from "@angular/router";
import {QuillEditorComponent} from "ngx-quill";
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { CurrencyPipe } from '@angular/common';
import { ToasterService } from 'angular2-toaster';
import { PatreonReward } from "../../../shared/objects/PatreonReward";
import { AccountSelectComponent } from "../../../shared/components/account-select";
import { PurchasesTableComponent } from "../../../shared/components/purchases-table";
import { ReviewsTableComponent } from "../../../shared/components/reviews-table";
import {PackageRefundRequestApi} from "../../../shared/sdk/services/custom";

@Component({
    selector: 'package-view',
    templateUrl: 'package-view.template.html'
})

export class PackageViewComponent implements AfterViewInit, OnDestroy{

  public package: Package;
  public packageID: string;
  public detailedPackageDescription: any;
  public screenshotUploader: FileUploader;
  public modalRef: BsModalRef;
  public possiblePatreonInfo: any;
  public selectedPatreonReward: PatreonReward;
  public patreonRewards: PatreonReward[] = [];
  public downloadRestrictions: PackageDownloadRestriction[] = [];
  public selectedRewardId: string = "000000";
  public patreonRestrictionId: string = null;
  public paypalRestrictionId: string = null;
  public paypalPaymentPrice: any = "0";
  public salesCount: any = 0;
  public salesAmount: any = 0;
  public salesFees: any = 0;
  public packageReviews: PackageVersionReview[] = [];
  private shouldShowPaid: boolean = false;
  public emailsString: string = "";
  public emailSepString: string = "";
  public packageName: string = "";
  public packageShort: string = "";
  public bugsReportURL: string = "";
  public showPatreonRestriction: boolean = false;
  public showPayPalRestriction: boolean = false;
  public developerPrefs: DeveloperPreferences;
  public cydiaStoreRestrictionId: string;
  public cydiaStorePackageId: string = "";
  public showCydiaStoreRestriction: boolean = false;
  public minIOSVersion: string = "";
  public maxIOSVersion: string = "";
  public giftToPatreonPledgeAmount: any = 0;
  public giftToPatreonPledgeAmountType:string  = "tier";
  public giftToPatreonPledgeType: string = "current";
  public giftToPatreonPledgeTeirId: string = "";
  public refundRequestResponseNeededCount: number = 0;

  public refundRequests: PackageRefundRequest[] = [];
  public purchaseStats: any = {
    last24Hours: {
      count: 0,
      total: 0
    },
    lastWeek: {
      count: 0,
      total: 0
    },
    lastMonth: {
      count: 0,
      total: 0
    },
    last3Months: {
      count: 0,
      total: 0
    }
  };

  public editorConfig = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }],
      [{ 'align': [] }],
      ['clean'],
      ['link', 'image', 'video']
    ]
  };

  public purchaseColumns: any = [
    { prop: 'account', name: 'User' },
  ];

  public packagePurchases: any;

  @ViewChild(AccountSelectComponent) accountSelect: AccountSelectComponent;
  @ViewChild(PurchasesTableComponent) purchasesTable: PurchasesTableComponent;
  @ViewChild(ReviewsTableComponent) reviewsTable: ReviewsTableComponent;


  @ViewChild('editor') editor: QuillEditorComponent;

  constructor(
    private packageAPI: PackageApi,
    private auth: LoopBackAuth,
    private route: ActivatedRoute,
    private screenshotAPI: PackageScreenshotApi,
    private repositoryAPI: RepositoryApi,
    private packageRestrictionAPI: PackageDownloadRestrictionApi,
    private packagePurchaseAPI: PackagePurchaseApi,
    private modalService: BsModalService,
    private giftAccountAPI: PackageGiftLinkApi,
    private packageVersionReviewAPI: PackageVersionReviewApi,
    private toasterService: ToasterService,
    private developerPrefsApi: DeveloperPreferencesApi,
    private refundRequestApi: PackageRefundRequestApi
  ) {

    this.screenshotUploader = new FileUploader({
      autoUpload: true,
      authToken: this.auth.getAccessTokenId(),
      url: LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/Packages/screenshots/upload",
      isHTML5: true
    });

    this.screenshotUploader.onCompleteItem = this.screenshotUploadComplete;
    this.screenshotUploader['delegate'] = this;

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.packageID = params['id'];
        this.screenshotUploader.setOptions({
          url: LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/Packages/" + this.packageID + "/screenshots/upload"
        });
        this.loadPackageData();
      }
    });

    RemarkPlugin.register('scrollable', ScrollablePlugin);
  }

  loadPackageData() {

    this.developerPrefsApi.getSettings().subscribe((devSettings: DeveloperPreferences) => {
      this.developerPrefs = devSettings;
      this.showPatreonRestriction = this.developerPrefs.usePatreon;
      this.showPayPalRestriction = this.developerPrefs.usePaypal;
      this.showCydiaStoreRestriction = this.developerPrefs.useCydiaStore || false;
    });

    this.packagePurchaseAPI.count({
      packageId: this.packageID,
      status: 'Completed'
    }).subscribe((purchaseCount : any) => {
      console.log(purchaseCount);
      this.salesCount = purchaseCount.count;
      console.log(this.salesCount);
      if (this.package) {
        if (this.package.isPaid || this.salesCount > 0) this.shouldShowPaid = true;
        else this.shouldShowPaid = false;
      }
    });

    this.packageVersionReviewAPI.find({
      where: {
        packageId: this.packageID
      }
    }).subscribe((reviews: PackageVersionReview[]) => {
      this.packageReviews = reviews;
    });
    this.packageAPI.findById(this.packageID,{
      include: [
        {versions: 'file'},
        'latestVersion',
        'downloadRestrictions'
      ]
    })
      .subscribe((packageObject : Package) => {
        this.package = packageObject;
        this.packageName = this.package.name;
        this.packageShort = this.package.shortDescription;
        this.bugsReportURL = this.package.bugsReportURL ? this.package.bugsReportURL : "";
        this.minIOSVersion = this.package.minIOSVersion ? this.package.minIOSVersion : "";
        this.maxIOSVersion = this.package.maxIOSVersion ? this.package.maxIOSVersion : "";
        if (this.salesCount > 0 || this.package.isPaid === true) this.shouldShowPaid = true;
        else this.shouldShowPaid = false;
        this.detailedPackageDescription = this.package.detailedDescription;
        if (this.editor) {
          this.editor.writeValue(this.package.detailedDescription);
          console.log(this.editor);
        }

        this.downloadRestrictions = this.package.downloadRestrictions;
        console.log(this.package);

        this.selectedRewardId = '000000';
        this.patreonRestrictionId = null;
        this.paypalRestrictionId = null;
        this.paypalPaymentPrice = "0";
        for (let restriction of this.downloadRestrictions) {
          if (restriction.type === 'patreon') {
            this.selectedRewardId = restriction['data']['rewardId'];
            this.patreonRestrictionId = restriction.id;
            this.selectedPatreonReward = {
              id: restriction['data']['rewardId'],
              amount: restriction['data']['rewardAmount'],
              campaignId: restriction['data']['campaignId']
            }
          } else if (restriction.type === 'paypal-payment') {
            this.paypalRestrictionId = restriction.id;
            this.paypalPaymentPrice = restriction['data']['price'];
          } else if (restriction.type === 'cydia-store') {
            this.cydiaStoreRestrictionId = restriction.id;
            this.cydiaStorePackageId = restriction['data']['packageIdentifier'];
          }
        }

        this.repositoryAPI.getPatreonInfo().subscribe((rewards : PatreonReward[]) => {
          this.patreonRewards = rewards as Array<PatreonReward> ;
        });

        this.packagePurchaseAPI.find({
          where: {
            packageId: this.packageID,
            status: 'Completed'
          },
          include: ['account']
        }).subscribe((purchases : PackagePurchase[]) => {
          this.packagePurchases = purchases;
          this.salesAmount = 0;
          this.salesFees = 0;
          for (let purchase of this.packagePurchases) {
            this.salesFees += parseFloat(purchase.details.feeAmount);
            this.salesAmount += parseFloat(purchase.details.amount.value);
          }
          if (this.package.identifier === 'com.laughingquoll.noctisxi') this.salesFees += 425;
        });

        this.packageAPI.purchaseStats(
          this.packageID
        ).subscribe((purchaseStats : any) => {
          this.purchaseStats = purchaseStats;
          if (this.package.identifier === 'com.laughingquoll.noctisxi' && this.purchaseStats.last3Months.total >= 425) this.purchaseStats.last3Months.total -= 425;
        });

        this.refundRequestApi.count({
          packageId: this.packageID,
          status: 'pending'
        }).subscribe((refundRequestCountAnswer: any) => {
          this.refundRequestResponseNeededCount = refundRequestCountAnswer.count;
        });
      });
  }

  ngAfterViewInit() {
    //jQuery('body').addClass('app-packages');
  }

  screenshotUploadComplete(item:any, response:any, status:number, headers:any) {
    let packageData: Package = new Package(JSON.parse(response));

    console.log(packageData);
    console.log(this);
    console.log(item);

    let queue: Array<any> = item.uploader.queue;
    queue.splice( queue.indexOf(item), 1 );

    this['delegate'].package['screenshots'] = packageData.screenshots;
  }

  compareThings(ra: PatreonReward, rb: PatreonReward): boolean {
    return ra && rb ? ra.id === rb.id : false;
  }

  removeScreenshot(screenshot: any) {
    console.log(screenshot.id);
    console.log(this.screenshotAPI);
    this.screenshotAPI.deleteById(screenshot.id)
      .subscribe((thing: any) => {
        console.log(thing);
      });
    this.package['screenshots'].splice(  this.package['screenshots'].indexOf(screenshot), 1 );
  }


  savePackageDescription() {
    if (this.package) {
      this.package.detailedDescription = this.detailedPackageDescription;
      this.packageAPI.patchAttributes(this.package.id,{
        "detailedDescription": this.detailedPackageDescription
      })
        .subscribe((packageChanges : any) => {
          console.log(packageChanges);
        });
    }
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  setPatreonReward(value: any) {
    if (value === '000000') {
      this.selectedPatreonReward = null;
      this.selectedRewardId = '000000';
    } else {
      for (let reward of this.patreonRewards) {
        if (reward.id === value) {
          this.selectedPatreonReward = reward;
          this.selectedRewardId = reward.id;
        }
      }
    }
    console.log(this.selectedPatreonReward);
  }

  savePatreonRestriction() {
    if (this.patreonRestrictionId && this.selectedRewardId != '000000') {
        this.packageRestrictionAPI.patchAttributes(this.patreonRestrictionId, {
          data: {
            campaignId: this.selectedPatreonReward.campaignId,
            rewardAmount: this.selectedPatreonReward.amount,
            rewardId: this.selectedPatreonReward.id
          }
        }).subscribe((restriction: PackageDownloadRestriction) => {
          this.loadPackageData();
        });
    } else {
      if (this.selectedRewardId && this.selectedRewardId != '000000') {
        this.packageRestrictionAPI.create({
          type: 'patreon',
          packageId: this.package.id,
          data: {
            campaignId: this.selectedPatreonReward.campaignId,
            rewardAmount: this.selectedPatreonReward.amount,
            rewardId: this.selectedPatreonReward.id
          }
        }).subscribe((restriction: PackageDownloadRestriction) => {
          this.loadPackageData();
        });
      } else {
        if (this.patreonRestrictionId) {
          this.packageRestrictionAPI.deleteById(this.patreonRestrictionId).subscribe((thing: any) => {
            this.loadPackageData();
          });
        }
      }
    }
  }

  saveCydiaStoreRestriction() {
    if (this.cydiaStoreRestrictionId) {
      if (this.cydiaStorePackageId.length > 0) {
        this.packageRestrictionAPI.patchAttributes(this.cydiaStoreRestrictionId, {
          data: {
            packageIdentifier: "" + this.cydiaStorePackageId + ""
          }
        }).subscribe((restriction: PackageDownloadRestriction) => {
          this.loadPackageData();
        });
      } else {
        this.packageRestrictionAPI.deleteById(this.cydiaStoreRestrictionId).subscribe((thing: any) => {
          this.loadPackageData();
        });
      }
    } else {
      if (this.cydiaStorePackageId.length > 0) {
        this.packageRestrictionAPI.create({
          type: 'cydia-store',
          packageId: this.package.id,
          data: {
            packageIdentifier: "" + this.cydiaStorePackageId + ""
          }
        }).subscribe((restriction: PackageDownloadRestriction) => {
          this.loadPackageData();
        });
      }
    }
  }

  savePayPalRestriction() {
    if (this.paypalRestrictionId) {
      if (this.paypalPaymentPrice > 0) {
        this.packageRestrictionAPI.patchAttributes(this.paypalRestrictionId, {
          data: {
            price: "" + this.paypalPaymentPrice + ""
          }
        }).subscribe((restriction: PackageDownloadRestriction) => {
          this.loadPackageData();
        });
      } else {
        this.packageRestrictionAPI.deleteById(this.paypalRestrictionId).subscribe((thing: any) => {
          this.loadPackageData();
        });
      }
    } else {
      if (this.paypalPaymentPrice > 0) {
        this.packageRestrictionAPI.create({
          type: 'paypal-payment',
          packageId: this.package.id,
          data: {
            price: "" + this.paypalPaymentPrice + ""
          }
        }).subscribe((restriction: PackageDownloadRestriction) => {
          this.loadPackageData();
        });
      }
    }
  }

  saveRestrictions() {
    console.log(this.paypalPaymentPrice);
    this.savePayPalRestriction();
    this.savePatreonRestriction();
    this.saveCydiaStoreRestriction();
    this.toasterService.pop({
      type: 'success',
      title: 'Saved Successfully',
      body: 'The restrictions have been saved successfully',
      //toastContainerId: toastContainerId
    });
  }

  giftAccount() {
    this.toasterService.pop({
      type: 'success',
      title: 'Gifted Successfully',
      body: 'The package has been gifted Successfully',
      //toastContainerId: toastContainerId
    });

    let accountId = this.accountSelect.selectedAccount;
    if (accountId && accountId.length > 0) {
      this.giftAccountAPI.create({
        accountId: accountId,
        packageId: this.packageID
      }).subscribe((data: any) => {
        // this.toasterService.pop({
        //   type: 'success',
        //   title: 'Args Title',
        //   body: 'Args Body',
        //   //toastContainerId: toastContainerId
        // });
        this.accountSelect.selectedAccount = null;
      });
    }
    console.log(this.accountSelect.selectedAccount);
  }

  public validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  public giftToEmails() {
    let emailsString = this.emailsString;
    emailsString = emailsString.replace(/\s+/g,'X');
    let emails = emailsString.split(this.emailSepString);
    let validEmails = [];
    for (let email of emails) {
      if (this.validateEmail(email)) {
        validEmails.push(email);
      }
    }

    this.packageAPI.giftToEmails(this.packageID, validEmails).subscribe((result) => {
      console.log('Gifted to ' + validEmails.length + ' emails.');
      this.emailsString = "";
      this.emailSepString = "";
      this.toasterService.pop({
        type: 'success',
        title: 'Gifted Successfully',
        body: 'The package has been gifted successfully to ' + validEmails.length + ' emails',
      });
    })
  }

  public setGiftPledgeTier(tierId): void {
    this.giftToPatreonPledgeTeirId = tierId;
  }

  public giftToPatreonUsers(patreonModal: any): void {

    let useHistoricalAmount = !(this.giftToPatreonPledgeType === 'current');
    let pledgeAmount = 0;
    let didSetPledgeAmount = false;
    if (this.giftToPatreonPledgeAmountType === 'tier') {
      for (let reward of this.patreonRewards) {
        if (reward.id === this.giftToPatreonPledgeTeirId) {
          pledgeAmount = reward.amount;
          didSetPledgeAmount = true;
          break;
        }
      }
    } else {
      if (this.giftToPatreonPledgeAmount > 0) {
        pledgeAmount = this.giftToPatreonPledgeAmount*100;
        didSetPledgeAmount = true;
      }
    }

    if (didSetPledgeAmount === true) {
      this.packageAPI.giftToPatreons(this.packageID, {
        useHistoricalAmount: useHistoricalAmount,
        pledgeAmount: 200
      }).subscribe((result) => {
        this.toasterService.pop({
          type: 'success',
          title: 'Successfully Gifted',
          body: 'The package was successfully gifted to the proper users.',
        });
        patreonModal.hide();
        this.loadPackageData();
      });
    } else {
      this.toasterService.pop({
        type: 'error',
        title: 'Invalid Field Value',
        body: 'One or more of the field values entered is invalid',
      });
    }
    return;
  }

  public savePackage() {
    let updatedDict = {
      "name": this.packageName,
      "shortDescription": this.packageShort,
      "bugsReportURL": this.bugsReportURL,
      "minIOSVersion": this.minIOSVersion,
      "maxIOSVersion": this.maxIOSVersion
    };

    this.packageAPI.patchAttributes(this.package.id, updatedDict).subscribe((data: any) => {
      if (data['name']) {
        this.toasterService.pop({
          type: 'success',
          title: 'Updated Successfully',
          body: 'The package details have been successfully updated',
        });
        this.loadPackageData();
      }
    })
  }

  ngOnDestroy() {
   // jQuery('body').removeClass('app-packages');
  }
}
