


export class PackageCouponCode {
  "type";
  "packageId";
  "isClaimed";
  "accountId";
  "claimIp";
  "validUntil";
  "usesLeft";
  "maxUseCount";
  "extraInfo";
  "id";
  "createdOn";
  "updatedOn";
  account;
  package;
  constructor(data) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `PackageCouponCode`.
   */
  static getModelName() {
    return "PackageCouponCode";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of PackageCouponCode for dynamic purposes.
  **/
  static factory(data) {
    return new PackageCouponCode(data);
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
      name: 'PackageCouponCode',
      plural: 'PackageCouponCodes',
      path: 'PackageCouponCodes',
      properties: {
        "type": {
          name: 'type',
          type: 'string',
          default: 'full'
        },
        "packageId": {
          name: 'packageId',
          type: 'any'
        },
        "isClaimed": {
          name: 'isClaimed',
          type: 'boolean',
          default: false
        },
        "accountId": {
          name: 'accountId',
          type: 'any'
        },
        "claimIp": {
          name: 'claimIp',
          type: 'string'
        },
        "validUntil": {
          name: 'validUntil',
          type: 'Date'
        },
        "usesLeft": {
          name: 'usesLeft',
          type: 'number'
        },
        "maxUseCount": {
          name: 'maxUseCount',
          type: 'number'
        },
        "extraInfo": {
          name: 'extraInfo',
          type: 'string',
          default: ''
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
      },
      relations: {
        account: {
          name: 'account',
          type: 'any',
          model: ''
        },
        package: {
          name: 'package',
          type: 'any',
          model: ''
        },
      }
    }
  }
}
