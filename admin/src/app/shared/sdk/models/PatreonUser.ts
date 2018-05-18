/* tslint:disable */
import {
  Account
} from '../index';

declare var Object: any;
export interface PatreonUserInterface {
  "name"?: string;
  "patreonId"?: string;
  "email"?: string;
  "pledgeAmount"?: number;
  "historicalPledgeAmount"?: number;
  "isDeclined"?: boolean;
  "pledgePaused"?: boolean;
  "accountId"?: any;
  "id"?: any;
  account?: Account;
}

export class PatreonUser implements PatreonUserInterface {
  "name": string;
  "patreonId": string;
  "email": string;
  "pledgeAmount": number;
  "historicalPledgeAmount": number;
  "isDeclined": boolean;
  "pledgePaused": boolean;
  "accountId": any;
  "id": any;
  account: Account;
  constructor(data?: PatreonUserInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `PatreonUser`.
   */
  public static getModelName() {
    return "PatreonUser";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of PatreonUser for dynamic purposes.
  **/
  public static factory(data: PatreonUserInterface): PatreonUser{
    return new PatreonUser(data);
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
      name: 'PatreonUser',
      plural: 'PatreonUsers',
      path: 'PatreonUsers',
      idName: 'id',
      properties: {
        "name": {
          name: 'name',
          type: 'string'
        },
        "patreonId": {
          name: 'patreonId',
          type: 'string'
        },
        "email": {
          name: 'email',
          type: 'string'
        },
        "pledgeAmount": {
          name: 'pledgeAmount',
          type: 'number'
        },
        "historicalPledgeAmount": {
          name: 'historicalPledgeAmount',
          type: 'number',
          default: 0
        },
        "isDeclined": {
          name: 'isDeclined',
          type: 'boolean',
          default: false
        },
        "pledgePaused": {
          name: 'pledgePaused',
          type: 'boolean',
          default: false
        },
        "accountId": {
          name: 'accountId',
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
      }
    }
  }
}
