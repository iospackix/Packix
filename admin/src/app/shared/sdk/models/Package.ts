/* tslint:disable */
import {
  Account,
  PackageVersion,
  Section,
  PackageVersionReview,
  PackageDownloadRestriction,
  PackageCouponCode,
  DeveloperInfo
} from '../index';

declare var Object: any;
export interface PackageInterface {
  "name"?: string;
  "identifier"?: string;
  "shortDescription": string;
  "minIOSVersion"?: string;
  "maxIOSVersion"?: string;
  "author"?: string;
  "maintainer"?: string;
  "accountId"?: any;
  "visible"?: boolean;
  "stage"?: string;
  "detailedDescription"?: any;
  "bugsReportURL"?: string;
  "price"?: number;
  "isPaid"?: boolean;
  "patreonRestricted"?: boolean;
  "hasRestrictions"?: boolean;
  "latestVersionId"?: any;
  "screenshots"?: Array<any>;
  "screenshotIds"?: Array<any>;
  "recentReviews"?: Array<any>;
  "id"?: any;
  "createdOn": Date;
  "updatedOn": Date;
  "deletedAt"?: Date;
  "isDeleted": boolean;
  "sectionId"?: any;
  owner?: Account;
  versions?: PackageVersion[];
  latestVersion?: PackageVersion;
  section?: Section;
  purchases?: any[];
  reviews?: PackageVersionReview[];
  downloadRestrictions?: PackageDownloadRestriction[];
  couponCodes?: PackageCouponCode[];
  developer?: DeveloperInfo;
}

export class Package implements PackageInterface {
  "name": string;
  "identifier": string;
  "shortDescription": string;
  "minIOSVersion": string;
  "maxIOSVersion": string;
  "author": string;
  "maintainer": string;
  "accountId": any;
  "visible": boolean;
  "stage": string;
  "detailedDescription": any;
  "bugsReportURL": string;
  "price": number;
  "isPaid": boolean;
  "patreonRestricted": boolean;
  "hasRestrictions": boolean;
  "latestVersionId": any;
  "screenshots": Array<any>;
  "screenshotIds": Array<any>;
  "recentReviews": Array<any>;
  "id": any;
  "createdOn": Date;
  "updatedOn": Date;
  "deletedAt": Date;
  "isDeleted": boolean;
  "sectionId": any;
  owner: Account;
  versions: PackageVersion[];
  latestVersion: PackageVersion;
  section: Section;
  purchases: any[];
  reviews: PackageVersionReview[];
  downloadRestrictions: PackageDownloadRestriction[];
  couponCodes: PackageCouponCode[];
  developer: DeveloperInfo;
  constructor(data?: PackageInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Package`.
   */
  public static getModelName() {
    return "Package";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Package for dynamic purposes.
  **/
  public static factory(data: PackageInterface): Package{
    return new Package(data);
  }
  /**
  * @method getModelDefinition
  * @author Julien Ledun
  * @license MIT
  * This method returns an object that represents some of the model
  * definitions.
  **/
  public static getModelDefinition() {
    return {
      name: 'Package',
      plural: 'Packages',
      path: 'Packages',
      idName: 'id',
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
          default: <any>[]
        },
        "screenshotIds": {
          name: 'screenshotIds',
          type: 'Array&lt;any&gt;'
        },
        "recentReviews": {
          name: 'recentReviews',
          type: 'Array&lt;any&gt;',
          default: <any>[]
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
        "deletedAt": {
          name: 'deletedAt',
          type: 'Date'
        },
        "isDeleted": {
          name: 'isDeleted',
          type: 'boolean',
          default: false
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
          model: 'Account',
          relationType: 'belongsTo',
                  keyFrom: 'accountId',
          keyTo: 'id'
        },
        versions: {
          name: 'versions',
          type: 'PackageVersion[]',
          model: 'PackageVersion',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'packageId'
        },
        latestVersion: {
          name: 'latestVersion',
          type: 'PackageVersion',
          model: 'PackageVersion',
          relationType: 'belongsTo',
                  keyFrom: 'latestVersionId',
          keyTo: 'id'
        },
        section: {
          name: 'section',
          type: 'Section',
          model: 'Section',
          relationType: 'belongsTo',
                  keyFrom: 'sectionId',
          keyTo: 'id'
        },
        purchases: {
          name: 'purchases',
          type: 'any[]',
          model: '',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'packageId'
        },
        reviews: {
          name: 'reviews',
          type: 'PackageVersionReview[]',
          model: 'PackageVersionReview',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'packageId'
        },
        downloadRestrictions: {
          name: 'downloadRestrictions',
          type: 'PackageDownloadRestriction[]',
          model: 'PackageDownloadRestriction',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'packageId'
        },
        couponCodes: {
          name: 'couponCodes',
          type: 'PackageCouponCode[]',
          model: 'PackageCouponCode',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'packageId'
        },
        developer: {
          name: 'developer',
          type: 'DeveloperInfo',
          model: 'DeveloperInfo',
          relationType: 'hasOne',
                  keyFrom: 'accountId',
          keyTo: 'accountId'
        },
      }
    }
  }
}
