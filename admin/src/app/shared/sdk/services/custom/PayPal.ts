/* tslint:disable */
import { Injectable, Inject, Optional } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { SDKModels } from './SDKModels';
import { BaseLoopBackApi } from '../core/base.service';
import { LoopBackConfig } from '../../lb.config';
import { LoopBackAuth } from '../core/auth.service';
import { LoopBackFilter,  } from '../../models/BaseModels';
import { ErrorHandler } from '../core/error.service';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';
import { PayPal } from '../../models/PayPal';
import { SocketConnection } from '../../sockets/socket.connections';


/**
 * Api services for the `PayPal` model.
 */
@Injectable()
export class PayPalApi extends BaseLoopBackApi {

  constructor(
    @Inject(HttpClient) protected http: HttpClient,
    @Inject(SocketConnection) protected connection: SocketConnection,
    @Inject(SDKModels) protected models: SDKModels,
    @Inject(LoopBackAuth) protected auth: LoopBackAuth,
    @Optional() @Inject(ErrorHandler) protected errorHandler: ErrorHandler
  ) {
    super(http,  connection,  models, auth, errorHandler);
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
  public handleIPN(req: any = {}, res: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "POST";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/PayPal/ipn";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
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
  public handlePaymentSuccess(req: any = {}, res: any = {}, paymentId: any, PayerID: any, purchaseId: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/PayPal/handlePaymentSuccess/:purchaseId";
    let _routeParams: any = {
      purchaseId: purchaseId
    };
    let _postBody: any = {};
    let _urlParams: any = {};
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
  public handlePaymentFailure(req: any = {}, res: any = {}, paymentId: any, PayerID: any, purchaseId: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/PayPal/handlePaymentFailure/:purchaseId";
    let _routeParams: any = {
      purchaseId: purchaseId
    };
    let _postBody: any = {};
    let _urlParams: any = {};
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
  public executePayment(req: any = {}, res: any = {}, paymentID: any, payerID: any, customHeaders?: Function): Observable<any> {
    let _method: string = "POST";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/PayPal/executePayment";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof paymentID !== 'undefined' && paymentID !== null) _urlParams.paymentID = paymentID;
    if (typeof payerID !== 'undefined' && payerID !== null) _urlParams.payerID = payerID;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * The name of the model represented by this $resource,
   * i.e. `PayPal`.
   */
  public getModelName() {
    return "PayPal";
  }
}
