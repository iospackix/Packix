
import {
  Package,
  PackageFile,
  PackageVersionRating,
  PackageVersionReview
} from '../index';


export class PackageVersion {
  "version";
  "changes";
  "dependencies";
  "visible";
  "raw";
  "downloadCount";
  "ratingStats";
  "packageId";
  "packageFileId";
  "recentReviews";
  "id";
  "createdOn";
  "updatedOn";
  package;
  file;
  downloads;
  ratings;
  reviews;
  constructor(data) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `PackageVersion`.
   */
  static getModelName() {
    return "PackageVersion";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of PackageVersion for dynamic purposes.
  **/
  static factory(data) {
    return new PackageVersion(data);
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
      name: 'PackageVersion',
      plural: 'PackageVersions',
      path: 'PackageVersions',
      properties: {
        "version": {
          name: 'version',
          type: 'string'
        },
        "changes": {
          name: 'changes',
          type: 'Array&lt;any&gt;'
        },
        "dependencies": {
          name: 'dependencies',
          type: 'string'
        },
        "visible": {
          name: 'visible',
          type: 'boolean',
          default: true
        },
        "raw": {
          name: 'raw',
          type: 'any'
        },
        "downloadCount": {
          name: 'downloadCount',
          type: 'number'
        },
        "ratingStats": {
          name: 'ratingStats',
          type: 'any'
        },
        "packageId": {
          name: 'packageId',
          type: 'any'
        },
        "packageFileId": {
          name: 'packageFileId',
          type: 'string'
        },
        "recentReviews": {
          name: 'recentReviews',
          type: 'Array&lt;any&gt;',
          default: []
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
        file: {
          name: 'file',
          type: 'PackageFile',
          model: 'PackageFile'
        },
        downloads: {
          name: 'downloads',
          type: 'any[]',
          model: ''
        },
        ratings: {
          name: 'ratings',
          type: 'PackageVersionRating[]',
          model: 'PackageVersionRating'
        },
        reviews: {
          name: 'reviews',
          type: 'PackageVersionReview[]',
          model: 'PackageVersionReview'
        },
      }
    }
  }
}
