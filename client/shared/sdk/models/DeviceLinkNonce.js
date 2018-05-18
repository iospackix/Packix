


export class DeviceLinkNonce {
  "ip";
  "accountId";
  "deviceModel";
  "id";
  account;
  constructor(data) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `DeviceLinkNonce`.
   */
  static getModelName() {
    return "DeviceLinkNonce";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of DeviceLinkNonce for dynamic purposes.
  **/
  static factory(data) {
    return new DeviceLinkNonce(data);
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
      name: 'DeviceLinkNonce',
      plural: 'DeviceLinkNonces',
      path: 'DeviceLinkNonces',
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
          model: ''
        },
      }
    }
  }
}
