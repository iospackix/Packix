/* tslint:disable */
import {
  PackageVersion,
  Package
} from '../index';

declare var Object: any;
export interface PackageVersionRatingInterface {
  "value"?: number;
  "packageId": any;
  "packageVersionId": any;
  "clientType": string;
  "id"?: any;
  "createdOn": Date;
  "updatedOn": Date;
  "deletedAt"?: Date;
  "isDeleted": boolean;
  packageVersion?: PackageVersion;
  package?: Package;
}

export class PackageVersionRating implements PackageVersionRatingInterface {
  "value": number;
  "packageId": any;
  "packageVersionId": any;
  "clientType": string;
  "id": any;
  "createdOn": Date;
  "updatedOn": Date;
  "deletedAt": Date;
  "isDeleted": boolean;
  packageVersion: PackageVersion;
  package: Package;
  constructor(data?: PackageVersionRatingInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `PackageVersionRating`.
   */
  public static getModelName() {
    return "PackageVersionRating";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of PackageVersionRating for dynamic purposes.
  **/
  public static factory(data: PackageVersionRatingInterface): PackageVersionRating{
    return new PackageVersionRating(data);
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
      name: 'PackageVersionRating',
      plural: 'PackageVersionRatings',
      path: 'PackageVersionRatings',
      idName: 'id',
      properties: {
        "value": {
          name: 'value',
          type: 'number'
        },
        "packageId": {
          name: 'packageId',
          type: 'any'
        },
        "packageVersionId": {
          name: 'packageVersionId',
          type: 'any'
        },
        "clientType": {
          name: 'clientType',
          type: 'string',
          default: 'UNKNOWN'
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
        packageVersion: {
          name: 'packageVersion',
          type: 'PackageVersion',
          model: 'PackageVersion',
          relationType: 'belongsTo',
                  keyFrom: 'packageVersionId',
          keyTo: 'id'
        },
        package: {
          name: 'package',
          type: 'Package',
          model: 'Package',
          relationType: 'belongsTo',
                  keyFrom: 'packageId',
          keyTo: 'id'
        },
      }
    }
  }
}
