/* tslint:disable */
import {
  Package
} from '../index';

declare var Object: any;
export interface SectionInterface {
  "name": string;
  "description": string;
  "icon-url"?: string;
  "id"?: any;
  "deletedAt"?: Date;
  "isDeleted": boolean;
  packages?: Package[];
}

export class Section implements SectionInterface {
  "name": string;
  "description": string;
  "icon-url": string;
  "id": any;
  "deletedAt": Date;
  "isDeleted": boolean;
  packages: Package[];
  constructor(data?: SectionInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Section`.
   */
  public static getModelName() {
    return "Section";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Section for dynamic purposes.
  **/
  public static factory(data: SectionInterface): Section{
    return new Section(data);
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
      name: 'Section',
      plural: 'Sections',
      path: 'Sections',
      idName: 'id',
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
        packages: {
          name: 'packages',
          type: 'Package[]',
          model: 'Package',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'sectionId'
        },
      }
    }
  }
}
