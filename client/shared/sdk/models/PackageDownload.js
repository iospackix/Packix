
import {
  PackageVersion,
  Package
} from '../index';


export class PackageDownload {
  "packageId";
  "packageVersionId";
  "clientType";
  "clientVersion";
  "clientCountry";
  "id";
  "versionId";
  "createdOn";
  "updatedOn";
  packageVersion;
  package;
  constructor(data) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `PackageDownload`.
   */
  static getModelName() {
    return "PackageDownload";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of PackageDownload for dynamic purposes.
  **/
  static factory(data) {
    return new PackageDownload(data);
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
      name: 'PackageDownload',
      plural: 'PackageDownloads',
      path: 'PackageDownloads',
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
          model: 'PackageVersion'
        },
        package: {
          name: 'package',
          type: 'Package',
          model: 'Package'
        },
      }
    }
  }
}
