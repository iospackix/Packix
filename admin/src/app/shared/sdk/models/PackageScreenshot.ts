/* tslint:disable */
import {
  Package
} from '../index';

declare var Object: any;
export interface PackageScreenshotInterface {
  "description"?: string;
  "packageId": any;
  "sizes"?: any;
  "id"?: any;
  "createdOn": Date;
  "updatedOn": Date;
  "deletedAt"?: Date;
  "isDeleted": boolean;
  package?: Package;
}

export class PackageScreenshot implements PackageScreenshotInterface {
  "description": string;
  "packageId": any;
  "sizes": any;
  "id": any;
  "createdOn": Date;
  "updatedOn": Date;
  "deletedAt": Date;
  "isDeleted": boolean;
  package: Package;
  constructor(data?: PackageScreenshotInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `PackageScreenshot`.
   */
  public static getModelName() {
    return "PackageScreenshot";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of PackageScreenshot for dynamic purposes.
  **/
  public static factory(data: PackageScreenshotInterface): PackageScreenshot{
    return new PackageScreenshot(data);
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
      name: 'PackageScreenshot',
      plural: 'PackageScreenshots',
      path: 'PackageScreenshots',
      idName: 'id',
      properties: {
        "description": {
          name: 'description',
          type: 'string'
        },
        "packageId": {
          name: 'packageId',
          type: 'any'
        },
        "sizes": {
          name: 'sizes',
          type: 'any'
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
      }
    }
  }
}
