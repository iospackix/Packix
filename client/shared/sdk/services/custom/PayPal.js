/* tslint:disable */
import { SDKModels } from './SDKModels';
import { BaseLoopBackApi } from '../core/base.service';
import { LoopBackConfig } from '../../lb.config';
import { LoopBackFilter,  } from '../../models/BaseModels';
import { JSONSearchParams } from '../core/search.params';
import { ErrorHandler } from '../core/error.service';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';
import { PayPal } from '../../models/PayPal';


/**
 * Api services for the `PayPal` model.
 */

export class PayPalApi extends BaseLoopBackApi {

  constructor(
     
  ) {
    
    super();
    
  }

  /**
   * Handles IPN Response from PayPal
   *
   * @param {object} data Request data.
   *
   *  - `req` – `{object}` - 
   *
   *  - `res` – `{object}` - 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * This method returns no data.
   */
   handleIPN(req, res, customHeaders) {
    
    let _method = "POST";
    let _url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/PayPal/ipn";
    let _routeParams = {};
    let _postBody = {};
    let _urlParams = {};
    
    
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * Handles IPN Response from PayPal
   *
   * @param {object} req 
   *
   * @param {object} res 
   *
   * @param {string} paymentId 
   *
   * @param {string} PayerID 
   *
   * @param {string} purchaseId 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * This method returns no data.
   */
   handlePaymentSuccess(req, res, paymentId, PayerID, purchaseId, customHeaders) {
    
    let _method = "GET";
    let _url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/PayPal/handlePaymentSuccess/:purchaseId";
    let _routeParams = {
      purchaseId: purchaseId
    };
    let _postBody = {};
    let _urlParams = {};
    
    
    if (typeof paymentId !== 'undefined' && paymentId !== null) _urlParams.paymentId = paymentId;
    if (typeof PayerID !== 'undefined' && PayerID !== null) _urlParams.PayerID = PayerID;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * Handles IPN Response from PayPal
   *
   * @param {object} req 
   *
   * @param {object} res 
   *
   * @param {string} paymentId 
   *
   * @param {string} PayerID 
   *
   * @param {string} purchaseId 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * This method returns no data.
   */
   handlePaymentFailure(req, res, paymentId, PayerID, purchaseId, customHeaders) {
    
    let _method = "GET";
    let _url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/PayPal/handlePaymentFailure/:purchaseId";
    let _routeParams = {
      purchaseId: purchaseId
    };
    let _postBody = {};
    let _urlParams = {};
    
    
    if (typeof paymentId !== 'undefined' && paymentId !== null) _urlParams.paymentId = paymentId;
    if (typeof PayerID !== 'undefined' && PayerID !== null) _urlParams.PayerID = PayerID;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * Executes Payment from PayPal
   *
   * @param {object} data Request data.
   *
   *  - `req` – `{object}` - 
   *
   *  - `res` – `{object}` - 
   *
   *  - `paymentID` – `{string}` - 
   *
   *  - `payerID` – `{string}` - 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * This method returns no data.
   */
   executePayment(req, res, paymentID, payerID, customHeaders) {
    
    let _method = "POST";
    let _url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/PayPal/executePayment";
    let _routeParams = {};
    let _postBody = {};
    let _urlParams = {};
    
    
    if (typeof paymentID !== 'undefined' && paymentID !== null) _urlParams.paymentID = paymentID;
    if (typeof payerID !== 'undefined' && payerID !== null) _urlParams.payerID = payerID;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }



  /**
   * The name of the model represented by this $resource,
   * i.e. `PayPal`.
   */
  getModelName() {
    return "PayPal";
  }
}

