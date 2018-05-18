
import {
  Account
} from '../index';


export class AccountGroup {
  "name";
  "description";
  "packageAccessType";
  "packageAccessTypeDescription";
  "accountId";
  "id";
  "createdOn";
  "updatedOn";
  account;
  accounts;
  constructor(data) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `AccountGroup`.
   */
  static getModelName() {
    return "AccountGroup";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of AccountGroup for dynamic purposes.
  **/
  static factory(data) {
    return new AccountGroup(data);
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
      name: 'AccountGroup',
      plural: 'AccountGroups',
      path: 'AccountGroups',
      properties: {
        "name": {
          name: 'name',
          type: 'string'
        },
        "description": {
          name: 'description',
          type: 'string'
        },
        "packageAccessType": {
          name: 'packageAccessType',
          type: 'number',
          default: 0
        },
        "packageAccessTypeDescription": {
          name: 'packageAccessTypeDescription',
          type: 'string'
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
          type: 'Account',
          model: 'Account'
        },
        accounts: {
          name: 'accounts',
          type: 'Account[]',
          model: 'Account'
        },
      }
    }
  }
}
