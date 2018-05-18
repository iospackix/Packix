/* tslint:disable */
import {
  Account
} from '../index';

declare var Object: any;
export interface AccountGroupInterface {
  "name": string;
  "description": string;
  "packageAccessType": number;
  "packageAccessTypeDescription"?: string;
  "accountId": any;
  "id"?: any;
  "createdOn": Date;
  "updatedOn": Date;
  account?: Account;
  accounts?: Account[];
}

export class AccountGroup implements AccountGroupInterface {
  "name": string;
  "description": string;
  "packageAccessType": number;
  "packageAccessTypeDescription": string;
  "accountId": any;
  "id": any;
  "createdOn": Date;
  "updatedOn": Date;
  account: Account;
  accounts: Account[];
  constructor(data?: AccountGroupInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `AccountGroup`.
   */
  public static getModelName() {
    return "AccountGroup";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of AccountGroup for dynamic purposes.
  **/
  public static factory(data: AccountGroupInterface): AccountGroup{
    return new AccountGroup(data);
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
      name: 'AccountGroup',
      plural: 'AccountGroups',
      path: 'AccountGroups',
      idName: 'id',
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
          model: 'Account',
          relationType: 'belongsTo',
                  keyFrom: 'accountId',
          keyTo: 'id'
        },
        accounts: {
          name: 'accounts',
          type: 'Account[]',
          model: 'Account',
          relationType: 'hasMany',
          modelThrough: 'AccountGroupLink',
          keyThrough: 'accountId',
          keyFrom: 'id',
          keyTo: 'accountGroupId'
        },
      }
    }
  }
}
