/* tslint:disable */
import {
  Account
} from '../index';

declare var Object: any;
export interface DeveloperPreferencesInterface {
  "usePaypal"?: boolean;
  "paypalClientId"?: string;
  "paypalClientSecret"?: string;
  "usePatreon"?: boolean;
  "patreonAccessToken"?: string;
  "patreonRefreshToken"?: string;
  "accountId": any;
  "paypalEmail"?: string;
  "cydiaVendorId"?: string;
  "cydiaVendorSecret"?: string;
  "useCydiaStore"?: boolean;
  "id"?: any;
  "deletedAt"?: Date;
  "isDeleted": boolean;
  account?: Account;
}

export class DeveloperPreferences implements DeveloperPreferencesInterface {
  "usePaypal": boolean;
  "paypalClientId": string;
  "paypalClientSecret": string;
  "usePatreon": boolean;
  "patreonAccessToken": string;
  "patreonRefreshToken": string;
  "accountId": any;
  "paypalEmail": string;
  "cydiaVendorId": string;
  "cydiaVendorSecret": string;
  "useCydiaStore": boolean;
  "id": any;
  "deletedAt": Date;
  "isDeleted": boolean;
  account: Account;
  constructor(data?: DeveloperPreferencesInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `DeveloperPreferences`.
   */
  public static getModelName() {
    return "DeveloperPreferences";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of DeveloperPreferences for dynamic purposes.
  **/
  public static factory(data: DeveloperPreferencesInterface): DeveloperPreferences{
    return new DeveloperPreferences(data);
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
      name: 'DeveloperPreferences',
      plural: 'DevelopersPreferences',
      path: 'DevelopersPreferences',
      idName: 'id',
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
      }
    }
  }
}
