
import {
  Package,
  AccountGroup,
  PackageGiftLink
} from '../index';


export class Account {
  "profileName";
  "profilePhoto";
  "profileEmail";
  "cydiaId";
  "realm";
  "username";
  "email";
  "emailVerified";
  "id";
  "createdOn";
  "updatedOn";
  "password";
  devices;
  accessTokens;
  credentials;
  identities;
  packages;
  packagePurchases;
  groups;
  packageGifts;
  constructor(data) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Account`.
   */
  static getModelName() {
    return "Account";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Account for dynamic purposes.
  **/
  static factory(data) {
    return new Account(data);
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
      name: 'Account',
      plural: 'Accounts',
      path: 'Accounts',
      properties: {
        "profileName": {
          name: 'profileName',
          type: 'string'
        },
        "profilePhoto": {
          name: 'profilePhoto',
          type: 'string'
        },
        "profileEmail": {
          name: 'profileEmail',
          type: 'string'
        },
        "cydiaId": {
          name: 'cydiaId',
          type: 'string'
        },
        "realm": {
          name: 'realm',
          type: 'string'
        },
        "username": {
          name: 'username',
          type: 'string'
        },
        "email": {
          name: 'email',
          type: 'string'
        },
        "emailVerified": {
          name: 'emailVerified',
          type: 'boolean'
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
        "password": {
          name: 'password',
          type: 'string'
        },
      },
      relations: {
        devices: {
          name: 'devices',
          type: 'any[]',
          model: ''
        },
        accessTokens: {
          name: 'accessTokens',
          type: 'any[]',
          model: ''
        },
        credentials: {
          name: 'credentials',
          type: 'any[]',
          model: ''
        },
        identities: {
          name: 'identities',
          type: 'any[]',
          model: ''
        },
        packages: {
          name: 'packages',
          type: 'Package[]',
          model: 'Package'
        },
        packagePurchases: {
          name: 'packagePurchases',
          type: 'any[]',
          model: ''
        },
        groups: {
          name: 'groups',
          type: 'AccountGroup[]',
          model: 'AccountGroup'
        },
        packageGifts: {
          name: 'packageGifts',
          type: 'PackageGiftLink[]',
          model: 'PackageGiftLink'
        },
      }
    }
  }
}
