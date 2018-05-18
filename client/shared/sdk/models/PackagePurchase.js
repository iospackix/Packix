
import {
  Account,
  Package,
  PackageRefundRequest
} from '../index';


export class PackagePurchase {
  "saleId";
  "isComplete";
  "_json";
  "accountId";
  "amount";
  "fee";
  "currency";
  "amountPaid";
  "details";
  "status";
  "provider";
  "packageId";
  "id";
  "createdOn";
  "updatedOn";
  account;
  package;
  refundRequest;
  constructor(data) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `PackagePurchase`.
   */
  static getModelName() {
    return "PackagePurchase";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of PackagePurchase for dynamic purposes.
  **/
  static factory(data) {
    return new PackagePurchase(data);
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
      name: 'PackagePurchase',
      plural: 'PackagePurchases',
      path: 'PackagePurchases',
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
      },
      relations: {
        account: {
          name: 'account',
          type: 'Account',
          model: 'Account'
        },
        package: {
          name: 'package',
          type: 'Package',
          model: 'Package'
        },
        refundRequest: {
          name: 'refundRequest',
          type: 'PackageRefundRequest',
          model: 'PackageRefundRequest'
        },
      }
    }
  }
}
