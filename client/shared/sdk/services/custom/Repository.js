/* tslint:disable */
import { SDKModels } from './SDKModels';
import { BaseLoopBackApi } from '../core/base.service';
import { LoopBackConfig } from '../../lb.config';
import { LoopBackFilter,  } from '../../models/BaseModels';
import { JSONSearchParams } from '../core/search.params';
import { ErrorHandler } from '../core/error.service';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';
import { Repository } from '../../models/Repository';


/**
 * Api services for the `Repository` model.
 */

export class RepositoryApi extends BaseLoopBackApi {

  constructor(
     
  ) {
    
    super();
    
  }

  /**
   * Gets the Current Repository Settings
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Repository` object.)
   * </em>
   */
   getCurrentSettings(customHeaders) {
    
    let _method = "GET";
    let _url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/Repository/getSettings";
    let _routeParams = {};
    let _postBody = {};
    let _urlParams = {};
    
    
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * Update the Repository Settings
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
   * This usually means the response is a `Repository` object.)
   * </em>
   */
   updateSettings(settingsToUpdate, customHeaders) {
    
    let _method = "POST";
    let _url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/Repository/updateSettings";
    let _routeParams = {};
    let _postBody = {
      settingsToUpdate: settingsToUpdate
    };
    let _urlParams = {};
    
    
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * Get Patreon Reward Tiers
   *
   * @param {object} req 
   *
   * @returns {object[]} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Repository` object.)
   * </em>
   */
   getPatreonInfo(req, customHeaders) {
    
    let _method = "GET";
    let _url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/Repository/patreonInfo";
    let _routeParams = {};
    let _postBody = {};
    let _urlParams = {};
    
    
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * Make a user a developer
   *
   * @param {string} accountId 
   *
   * @param {object} data Request data.
   *
   *  - `req` – `{object}` - 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Repository` object.)
   * </em>
   */
   makeUserDeveloper(accountId, req, customHeaders) {
    
    let _method = "POST";
    let _url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/Repository/makeDeveloper";
    let _routeParams = {};
    let _postBody = {};
    let _urlParams = {};
    
    
    if (typeof accountId !== 'undefined' && accountId !== null) _urlParams.accountId = accountId;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * Revoke a user a developer
   *
   * @param {string} accountId 
   *
   * @param {object} data Request data.
   *
   *  - `req` – `{object}` - 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Repository` object.)
   * </em>
   */
   revokeUserDeveloper(accountId, req, customHeaders) {
    
    let _method = "POST";
    let _url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/Repository/revokeUserDeveloper";
    let _routeParams = {};
    let _postBody = {};
    let _urlParams = {};
    
    
    if (typeof accountId !== 'undefined' && accountId !== null) _urlParams.accountId = accountId;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }



  /**
   * The name of the model represented by this $resource,
   * i.e. `Repository`.
   */
  getModelName() {
    return "Repository";
  }
}

