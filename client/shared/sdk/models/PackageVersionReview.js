
import {
  Package,
  PackageVersion
} from '../index';


export class PackageVersionReview {
  "clientType";
  "title";
  "description";
  "packageId";
  "packageVersionId";
  "rating";
  "versionName";
  "id";
  "createdOn";
  "updatedOn";
  package;
  packageVersion;
  constructor(data) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `PackageVersionReview`.
   */
  static getModelName() {
    return "PackageVersionReview";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of PackageVersionReview for dynamic purposes.
  **/
  static factory(data) {
    return new PackageVersionReview(data);
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
      name: 'PackageVersionReview',
      plural: 'PackageVersionReviews',
      path: 'PackageVersionReviews',
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
      },
      relations: {
        package: {
          name: 'package',
          type: 'Package',
          model: 'Package'
        },
        packageVersion: {
          name: 'packageVersion',
          type: 'PackageVersion',
          model: 'PackageVersion'
        },
      }
    }
  }
}
