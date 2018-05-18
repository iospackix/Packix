
import {
  Package
} from '../index';


export class Section {
  "name";
  "description";
  "icon-url";
  "id";
  packages;
  constructor(data) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Section`.
   */
  static getModelName() {
    return "Section";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Section for dynamic purposes.
  **/
  static factory(data) {
    return new Section(data);
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
      name: 'Section',
      plural: 'Sections',
      path: 'Sections',
      properties: {
        "name": {
          name: 'name',
          type: 'string'
        },
        "description": {
          name: 'description',
          type: 'string',
          default: 'An Awesome Section'
        },
        "icon-url": {
          name: 'icon-url',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'any'
        },
      },
      relations: {
        packages: {
          name: 'packages',
          type: 'Package[]',
          model: 'Package'
        },
      }
    }
  }
}
