/* tslint:disable */

declare var Object: any;
export interface PackageGiftLinkInterface {
  "packageId": any;
  "accountId": any;
  "extraInfo"?: string;
  "id"?: any;
  "deletedAt"?: Date;
  "isDeleted": boolean;
  account?: any;
  package?: any;
}

export class PackageGiftLink implements PackageGiftLinkInterface {
  "packageId": any;
  "accountId": any;
  "extraInfo": string;
  "id": any;
  "deletedAt": Date;
  "isDeleted": boolean;
  account: any;
  package: any;
  constructor(data?: PackageGiftLinkInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `PackageGiftLink`.
   */
  public static getModelName() {
    return "PackageGiftLink";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of PackageGiftLink for dynamic purposes.
  **/
  public static factory(data: PackageGiftLinkInterface): PackageGiftLink{
    return new PackageGiftLink(data);
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
      name: 'PackageGiftLink',
      plural: 'PackageGiftLinks',
      path: 'PackageGiftLinks',
      idName: 'id',
      properties: {
        "packageId": {
          name: 'packageId',
          type: 'any'
        },
        "accountId": {
          name: 'accountId',
          type: 'any'
        },
        "extraInfo": {
          name: 'extraInfo',
          type: 'string',
          default: ''
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
        account: {
          name: 'account',
          type: 'any',
          model: '',
          relationType: 'belongsTo',
                  keyFrom: 'accountId',
          keyTo: 'id'
        },
        package: {
          name: 'package',
          type: 'any',
          model: '',
          relationType: 'belongsTo',
                  keyFrom: 'packageId',
          keyTo: 'id'
        },
      }
    }
  }
}
