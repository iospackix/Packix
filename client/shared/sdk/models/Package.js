
import {
  Account,
  PackageVersion,
  Section,
  PackageVersionReview,
  PackageDownloadRestriction,
  PackageCouponCode,
  DeveloperInfo
} from '../index';


export class Package {
  "name";
  "identifier";
  "shortDescription";
  "minIOSVersion";
  "maxIOSVersion";
  "author";
  "maintainer";
  "accountId";
  "visible";
  "stage";
  "detailedDescription";
  "bugsReportURL";
  "price";
  "isPaid";
  "patreonRestricted";
  "hasRestrictions";
  "latestVersionId";
  "screenshots";
  "screenshotIds";
  "recentReviews";
  "id";
  "createdOn";
  "updatedOn";
  "sectionId";
  owner;
  versions;
  latestVersion;
  section;
  purchases;
  reviews;
  downloadRestrictions;
  couponCodes;
  developer;
  constructor(data) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Package`.
   */
  static getModelName() {
    return "Package";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Package for dynamic purposes.
  **/
  static factory(data) {
    return new Package(data);
  }
  /**
  * @method getModelDefinition
  * @author Julien Ledun
  * @license MIT
  * This method returns an object that represents some of the model
  * definitions.
  **/
  static getModelDefinition() {
    return {
      name: 'Package',
      plural: 'Packages',
      path: 'Packages',
      properties: {
        "name": {
          name: 'name',
          type: 'string'
        },
        "identifier": {
          name: 'identifier',
          type: 'string'
        },
        "shortDescription": {
          name: 'shortDescription',
          type: 'string',
          default: 'An Awesome Mobile Substrate Tweak'
        },
        "minIOSVersion": {
          name: 'minIOSVersion',
          type: 'string'
        },
        "maxIOSVersion": {
          name: 'maxIOSVersion',
          type: 'string'
        },
        "author": {
          name: 'author',
          type: 'string'
        },
        "maintainer": {
          name: 'maintainer',
          type: 'string'
        },
        "accountId": {
          name: 'accountId',
          type: 'any'
        },
        "visible": {
          name: 'visible',
          type: 'boolean',
          default: false
        },
        "stage": {
          name: 'stage',
          type: 'string',
          default: 'stable'
        },
        "detailedDescription": {
          name: 'detailedDescription',
          type: 'any'
        },
        "bugsReportURL": {
          name: 'bugsReportURL',
          type: 'string'
        },
        "price": {
          name: 'price',
          type: 'number'
        },
        "isPaid": {
          name: 'isPaid',
          type: 'boolean',
          default: false
        },
        "patreonRestricted": {
          name: 'patreonRestricted',
          type: 'boolean',
          default: false
        },
        "hasRestrictions": {
          name: 'hasRestrictions',
          type: 'boolean',
          default: false
        },
        "latestVersionId": {
          name: 'latestVersionId',
          type: 'any'
        },
        "screenshots": {
          name: 'screenshots',
          type: 'Array&lt;any&gt;',
          default: []
        },
        "screenshotIds": {
          name: 'screenshotIds',
          type: 'Array&lt;any&gt;'
        },
        "recentReviews": {
          name: 'recentReviews',
          type: 'Array&lt;any&gt;',
          default: []
        },
        "id": {
          name: 'id',
          type: 'any'
        },
        "createdOn": {
          name: 'createdOn',
          type: 'Date'
        },
        "updatedOn": {
          name: 'updatedOn',
          type: 'Date'
        },
        "sectionId": {
          name: 'sectionId',
          type: 'any'
        },
      },
      relations: {
        owner: {
          name: 'owner',
          type: 'Account',
          model: 'Account'
        },
        versions: {
          name: 'versions',
          type: 'PackageVersion[]',
          model: 'PackageVersion'
        },
        latestVersion: {
          name: 'latestVersion',
          type: 'PackageVersion',
          model: 'PackageVersion'
        },
        section: {
          name: 'section',
          type: 'Section',
          model: 'Section'
        },
        purchases: {
          name: 'purchases',
          type: 'any[]',
          model: ''
        },
        reviews: {
          name: 'reviews',
          type: 'PackageVersionReview[]',
          model: 'PackageVersionReview'
        },
        downloadRestrictions: {
          name: 'downloadRestrictions',
          type: 'PackageDownloadRestriction[]',
          model: 'PackageDownloadRestriction'
        },
        couponCodes: {
          name: 'couponCodes',
          type: 'PackageCouponCode[]',
          model: 'PackageCouponCode'
        },
        developer: {
          name: 'developer',
          type: 'DeveloperInfo',
          model: 'DeveloperInfo'
        },
      }
    }
  }
}
