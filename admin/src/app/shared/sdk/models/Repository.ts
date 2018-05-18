/* tslint:disable */

declare var Object: any;
export interface RepositoryInterface {
  "id"?: number;
}

export class Repository implements RepositoryInterface {
  "id": number;
  constructor(data?: RepositoryInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Repository`.
   */
  public static getModelName() {
    return "Repository";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Repository for dynamic purposes.
  **/
  public static factory(data: RepositoryInterface): Repository{
    return new Repository(data);
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
      name: 'Repository',
      plural: 'Repository',
      path: 'Repository',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
