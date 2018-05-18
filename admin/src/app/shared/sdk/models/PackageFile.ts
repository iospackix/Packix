/* tslint:disable */
import {
  PackageVersion
} from '../index';

declare var Object: any;
export interface PackageFileInterface {
  "name": string;
  "type": string;
  "size"?: string;
  "md5": string;
  "sha1": string;
  "sha256": string;
  "url": string;
  "container": string;
  "date"?: string;
  "packageVersionId"?: any;
  "fileDownloadId": string;
  "id"?: any;
  "deletedAt"?: Date;
  "isDeleted": boolean;
  packageVersion?: PackageVersion;
}

export class PackageFile implements PackageFileInterface {
  "name": string;
  "type": string;
  "size": string;
  "md5": string;
  "sha1": string;
  "sha256": string;
  "url": string;
  "container": string;
  "date": string;
  "packageVersionId": any;
  "fileDownloadId": string;
  "id": any;
  "deletedAt": Date;
  "isDeleted": boolean;
  packageVersion: PackageVersion;
  constructor(data?: PackageFileInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `PackageFile`.
   */
  public static getModelName() {
    return "PackageFile";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of PackageFile for dynamic purposes.
  **/
  public static factory(data: PackageFileInterface): PackageFile{
    return new PackageFile(data);
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
      name: 'PackageFile',
      plural: 'PackageFiles',
      path: 'PackageFiles',
      idName: 'id',
      properties: {
        "name": {
          name: 'name',
          type: 'string'
        },
        "type": {
          name: 'type',
          type: 'string'
        },
        "size": {
          name: 'size',
          type: 'string'
        },
        "md5": {
          name: 'md5',
          type: 'string'
        },
        "sha1": {
          name: 'sha1',
          type: 'string'
        },
        "sha256": {
          name: 'sha256',
          type: 'string'
        },
        "url": {
          name: 'url',
          type: 'string'
        },
        "container": {
          name: 'container',
          type: 'string'
        },
        "date": {
          name: 'date',
          type: 'string'
        },
        "packageVersionId": {
          name: 'packageVersionId',
          type: 'any'
        },
        "fileDownloadId": {
          name: 'fileDownloadId',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'any'
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
      }
    }
  }
}
