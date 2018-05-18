
import {
  PackageVersion
} from '../index';


export class PackageFile {
  "name";
  "type";
  "size";
  "md5";
  "sha1";
  "sha256";
  "url";
  "container";
  "date";
  "packageVersionId";
  "fileDownloadId";
  "id";
  packageVersion;
  constructor(data) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `PackageFile`.
   */
  static getModelName() {
    return "PackageFile";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of PackageFile for dynamic purposes.
  **/
  static factory(data) {
    return new PackageFile(data);
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
      name: 'PackageFile',
      plural: 'PackageFiles',
      path: 'PackageFiles',
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
      },
      relations: {
        packageVersion: {
          name: 'packageVersion',
          type: 'PackageVersion',
          model: 'PackageVersion'
        },
      }
    }
  }
}
