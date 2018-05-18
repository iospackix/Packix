/* tslint:disable */
import { SDKModels } from './SDKModels';
import { BaseLoopBackApi } from '../core/base.service';
import { LoopBackConfig } from '../../lb.config';
import { LoopBackFilter,  } from '../../models/BaseModels';
import { JSONSearchParams } from '../core/search.params';
import { ErrorHandler } from '../core/error.service';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';
import { DeveloperPreferences } from '../../models/DeveloperPreferences';
import { Account } from '../../models/Account';


/**
 * Api services for the `DeveloperPreferences` model.
 */

export class DeveloperPreferencesApi extends BaseLoopBackApi {

  constructor(
     
  ) {
    
    super();
    
  }

  /**
   * Fetches belongsTo relation account.
   *
   * @param {any} id DeveloperPreferences id
   *
   * @param {boolean} refresh 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `DeveloperPreferences` object.)
   * </em>
   */
   getAccount(id, refresh, customHeaders) {
    
    let _method = "GET";
    let _url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/DevelopersPreferences/:id/account";
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
   * Gets the Current Repository Settings
   *
   * @param {object} req 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `DeveloperPreferences` object.)
   * </em>
   */
   getSettings(req, customHeaders) {
    
    let _method = "GET";
    let _url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/DevelopersPreferences/getSettings";
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
   * This usually means the response is a `DeveloperPreferences` object.)
   * </em>
   */
   updateSettings(settingsUpdate, req, customHeaders) {
    
    let _method = "POST";
    let _url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/DevelopersPreferences/updateSettings";
    let _routeParams = {};
    let _postBody = {};
    let _urlParams = {};
    
    
    if (typeof settingsUpdate !== 'undefined' && settingsUpdate !== null) _urlParams.settingsUpdate = settingsUpdate;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }



  /**
   * The name of the model represented by this $resource,
   * i.e. `DeveloperPreferences`.
   */
  getModelName() {
    return "DeveloperPreferences";
  }
}

