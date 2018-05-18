
import {
  Package
} from '../index';


export class TestModel {
  "name";
  "accountId";
  "packageId";
  "id";
  package;
  constructor(data) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `TestModel`.
   */
  static getModelName() {
    return "TestModel";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of TestModel for dynamic purposes.
  **/
  static factory(data) {
    return new TestModel(data);
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
      name: 'TestModel',
      plural: 'TestModels',
      path: 'TestModels',
      properties: {
        "name": {
          name: 'name',
          type: 'string'
        },
        "accountId": {
          name: 'accountId',
          type: 'string'
        },
        "packageId": {
          name: 'packageId',
          type: 'any'
        },
        "id": {
          name: 'id',
          type: 'any'
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
