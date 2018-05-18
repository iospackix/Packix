/* tslint:disable */
import {
  Account
} from '../index';

declare var Object: any;
export interface DeveloperInfoInterface {
  "accountId": any;
  "facebookPageUrl"?: string;
  "twitterHandle"?: string;
  "name"?: string;
  "email"?: string;
  "websiteUrl"?: string;
  "donationPayPalUrl"?: string;
  "patreonUrl"?: string;
  "profileImageUrl"?: string;
  "id"?: any;
  "deletedAt"?: Date;
  "isDeleted": boolean;
  account?: Account;
}

export class DeveloperInfo implements DeveloperInfoInterface {
  "accountId": any;
  "facebookPageUrl": string;
  "twitterHandle": string;
  "name": string;
  "email": string;
  "websiteUrl": string;
  "donationPayPalUrl": string;
  "patreonUrl": string;
  "profileImageUrl": string;
  "id": any;
  "deletedAt": Date;
  "isDeleted": boolean;
  account: Account;
  constructor(data?: DeveloperInfoInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `DeveloperInfo`.
   */
  public static getModelName() {
    return "DeveloperInfo";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of DeveloperInfo for dynamic purposes.
  **/
  public static factory(data: DeveloperInfoInterface): DeveloperInfo{
    return new DeveloperInfo(data);
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
      name: 'DeveloperInfo',
      plural: 'DeveloperInfo',
      path: 'DeveloperInfo',
      idName: 'id',
      properties: {
        "accountId": {
          name: 'accountId',
          type: 'any'
        },
        "facebookPageUrl": {
          name: 'facebookPageUrl',
          type: 'string',
          default: ''
        },
        "twitterHandle": {
          name: 'twitterHandle',
          type: 'string',
          default: ''
        },
        "name": {
          name: 'name',
          type: 'string',
          default: ''
        },
        "email": {
          name: 'email',
          type: 'string',
          default: ''
        },
        "websiteUrl": {
          name: 'websiteUrl',
          type: 'string',
          default: ''
        },
        "donationPayPalUrl": {
          name: 'donationPayPalUrl',
          type: 'string',
          default: ''
        },
        "patreonUrl": {
          name: 'patreonUrl',
          type: 'string',
          default: ''
        },
        "profileImageUrl": {
          name: 'profileImageUrl',
          type: 'string',
          default: ''
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
