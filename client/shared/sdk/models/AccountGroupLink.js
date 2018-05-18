
import {
  Account,
  AccountGroup
} from '../index';


export class AccountGroupLink {
  "accountId";
  "accountGroupId";
  "id";
  account;
  group;
  constructor(data) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `AccountGroupLink`.
   */
  static getModelName() {
    return "AccountGroupLink";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of AccountGroupLink for dynamic purposes.
  **/
  static factory(data) {
    return new AccountGroupLink(data);
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
      name: 'AccountGroupLink',
      plural: 'AccountGroupLinks',
      path: 'AccountGroupLinks',
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
          model: 'Account'
        },
        group: {
          name: 'group',
          type: 'AccountGroup',
          model: 'AccountGroup'
        },
      }
    }
  }
}
