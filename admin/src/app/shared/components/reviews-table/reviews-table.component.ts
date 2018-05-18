import { Component, Input } from '@angular/core';
import {PackageVersionReviewApi} from "../../sdk/services/custom";
import {PackageVersionReview} from "../../sdk/models";
import {DataTableResource} from 'angular5-data-table';

@Component({
  selector: 'reviews-table',
  templateUrl: 'reviews-table.template.html'
})
export class ReviewsTableComponent {

  public data: PackageVersionReview[] = [];
  public items: any = [];
  public itemCount: number = 0;
  public params: any = {};
  public searchText: string = "";
  public itemResource: DataTableResource<PackageVersionReview> = new DataTableResource(this.reviews);

  constructor(public packageVersionReviewAPI: PackageVersionReviewApi) {
    this.reloadAndFilterReviews();
  }

  public get reviews(): Array<PackageVersionReview> {
    return this.data.filter(review => this.filter(review)) as Array<PackageVersionReview>;
  }

  reloadItems(params) {
    this.params = params || {};
    this.itemResource.query(this.params).then((items) => {
      this.items = items;
      //this.itemCount = this.items ? this.items.length : 0;
    });

  }

  public reloadAndFilterReviews() {
    let reviewsData = this.reviews;
    this.itemCount = reviewsData.length;
    this.itemResource = new DataTableResource(reviewsData);
    this.reloadItems(this.params);
  }

  @Input('reviews')
  public set reviews(val: Array<PackageVersionReview>) {
    this.data = val || [];
    for (let review of this.data) {
      // purchase['profileName'] = purchase['account'] ? (purchase['account']['profileName'] ? purchase['account']['profileName'] : "Unknown") : "Unknown";
      // purchase['amountPaid'] = purchase.details.amount.value;
      // purchase['feePaid'] = purchase.details.feeAmount;
      // purchase['payerEmail'] = purchase.details.payerEmail;
      review['ratingValue'] = review.rating ? review.rating.value : 0;
      review['searchText'] = review.title + review.description + review.versionName;
    }
    this.reloadAndFilterReviews();

  }

  rowColors(review) {
    return 'transparent';
  }

  public searchStroke(value) {
    //if ((value || "") !== this.searchText) {
      this.searchText = value || "";
      this.reloadAndFilterReviews();
    //}
  }

  filter(review): boolean {
    if (this.searchText.length > 2) {
      return review['searchText'].match(new RegExp(this.searchText, 'i')) !== null;
    } else return true;
  }


}
