import { Component, Input, TemplateRef, ViewChild} from '@angular/core';
import {PackageRefundRequestApi} from "../../sdk/services/custom";
import {PackageRefundRequest} from "../../sdk/models";
import {DataTableResource} from 'angular5-data-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'refund-requests-table',
  templateUrl: 'refund-requests-table.template.html'
})
export class RefundRequestsTableComponent {

  public data: PackageRefundRequest[] = [];
  public items: any = [];
  public itemCount: number = 0;
  public params: any = {};
  public searchText: string = "";
  public itemResource: DataTableResource<PackageRefundRequest> = new DataTableResource(this.requests);
  public packageIdValue: string = null;
  public modalRef: BsModalRef;
  public declineReason: string = "";
  public currentDeclineId: string = null;

  @ViewChild('declineModal') public declineModalRef: TemplateRef<any>;

  constructor(private modalService: BsModalService,
              public refundRequestAPI: PackageRefundRequestApi) {
    this.reloadAndFilterRequests();
  }

  public get requests(): Array<PackageRefundRequest> {
    return this.data.filter(request => this.filter(request)) as Array<PackageRefundRequest>;
  }

  reloadItems(params) {
    this.params = params || {};
    this.itemResource.query(this.params).then((items) => {
      this.items = items;
      //this.itemCount = this.items ? this.items.length : 0;
    });

  }

  public reloadAndFilterRequests() {
    let requestsData = this.requests;
    this.itemCount = requestsData.length;
    this.itemResource = new DataTableResource(requestsData);
    this.reloadItems(this.params);
  }

  @Input('requests')
  public set requests(val: Array<PackageRefundRequest>) {
    this.data = val || [];
    for (let request of this.data) {
      request['profileName'] = request['account'] ? (request['account']['profileName'] ? request['account']['profileName'] : "Unknown") : "Unknown";
      request['searchText'] = request['profileName'] + request['reason'];
    }
    this.reloadAndFilterRequests();
  }

  public get packageId(): string {
    return this.packageIdValue;
  }

  @Input('packageId')
  public set packageId(val: string) {
    if (val && val.length > 0) {
      this.packageIdValue = val;
      this.refundRequestAPI.find({
        where: {
          packageId: this.packageIdValue
        }
      }).subscribe((requests: PackageRefundRequest[]) => {
        this.data = requests || [];
        for (let request of this.data) {
          request['profileName'] = request['account'] ? (request['account']['profileName'] ? request['account']['profileName'] : "Unknown") : "Unknown";
          request['searchText'] = request['profileName'] + request['reason'];
        }
        this.reloadAndFilterRequests();
      });
    }
  }

  rowColors(request) {
    return 'transparent';
  }

  public searchStroke(value) {
    //if ((value || "") !== this.searchText) {
    this.searchText = value || "";
    this.reloadAndFilterRequests();
    //}
  }

  filter(request): boolean {
    if (this.searchText.length > 2) {
      return request['searchText'].match(new RegExp(this.searchText, 'i')) !== null;
    } else return true;
  }

  public acceptRequest(requestId): void {
    this.refundRequestAPI.accept(requestId).subscribe((data) => {
      console.log(data);
      this.packageId = this.packageIdValue;
    })
  }

  public declineRequest(requestId): void {
    this.currentDeclineId = requestId;
    this.declineReason = "";
    this.modalRef = this.modalService.show(this.declineModalRef);
    // this.refundRequestAPI.decline(requestId).subscribe((data) => {
    //   console.log(data);
    //   this.packageId = this.packageIdValue;
    // });
  }

  public confirmDeclineRequest(): void {
    if (this.declineReason && this.declineReason.length > 0 && this.currentDeclineId) {
      let declineId = this.currentDeclineId;
      this.currentDeclineId = null;
      this.refundRequestAPI.decline(declineId, this.declineReason).subscribe((data) => {
        console.log(data);
        this.modalRef.hide();
        this.modalRef = null;
        this.packageId = this.packageIdValue;
      });
    }
  }
}
