/* tslint:disable */
import { SDKModels } from './SDKModels';
import { BaseLoopBackApi } from '../core/base.service';
import { LoopBackConfig } from '../../lb.config';
import { LoopBackFilter,  } from '../../models/BaseModels';
import { JSONSearchParams } from '../core/search.params';
import { ErrorHandler } from '../core/error.service';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';
import { PackageRefundRequest } from '../../models/PackageRefundRequest';
import { Package } from '../../models/Package';
import { Account } from '../../models/Account';
import { PackagePurchase } from '../../models/PackagePurchase';


/**
 * Api services for the `PackageRefundRequest` model.
 */

export class PackageRefundRequestApi extends BaseLoopBackApi {

  constructor(
     
  ) {
    
    super();
    
  }

  /**
   * Fetches belongsTo relation package.
   *
   * @param {any} id PackageRefundRequest id
   *
   * @param {boolean} refresh 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `PackageRefundRequest` object.)
   * </em>
   */
   getPackage(id, refresh, customHeaders) {
    
    let _method = "GET";
    let _url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/PackageRefundRequests/:id/package";
    let _routeParams = {
      id: id
    };
    let _postBody = {};
    let _urlParams = {};
    
    
    if (typeof refresh !== 'undefined' && refresh !== null) _urlParams.refresh = refresh;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * Fetches belongsTo relation account.
   *
   * @param {any} id PackageRefundRequest id
   *
   * @param {boolean} refresh 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `PackageRefundRequest` object.)
   * </em>
   */
   getAccount(id, refresh, customHeaders) {
    
    let _method = "GET";
    let _url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/PackageRefundRequests/:id/account";
    let _routeParams = {
      id: id
    };
    let _postBody = {};
    let _urlParams = {};
    
    
    if (typeof refresh !== 'undefined' && refresh !== null) _urlParams.refresh = refresh;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * Fetches belongsTo relation purchase.
   *
   * @param {any} id PackageRefundRequest id
   *
   * @param {boolean} refresh 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `PackageRefundRequest` object.)
   * </em>
   */
   getPurchase(id, refresh, customHeaders) {
    
    let _method = "GET";
    let _url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/PackageRefundRequests/:id/purchase";
    let _routeParams = {
      id: id
    };
    let _postBody = {};
    let _urlParams = {};
    
    
    if (typeof refresh !== 'undefined' && refresh !== null) _urlParams.refresh = refresh;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * <em>
         * (The remote method definition does not provide any description.)
         * </em>
   *
   * @param {any} id PackageRefundRequest id
   *
   * @param {object} data Request data.
   *
   * This method does not accept any data. Supply an empty object.
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * This method returns no data.
   */
   accept(id, customHeaders) {
    
    let _method = "POST";
    let _url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/PackageRefundRequests/:id/accept";
    let _routeParams = {
      id: id
    };
    let _postBody = {};
    let _urlParams = {};
    
    
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * <em>
         * (The remote method definition does not provide any description.)
         * </em>
   *
   * @param {any} id PackageRefundRequest id
   *
   * @param {object} data Request data.
   *
   *  - `reason` – `{string}` - 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * This method returns no data.
   */
   decline(id, reason, customHeaders) {
    
    let _method = "POST";
    let _url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/PackageRefundRequests/:id/decline";
    let _routeParams = {
      id: id
    };
    let _postBody = {};
    let _urlParams = {};
    
    
    if (typeof reason !== 'undefined' && reason !== null) _urlParams.reason = reason;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }



  /**
   * The name of the model represented by this $resource,
   * i.e. `PackageRefundRequest`.
   */
  getModelName() {
    return "PackageRefundRequest";
  }
}

