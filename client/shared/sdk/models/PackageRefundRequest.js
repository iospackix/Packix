
import {
  Package,
  Account,
  PackagePurchase
} from '../index';


export class PackageRefundRequest {
  "accountId";
  "packageId";
  "purchaseId";
  "reason";
  "status";
  "developerResponse";
  "id";
  "createdOn";
  "updatedOn";
  package;
  account;
  purchase;
  constructor(data) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `PackageRefundRequest`.
   */
  static getModelName() {
    return "PackageRefundRequest";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of PackageRefundRequest for dynamic purposes.
  **/
  static factory(data) {
    return new PackageRefundRequest(data);
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
      name: 'PackageRefundRequest',
      plural: 'PackageRefundRequests',
      path: 'PackageRefundRequests',
      properties: {
        "accountId": {
          name: 'accountId',
          type: 'any'
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
      },
      relations: {
        package: {
          name: 'package',
          type: 'Package',
          model: 'Package'
        },
        account: {
          name: 'account',
          type: 'Account',
          model: 'Account'
        },
        purchase: {
          name: 'purchase',
          type: 'PackagePurchase',
          model: 'PackagePurchase'
        },
      }
    }
  }
}
