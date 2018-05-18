/* tslint:disable */
import {
  Package,
  AccountGroup,
  PackageGiftLink
} from '../index';

declare var Object: any;
export interface AccountInterface {
  "profileName"?: string;
  "profilePhoto"?: string;
  "profileEmail"?: string;
  "cydiaId"?: string;
  "realm"?: string;
  "username"?: string;
  "email": string;
  "emailVerified"?: boolean;
  "id"?: any;
  "createdOn": Date;
  "updatedOn": Date;
  "deletedAt"?: Date;
  "isDeleted": boolean;
  "password"?: string;
  devices?: any[];
  accessTokens?: any[];
  credentials?: any[];
  identities?: any[];
  packages?: Package[];
  packagePurchases?: any[];
  groups?: AccountGroup[];
  packageGifts?: PackageGiftLink[];
}

export class Account implements AccountInterface {
  "profileName": string;
  "profilePhoto": string;
  "profileEmail": string;
  "cydiaId": string;
  "realm": string;
  "username": string;
  "email": string;
  "emailVerified": boolean;
  "id": any;
  "createdOn": Date;
  "updatedOn": Date;
  "deletedAt": Date;
  "isDeleted": boolean;
  "password": string;
  devices: any[];
  accessTokens: any[];
  credentials: any[];
  identities: any[];
  packages: Package[];
  packagePurchases: any[];
  groups: AccountGroup[];
  packageGifts: PackageGiftLink[];
  constructor(data?: AccountInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Account`.
   */
  public static getModelName() {
    return "Account";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Account for dynamic purposes.
  **/
  public static factory(data: AccountInterface): Account{
    return new Account(data);
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
      name: 'Account',
      plural: 'Accounts',
      path: 'Accounts',
      idName: 'id',
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
        "deletedAt": {
          name: 'deletedAt',
          type: 'Date'
        },
        "isDeleted": {
          name: 'isDeleted',
          type: 'boolean',
          default: false
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
          model: '',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'accountId'
        },
        accessTokens: {
          name: 'accessTokens',
          type: 'any[]',
          model: '',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'userId'
        },
        credentials: {
          name: 'credentials',
          type: 'any[]',
          model: '',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'userId'
        },
        identities: {
          name: 'identities',
          type: 'any[]',
          model: '',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'userId'
        },
        packages: {
          name: 'packages',
          type: 'Package[]',
          model: 'Package',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'accountId'
        },
        packagePurchases: {
          name: 'packagePurchases',
          type: 'any[]',
          model: '',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'accountId'
        },
        groups: {
          name: 'groups',
          type: 'AccountGroup[]',
          model: 'AccountGroup',
          relationType: 'hasMany',
          modelThrough: 'AccountGroupLink',
          keyThrough: 'accountGroupId',
          keyFrom: 'id',
          keyTo: 'accountId'
        },
        packageGifts: {
          name: 'packageGifts',
          type: 'PackageGiftLink[]',
          model: 'PackageGiftLink',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'accountId'
        },
      }
    }
  }
}
