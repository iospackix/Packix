/* tslint:disable */
import {
  Account,
  Package,
  PackageRefundRequest
} from '../index';

declare var Object: any;
export interface PackagePurchaseInterface {
  "saleId"?: string;
  "isComplete"?: boolean;
  "_json"?: any;
  "accountId"?: any;
  "amount"?: string;
  "fee"?: string;
  "currency"?: string;
  "amountPaid"?: string;
  "details"?: any;
  "status"?: string;
  "provider": string;
  "packageId"?: any;
  "id"?: any;
  "createdOn": Date;
  "updatedOn": Date;
  "deletedAt"?: Date;
  "isDeleted": boolean;
  account?: Account;
  package?: Package;
  refundRequest?: PackageRefundRequest;
}

export class PackagePurchase implements PackagePurchaseInterface {
  "saleId": string;
  "isComplete": boolean;
  "_json": any;
  "accountId": any;
  "amount": string;
  "fee": string;
  "currency": string;
  "amountPaid": string;
  "details": any;
  "status": string;
  "provider": string;
  "packageId": any;
  "id": any;
  "createdOn": Date;
  "updatedOn": Date;
  "deletedAt": Date;
  "isDeleted": boolean;
  account: Account;
  package: Package;
  refundRequest: PackageRefundRequest;
  constructor(data?: PackagePurchaseInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `PackagePurchase`.
   */
  public static getModelName() {
    return "PackagePurchase";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of PackagePurchase for dynamic purposes.
  **/
  public static factory(data: PackagePurchaseInterface): PackagePurchase{
    return new PackagePurchase(data);
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
      name: 'PackagePurchase',
      plural: 'PackagePurchases',
      path: 'PackagePurchases',
      idName: 'id',
      properties: {
        "saleId": {
          name: 'saleId',
          type: 'string'
        },
        "isComplete": {
          name: 'isComplete',
          type: 'boolean'
        },
        "_json": {
          name: '_json',
          type: 'any'
        },
        "accountId": {
          name: 'accountId',
          type: 'any'
        },
        "amount": {
          name: 'amount',
          type: 'string'
        },
        "fee": {
          name: 'fee',
          type: 'string'
        },
        "currency": {
          name: 'currency',
          type: 'string'
        },
        "amountPaid": {
          name: 'amountPaid',
          type: 'string'
        },
        "details": {
          name: 'details',
          type: 'any'
        },
        "status": {
          name: 'status',
          type: 'string',
          default: 'Unknown'
        },
        "provider": {
          name: 'provider',
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
        account: {
          name: 'account',
          type: 'Account',
          model: 'Account',
          relationType: 'belongsTo',
                  keyFrom: 'accountId',
          keyTo: 'id'
        },
        package: {
          name: 'package',
          type: 'Package',
          model: 'Package',
          relationType: 'belongsTo',
                  keyFrom: 'packageId',
          keyTo: 'id'
        },
        refundRequest: {
          name: 'refundRequest',
          type: 'PackageRefundRequest',
          model: 'PackageRefundRequest',
          relationType: 'hasOne',
                  keyFrom: 'id',
          keyTo: 'purchaseId'
        },
      }
    }
  }
}
