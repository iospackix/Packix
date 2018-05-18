


export class PackageDownloadRestriction {
  "type";
  "data";
  "packageId";
  "accountId";
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
   * i.e. `PackageDownloadRestriction`.
   */
  static getModelName() {
    return "PackageDownloadRestriction";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of PackageDownloadRestriction for dynamic purposes.
  **/
  static factory(data) {
    return new PackageDownloadRestriction(data);
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
      name: 'PackageDownloadRestriction',
      plural: 'PackageDownloadRestrictions',
      path: 'PackageDownloadRestrictions',
      properties: {
        "type": {
          name: 'type',
          type: 'string'
        },
        "data": {
          name: 'data',
          type: 'any'
        },
        "packageId": {
          name: 'packageId',
          type: 'any'
        },
        "accountId": {
          name: 'accountId',
          type: 'any'
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
