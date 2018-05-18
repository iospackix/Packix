/* tslint:disable */
import { SDKModels } from './SDKModels';
import { BaseLoopBackApi } from '../core/base.service';
import { LoopBackConfig } from '../../lb.config';
import { LoopBackFilter,  } from '../../models/BaseModels';
import { JSONSearchParams } from '../core/search.params';
import { ErrorHandler } from '../core/error.service';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';
import { AccountGroup } from '../../models/AccountGroup';
import { Account } from '../../models/Account';
import { AccountGroupLink } from '../../models/AccountGroupLink';


/**
 * Api services for the `AccountGroup` model.
 */

export class AccountGroupApi extends BaseLoopBackApi {

  constructor(
     
  ) {
    
    super();
    
  }

  /**
   * Fetches belongsTo relation account.
   *
   * @param {any} id AccountGroup id
   *
   * @param {boolean} refresh 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `AccountGroup` object.)
   * </em>
   */
   getAccount(id, refresh, customHeaders) {
    
    let _method = "GET";
    let _url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/AccountGroups/:id/account";
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
   * Add a related item by id for accounts.
   *
   * @param {any} id AccountGroup id
   *
   * @param {any} fk Foreign key for accounts
   *
   * @param {object} data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `AccountGroup` object.)
   * </em>
   */
   linkAccounts(id, fk, data, customHeaders) {
    
    let _method = "PUT";
    let _url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/AccountGroups/:id/accounts/rel/:fk";
    let _routeParams = {
      id: id,
      fk: fk
    };
    let _postBody = {
      data: data
    };
    let _urlParams = {};
    
    
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * Remove the accounts relation to an item by id.
   *
   * @param {any} id AccountGroup id
   *
   * @param {any} fk Foreign key for accounts
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * This method returns no data.
   */
   unlinkAccounts(id, fk, customHeaders) {
    
    let _method = "DELETE";
    let _url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/AccountGroups/:id/accounts/rel/:fk";
    let _routeParams = {
      id: id,
      fk: fk
    };
    let _postBody = {};
    let _urlParams = {};
    
    
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * Check the existence of accounts relation to an item by id.
   *
   * @param {any} id AccountGroup id
   *
   * @param {any} fk Foreign key for accounts
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `AccountGroup` object.)
   * </em>
   */
   existsAccounts(id, fk, customHeaders) {
    
    let _method = "HEAD";
    let _url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/AccountGroups/:id/accounts/rel/:fk";
    let _routeParams = {
      id: id,
      fk: fk
    };
    let _postBody = {};
    let _urlParams = {};
    
    
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * Patch attributes for a model instance and persist it into the data source.
   *
   * @param {any} id AccountGroup id
   *
   * @param {object} data Request data.
   *
   *  - `data` – `{object}` - An object of model property name/value pairs
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `AccountGroup` object.)
   * </em>
   */
   patchAttributes(id, data, customHeaders) {
    
    let _method = "PATCH";
    let _url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/AccountGroups/:id";
    let _routeParams = {
      id: id
    };
    let _postBody = {
      data: data
    };
    let _urlParams = {};
    
    
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }



  /**
   * The name of the model represented by this $resource,
   * i.e. `AccountGroup`.
   */
  getModelName() {
    return "AccountGroup";
  }
}

