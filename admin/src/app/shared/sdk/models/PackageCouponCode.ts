/* tslint:disable */

declare var Object: any;
export interface PackageCouponCodeInterface {
  "type": string;
  "packageId": any;
  "isClaimed": boolean;
  "accountId"?: any;
  "claimIp"?: string;
  "validUntil"?: Date;
  "usesLeft"?: number;
  "maxUseCount"?: number;
  "extraInfo"?: string;
  "id"?: any;
  "createdOn": Date;
  "updatedOn": Date;
  account?: any;
  package?: any;
}

export class PackageCouponCode implements PackageCouponCodeInterface {
  "type": string;
  "packageId": any;
  "isClaimed": boolean;
  "accountId": any;
  "claimIp": string;
  "validUntil": Date;
  "usesLeft": number;
  "maxUseCount": number;
  "extraInfo": string;
  "id": any;
  "createdOn": Date;
  "updatedOn": Date;
  account: any;
  package: any;
  constructor(data?: PackageCouponCodeInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `PackageCouponCode`.
   */
  public static getModelName() {
    return "PackageCouponCode";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of PackageCouponCode for dynamic purposes.
  **/
  public static factory(data: PackageCouponCodeInterface): PackageCouponCode{
    return new PackageCouponCode(data);
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
      name: 'PackageCouponCode',
      plural: 'PackageCouponCodes',
      path: 'PackageCouponCodes',
      idName: 'id',
      properties: {
        "type": {
          name: 'type',
          type: 'string',
          default: 'full'
        },
        "packageId": {
          name: 'packageId',
          type: 'any'
        },
        "isClaimed": {
          name: 'isClaimed',
          type: 'boolean',
          default: false
        },
        "accountId": {
          name: 'accountId',
          type: 'any'
        },
        "claimIp": {
          name: 'claimIp',
          type: 'string'
        },
        "validUntil": {
          name: 'validUntil',
          type: 'Date'
        },
        "usesLeft": {
          name: 'usesLeft',
          type: 'number'
        },
        "maxUseCount": {
          name: 'maxUseCount',
          type: 'number'
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
