
import {
  Package
} from '../index';


export class PackageScreenshot {
  "description";
  "packageId";
  "sizes";
  "id";
  "createdOn";
  "updatedOn";
  package;
  constructor(data) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `PackageScreenshot`.
   */
  static getModelName() {
    return "PackageScreenshot";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of PackageScreenshot for dynamic purposes.
  **/
  static factory(data) {
    return new PackageScreenshot(data);
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
      name: 'PackageScreenshot',
      plural: 'PackageScreenshots',
      path: 'PackageScreenshots',
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
      },
      relations: {
        package: {
          name: 'package',
          type: 'Package',
          model: 'Package'
        },
      }
    }
  }
}
