/* tslint:disable */
import {
  Package,
  Account,
  PackagePurchase
} from '../index';

declare var Object: any;
export interface PackageRefundRequestInterface {
  "accountId": any;
  "downloads"?: Array<any>;
  "packageId": any;
  "purchaseId": any;
  "reason": string;
  "status": string;
  "developerResponse"?: string;
  "id"?: any;
  "createdOn": Date;
  "updatedOn": Date;
  "deletedAt"?: Date;
  "isDeleted": boolean;
  package?: Package;
  account?: Account;
  linkedAccount?: Account;
  purchase?: PackagePurchase;
}

export class PackageRefundRequest implements PackageRefundRequestInterface {
  "accountId": any;
  "downloads": Array<any>;
  "packageId": any;
  "purchaseId": any;
  "reason": string;
  "status": string;
  "developerResponse": string;
  "id": any;
  "createdOn": Date;
  "updatedOn": Date;
  "deletedAt": Date;
  "isDeleted": boolean;
  package: Package;
  account: Account;
  linkedAccount: Account;
  purchase: PackagePurchase;
  constructor(data?: PackageRefundRequestInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `PackageRefundRequest`.
   */
  public static getModelName() {
    return "PackageRefundRequest";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of PackageRefundRequest for dynamic purposes.
  **/
  public static factory(data: PackageRefundRequestInterface): PackageRefundRequest{
    return new PackageRefundRequest(data);
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
      name: 'PackageRefundRequest',
      plural: 'PackageRefundRequests',
      path: 'PackageRefundRequests',
      idName: 'id',
      properties: {
        "accountId": {
          name: 'accountId',
          type: 'any'
        },
        "downloads": {
          name: 'downloads',
          type: 'Array&lt;any&gt;'
        },
        "packageId": {
          name: 'packageId',
          type: 'any'
        },
        "purchaseId": {
          name: 'purchaseId',
          type: 'any'
        },
        "reason": {
          name: 'reason',
          type: 'string'
        },
        "status": {
          name: 'status',
          type: 'string',
          default: 'pending'
        },
        "developerResponse": {
          name: 'developerResponse',
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
        package: {
          name: 'package',
          type: 'Package',
          model: 'Package',
          relationType: 'belongsTo',
                  keyFrom: 'packageId',
          keyTo: 'id'
        },
        account: {
          name: 'account',
          type: 'Account',
          model: 'Account',
          relationType: 'belongsTo',
                  keyFrom: 'accountId',
          keyTo: 'id'
        },
        linkedAccount: {
          name: 'linkedAccount',
          type: 'Account',
          model: 'Account',
          relationType: 'belongsTo',
                  keyFrom: 'accountId',
          keyTo: 'id'
        },
        purchase: {
          name: 'purchase',
          type: 'PackagePurchase',
          model: 'PackagePurchase',
          relationType: 'belongsTo',
                  keyFrom: 'purchaseId',
          keyTo: 'id'
        },
      }
    }
  }
}
