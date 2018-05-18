


export class PackageGiftLink {
  "packageId";
  "accountId";
  "extraInfo";
  "id";
  account;
  package;
  constructor(data) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `PackageGiftLink`.
   */
  static getModelName() {
    return "PackageGiftLink";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of PackageGiftLink for dynamic purposes.
  **/
  static factory(data) {
    return new PackageGiftLink(data);
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
      name: 'PackageGiftLink',
      plural: 'PackageGiftLinks',
      path: 'PackageGiftLinks',
      properties: {
        "packageId": {
          name: 'packageId',
          type: 'any'
        },
        "accountId": {
          name: 'accountId',
          type: 'any'
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
