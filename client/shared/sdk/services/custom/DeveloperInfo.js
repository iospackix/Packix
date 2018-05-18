/* tslint:disable */
import { SDKModels } from './SDKModels';
import { BaseLoopBackApi } from '../core/base.service';
import { LoopBackConfig } from '../../lb.config';
import { LoopBackFilter,  } from '../../models/BaseModels';
import { JSONSearchParams } from '../core/search.params';
import { ErrorHandler } from '../core/error.service';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';
import { DeveloperInfo } from '../../models/DeveloperInfo';
import { Account } from '../../models/Account';


/**
 * Api services for the `DeveloperInfo` model.
 */

export class DeveloperInfoApi extends BaseLoopBackApi {

  constructor(
     
  ) {
    
    super();
    
  }

  /**
   * Fetches belongsTo relation account.
   *
   * @param {any} id DeveloperInfo id
   *
   * @param {boolean} refresh 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `DeveloperInfo` object.)
   * </em>
   */
   getAccount(id, refresh, customHeaders) {
    
    let _method = "GET";
    let _url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/DeveloperInfo/:id/account";
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
   * Patch attributes for a model instance and persist it into the data source.
   *
   * @param {any} id DeveloperInfo id
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
   * This usually means the response is a `DeveloperInfo` object.)
   * </em>
   */
   patchAttributes(id, data, customHeaders) {
    
    let _method = "PATCH";
    let _url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/DeveloperInfo/:id";
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
   * Gets the Current Developer Info
   *
   * @param {object} req 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `DeveloperInfo` object.)
   * </em>
   */
   getSettings(req, customHeaders) {
    
    let _method = "GET";
    let _url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/DeveloperInfo/getSettings";
    let _routeParams = {};
    let _postBody = {};
    let _urlParams = {};
    
    
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * Get the Current Developer Info
   *
   * @param {object} data Request data.
   *
   *  - `settingsUpdate` – `{object}` - 
   *
   *  - `req` – `{object}` - 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `DeveloperInfo` object.)
   * </em>
   */
   updateSettings(settingsUpdate, req, customHeaders) {
    
    let _method = "POST";
    let _url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/DeveloperInfo/updateSettings";
    let _routeParams = {};
    let _postBody = {};
    let _urlParams = {};
    
    
    if (typeof settingsUpdate !== 'undefined' && settingsUpdate !== null) _urlParams.settingsUpdate = settingsUpdate;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }



  /**
   * The name of the model represented by this $resource,
   * i.e. `DeveloperInfo`.
   */
  getModelName() {
    return "DeveloperInfo";
  }
}

