
import {
  Account
} from '../index';


export class DeveloperPreferences {
  "usePaypal";
  "paypalClientId";
  "paypalClientSecret";
  "usePatreon";
  "patreonAccessToken";
  "patreonRefreshToken";
  "accountId";
  "paypalEmail";
  "cydiaVendorId";
  "cydiaVendorSecret";
  "useCydiaStore";
  "id";
  account;
  constructor(data) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `DeveloperPreferences`.
   */
  static getModelName() {
    return "DeveloperPreferences";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of DeveloperPreferences for dynamic purposes.
  **/
  static factory(data) {
    return new DeveloperPreferences(data);
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
      name: 'DeveloperPreferences',
      plural: 'DevelopersPreferences',
      path: 'DevelopersPreferences',
      properties: {
        "usePaypal": {
          name: 'usePaypal',
          type: 'boolean',
          default: false
        },
        "paypalClientId": {
          name: 'paypalClientId',
          type: 'string'
        },
        "paypalClientSecret": {
          name: 'paypalClientSecret',
          type: 'string'
        },
        "usePatreon": {
          name: 'usePatreon',
          type: 'boolean',
          default: false
        },
        "patreonAccessToken": {
          name: 'patreonAccessToken',
          type: 'string'
        },
        "patreonRefreshToken": {
          name: 'patreonRefreshToken',
          type: 'string'
        },
        "accountId": {
          name: 'accountId',
          type: 'any'
        },
        "paypalEmail": {
          name: 'paypalEmail',
          type: 'string'
        },
        "cydiaVendorId": {
          name: 'cydiaVendorId',
          type: 'string',
          default: ''
        },
        "cydiaVendorSecret": {
          name: 'cydiaVendorSecret',
          type: 'string',
          default: ''
        },
        "useCydiaStore": {
          name: 'useCydiaStore',
          type: 'boolean',
          default: false
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
      }
    }
  }
}
