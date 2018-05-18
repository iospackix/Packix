/* tslint:disable */

declare var Object: any;
export interface DeviceLinkNonceInterface {
  "ip"?: string;
  "accountId"?: any;
  "deviceModel"?: string;
  "id"?: any;
  account?: any;
}

export class DeviceLinkNonce implements DeviceLinkNonceInterface {
  "ip": string;
  "accountId": any;
  "deviceModel": string;
  "id": any;
  account: any;
  constructor(data?: DeviceLinkNonceInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `DeviceLinkNonce`.
   */
  public static getModelName() {
    return "DeviceLinkNonce";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of DeviceLinkNonce for dynamic purposes.
  **/
  public static factory(data: DeviceLinkNonceInterface): DeviceLinkNonce{
    return new DeviceLinkNonce(data);
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
      name: 'DeviceLinkNonce',
      plural: 'DeviceLinkNonces',
      path: 'DeviceLinkNonces',
      idName: 'id',
      properties: {
        "ip": {
          name: 'ip',
          type: 'string'
        },
        "accountId": {
          name: 'accountId',
          type: 'any'
        },
        "deviceModel": {
          name: 'deviceModel',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'any'
        },
      },
      relations: {
        account: {
          name: 'account',
          type: 'any',
          model: '',
          relationType: 'belongsTo',
                  keyFrom: 'accountId',
          keyTo: 'id'
        },
      }
    }
  }
}
