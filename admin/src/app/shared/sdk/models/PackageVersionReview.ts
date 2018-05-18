/* tslint:disable */
import {
  Package,
  PackageVersion
} from '../index';

declare var Object: any;
export interface PackageVersionReviewInterface {
  "clientType": string;
  "title": string;
  "description": string;
  "packageId": any;
  "packageVersionId": any;
  "rating"?: any;
  "versionName": string;
  "id"?: any;
  "createdOn": Date;
  "updatedOn": Date;
  "deletedAt"?: Date;
  "isDeleted": boolean;
  package?: Package;
  packageVersion?: PackageVersion;
}

export class PackageVersionReview implements PackageVersionReviewInterface {
  "clientType": string;
  "title": string;
  "description": string;
  "packageId": any;
  "packageVersionId": any;
  "rating": any;
  "versionName": string;
  "id": any;
  "createdOn": Date;
  "updatedOn": Date;
  "deletedAt": Date;
  "isDeleted": boolean;
  package: Package;
  packageVersion: PackageVersion;
  constructor(data?: PackageVersionReviewInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `PackageVersionReview`.
   */
  public static getModelName() {
    return "PackageVersionReview";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of PackageVersionReview for dynamic purposes.
  **/
  public static factory(data: PackageVersionReviewInterface): PackageVersionReview{
    return new PackageVersionReview(data);
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
      name: 'PackageVersionReview',
      plural: 'PackageVersionReviews',
      path: 'PackageVersionReviews',
      idName: 'id',
      properties: {
        "clientType": {
          name: 'clientType',
          type: 'string',
          default: 'UNKNOWN'
        },
        "title": {
          name: 'title',
          type: 'string',
          default: 'No Title Provided'
        },
        "description": {
          name: 'description',
          type: 'string',
          default: 'No Details were Provided'
        },
        "packageId": {
          name: 'packageId',
          type: 'any'
        },
        "packageVersionId": {
          name: 'packageVersionId',
          type: 'any'
        },
        "rating": {
          name: 'rating',
          type: 'any'
        },
        "versionName": {
          name: 'versionName',
          type: 'string'
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
        packageVersion: {
          name: 'packageVersion',
          type: 'PackageVersion',
          model: 'PackageVersion',
          relationType: 'belongsTo',
                  keyFrom: 'packageVersionId',
          keyTo: 'id'
        },
      }
    }
  }
}
