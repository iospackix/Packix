
import {
  Account
} from '../index';


export class DeveloperInfo {
  "accountId";
  "facebookPageUrl";
  "twitterHandle";
  "name";
  "email";
  "websiteUrl";
  "donationPayPalUrl";
  "patreonUrl";
  "profileImageUrl";
  "id";
  account;
  constructor(data) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `DeveloperInfo`.
   */
  static getModelName() {
    return "DeveloperInfo";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of DeveloperInfo for dynamic purposes.
  **/
  static factory(data) {
    return new DeveloperInfo(data);
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
      name: 'DeveloperInfo',
      plural: 'DeveloperInfo',
      path: 'DeveloperInfo',
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
