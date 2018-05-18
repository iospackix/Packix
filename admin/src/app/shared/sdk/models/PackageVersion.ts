/* tslint:disable */
import {
  Package,
  PackageFile,
  PackageVersionRating,
  PackageVersionReview
} from '../index';

declare var Object: any;
export interface PackageVersionInterface {
  "version": string;
  "changes"?: Array<any>;
  "dependencies"?: string;
  "visible"?: boolean;
  "raw"?: any;
  "downloadCount"?: number;
  "ratingStats"?: any;
  "packageId"?: any;
  "packageFileId"?: string;
  "recentReviews"?: Array<any>;
  "id"?: any;
  "createdOn": Date;
  "updatedOn": Date;
  "deletedAt"?: Date;
  "isDeleted": boolean;
  package?: Package;
  file?: PackageFile;
  downloads?: any[];
  ratings?: PackageVersionRating[];
  reviews?: PackageVersionReview[];
}

export class PackageVersion implements PackageVersionInterface {
  "version": string;
  "changes": Array<any>;
  "dependencies": string;
  "visible": boolean;
  "raw": any;
  "downloadCount": number;
  "ratingStats": any;
  "packageId": any;
  "packageFileId": string;
  "recentReviews": Array<any>;
  "id": any;
  "createdOn": Date;
  "updatedOn": Date;
  "deletedAt": Date;
  "isDeleted": boolean;
  package: Package;
  file: PackageFile;
  downloads: any[];
  ratings: PackageVersionRating[];
  reviews: PackageVersionReview[];
  constructor(data?: PackageVersionInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `PackageVersion`.
   */
  public static getModelName() {
    return "PackageVersion";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of PackageVersion for dynamic purposes.
  **/
  public static factory(data: PackageVersionInterface): PackageVersion{
    return new PackageVersion(data);
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
      name: 'PackageVersion',
      plural: 'PackageVersions',
      path: 'PackageVersions',
      idName: 'id',
      properties: {
        "version": {
          name: 'version',
          type: 'string'
        },
        "changes": {
          name: 'changes',
          type: 'Array&lt;any&gt;'
        },
        "dependencies": {
          name: 'dependencies',
          type: 'string'
        },
        "visible": {
          name: 'visible',
          type: 'boolean',
          default: true
        },
        "raw": {
          name: 'raw',
          type: 'any'
        },
        "downloadCount": {
          name: 'downloadCount',
          type: 'number'
        },
        "ratingStats": {
          name: 'ratingStats',
          type: 'any'
        },
        "packageId": {
          name: 'packageId',
          type: 'any'
        },
        "packageFileId": {
          name: 'packageFileId',
          type: 'string'
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
      },
      relations: {
        package: {
          name: 'package',
          type: 'Package',
          model: 'Package',
          relationType: 'belongsTo',
                  keyFrom: 'packageId',
          keyTo: 'id'
        },
        file: {
          name: 'file',
          type: 'PackageFile',
          model: 'PackageFile',
          relationType: 'hasOne',
                  keyFrom: 'id',
          keyTo: 'packageVersionId'
        },
        downloads: {
          name: 'downloads',
          type: 'any[]',
          model: '',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'versionId'
        },
        ratings: {
          name: 'ratings',
          type: 'PackageVersionRating[]',
          model: 'PackageVersionRating',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'packageVersionId'
        },
        reviews: {
          name: 'reviews',
          type: 'PackageVersionReview[]',
          model: 'PackageVersionReview',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'packageVersionId'
        },
      }
    }
  }
}
