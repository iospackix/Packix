/* tslint:disable */

declare var Object: any;
export interface PackageDownloadRestrictionInterface {
  "type": string;
  "data": any;
  "packageId": any;
  "accountId": any;
  "id"?: any;
  "createdOn": Date;
  "updatedOn": Date;
  account?: any;
  package?: any;
}

export class PackageDownloadRestriction implements PackageDownloadRestrictionInterface {
  "type": string;
  "data": any;
  "packageId": any;
  "accountId": any;
  "id": any;
  "createdOn": Date;
  "updatedOn": Date;
  account: any;
  package: any;
  constructor(data?: PackageDownloadRestrictionInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `PackageDownloadRestriction`.
   */
  public static getModelName() {
    return "PackageDownloadRestriction";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of PackageDownloadRestriction for dynamic purposes.
  **/
  public static factory(data: PackageDownloadRestrictionInterface): PackageDownloadRestriction{
    return new PackageDownloadRestriction(data);
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
      name: 'PackageDownloadRestriction',
      plural: 'PackageDownloadRestrictions',
      path: 'PackageDownloadRestrictions',
      idName: 'id',
      properties: {
        "type": {
          name: 'type',
          type: 'string'
        },
        "data": {
          name: 'data',
          type: 'any'
        },
        "packageId": {
          name: 'packageId',
          type: 'any'
        },
        "accountId": {
          name: 'accountId',
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
