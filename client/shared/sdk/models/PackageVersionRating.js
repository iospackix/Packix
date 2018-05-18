
import {
  PackageVersion,
  Package
} from '../index';


export class PackageVersionRating {
  "value";
  "packageId";
  "packageVersionId";
  "clientType";
  "id";
  "createdOn";
  "updatedOn";
  packageVersion;
  package;
  constructor(data) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `PackageVersionRating`.
   */
  static getModelName() {
    return "PackageVersionRating";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of PackageVersionRating for dynamic purposes.
  **/
  static factory(data) {
    return new PackageVersionRating(data);
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
      name: 'PackageVersionRating',
      plural: 'PackageVersionRatings',
      path: 'PackageVersionRatings',
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
