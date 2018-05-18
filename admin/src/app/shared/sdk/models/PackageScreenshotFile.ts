/* tslint:disable */
import {
  PackageScreenshot
} from '../index';

declare var Object: any;
export interface PackageScreenshotFileInterface {
  "width": number;
  "height": number;
  "sizeKey": string;
  "fileId": string;
  "screenshotId": any;
  "id"?: any;
  "createdOn": Date;
  "updatedOn": Date;
  "deletedAt"?: Date;
  "isDeleted": boolean;
  screenshot?: PackageScreenshot;
}

export class PackageScreenshotFile implements PackageScreenshotFileInterface {
  "width": number;
  "height": number;
  "sizeKey": string;
  "fileId": string;
  "screenshotId": any;
  "id": any;
  "createdOn": Date;
  "updatedOn": Date;
  "deletedAt": Date;
  "isDeleted": boolean;
  screenshot: PackageScreenshot;
  constructor(data?: PackageScreenshotFileInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `PackageScreenshotFile`.
   */
  public static getModelName() {
    return "PackageScreenshotFile";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of PackageScreenshotFile for dynamic purposes.
  **/
  public static factory(data: PackageScreenshotFileInterface): PackageScreenshotFile{
    return new PackageScreenshotFile(data);
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
      name: 'PackageScreenshotFile',
      plural: 'PackageScreenshotFiles',
      path: 'PackageScreenshotFiles',
      idName: 'id',
      properties: {
        "width": {
          name: 'width',
          type: 'number'
        },
        "height": {
          name: 'height',
          type: 'number'
        },
        "sizeKey": {
          name: 'sizeKey',
          type: 'string'
        },
        "fileId": {
          name: 'fileId',
          type: 'string'
        },
        "screenshotId": {
          name: 'screenshotId',
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
        screenshot: {
          name: 'screenshot',
          type: 'PackageScreenshot',
          model: 'PackageScreenshot',
          relationType: 'belongsTo',
                  keyFrom: 'screenshotId',
          keyTo: 'id'
        },
      }
    }
  }
}
