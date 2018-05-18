/* tslint:disable */
import {
  PackageVersion,
  Package
} from '../index';

declare var Object: any;
export interface PackageDownloadInterface {
  "packageId": any;
  "packageVersionId": any;
  "clientType": string;
  "clientVersion": string;
  "clientCountry"?: string;
  "clientTypeName"?: string;
  "id"?: any;
  "versionId"?: any;
  "createdOn": Date;
  "updatedOn": Date;
  packageVersion?: PackageVersion;
  package?: Package;
}

export class PackageDownload implements PackageDownloadInterface {
  "packageId": any;
  "packageVersionId": any;
  "clientType": string;
  "clientVersion": string;
  "clientCountry": string;
  "clientTypeName": string;
  "id": any;
  "versionId": any;
  "createdOn": Date;
  "updatedOn": Date;
  packageVersion: PackageVersion;
  package: Package;
  constructor(data?: PackageDownloadInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `PackageDownload`.
   */
  public static getModelName() {
    return "PackageDownload";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of PackageDownload for dynamic purposes.
  **/
  public static factory(data: PackageDownloadInterface): PackageDownload{
    return new PackageDownload(data);
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
      name: 'PackageDownload',
      plural: 'PackageDownloads',
      path: 'PackageDownloads',
      idName: 'id',
      properties: {
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
        "clientVersion": {
          name: 'clientVersion',
          type: 'string',
          default: 'UNKNOWN'
        },
        "clientCountry": {
          name: 'clientCountry',
          type: 'string',
          default: 'UNKNOWN'
        },
        "clientTypeName": {
          name: 'clientTypeName',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'any'
        },
        "versionId": {
          name: 'versionId',
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
