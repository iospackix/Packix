/* tslint:disable */

declare var Object: any;
export interface PayPalInterface {
  "id"?: number;
}

export class PayPal implements PayPalInterface {
  "id": number;
  constructor(data?: PayPalInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `PayPal`.
   */
  public static getModelName() {
    return "PayPal";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of PayPal for dynamic purposes.
  **/
  public static factory(data: PayPalInterface): PayPal{
    return new PayPal(data);
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
      name: 'PayPal',
      plural: 'PayPal',
      path: 'PayPal',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
