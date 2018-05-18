/* tslint:disable */
import {
  Account,
  AccountGroup
} from '../index';

declare var Object: any;
export interface AccountGroupLinkInterface {
  "accountId": any;
  "accountGroupId": any;
  "id"?: any;
  account?: Account;
  group?: AccountGroup;
}

export class AccountGroupLink implements AccountGroupLinkInterface {
  "accountId": any;
  "accountGroupId": any;
  "id": any;
  account: Account;
  group: AccountGroup;
  constructor(data?: AccountGroupLinkInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `AccountGroupLink`.
   */
  public static getModelName() {
    return "AccountGroupLink";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of AccountGroupLink for dynamic purposes.
  **/
  public static factory(data: AccountGroupLinkInterface): AccountGroupLink{
    return new AccountGroupLink(data);
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
      name: 'AccountGroupLink',
      plural: 'AccountGroupLinks',
      path: 'AccountGroupLinks',
      idName: 'id',
      properties: {
        "accountId": {
          name: 'accountId',
          type: 'any'
        },
        "accountGroupId": {
          name: 'accountGroupId',
          type: 'any'
        },
        "id": {
          name: 'id',
          type: 'any'
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
        group: {
          name: 'group',
          type: 'AccountGroup',
          model: 'AccountGroup',
          relationType: 'belongsTo',
                  keyFrom: 'accountGroupId',
          keyTo: 'id'
        },
      }
    }
  }
}
