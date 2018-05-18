/* tslint:disable */
import { SDKModels } from './SDKModels';
import { BaseLoopBackApi } from '../core/base.service';
import { LoopBackConfig } from '../../lb.config';
import { LoopBackFilter,  } from '../../models/BaseModels';
import { JSONSearchParams } from '../core/search.params';
import { ErrorHandler } from '../core/error.service';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';
import { PackageDownload } from '../../models/PackageDownload';
import { PackageVersion } from '../../models/PackageVersion';
import { Package } from '../../models/Package';


/**
 * Api services for the `PackageDownload` model.
 */

export class PackageDownloadApi extends BaseLoopBackApi {

  constructor(
     
  ) {
    
    super();
    
  }

  /**
   * Fetches belongsTo relation packageVersion.
   *
   * @param {any} id PackageDownload id
   *
   * @param {boolean} refresh 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `PackageDownload` object.)
   * </em>
   */
   getPackageVersion(id, refresh, customHeaders) {
    
    let _method = "GET";
    let _url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/PackageDownloads/:id/packageVersion";
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
   * Fetches belongsTo relation package.
   *
   * @param {any} id PackageDownload id
   *
   * @param {boolean} refresh 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `PackageDownload` object.)
   * </em>
   */
   getPackage(id, refresh, customHeaders) {
    
    let _method = "GET";
    let _url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/PackageDownloads/:id/package";
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
   * @param {any} id PackageDownload id
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
   * This usually means the response is a `PackageDownload` object.)
   * </em>
   */
   patchAttributes(id, data, customHeaders) {
    
    let _method = "PATCH";
    let _url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/PackageDownloads/:id";
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
   * A Description for Loopback Explorer
   *
   * @param {string} range hourly, daily, weekly, monthly, yearly, custom
   *
   * @param {object} custom {"start": date, "end": date }
   *
   * @param {object} where where filter 
   *
   * @param {string} groupBy group by filter 
   *
   * @returns {object[]} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `PackageDownload` object.)
   * </em>
   */
   stats(range, custom, where, groupBy, customHeaders) {
    
    let _method = "GET";
    let _url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/PackageDownloads/stats";
    let _routeParams = {};
    let _postBody = {};
    let _urlParams = {};
    
    
    if (typeof range !== 'undefined' && range !== null) _urlParams.range = range;
    if (typeof custom !== 'undefined' && custom !== null) _urlParams.custom = custom;
    if (typeof where !== 'undefined' && where !== null) _urlParams.where = where;
    if (typeof groupBy !== 'undefined' && groupBy !== null) _urlParams.groupBy = groupBy;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }



  /**
   * The name of the model represented by this $resource,
   * i.e. `PackageDownload`.
   */
  getModelName() {
    return "PackageDownload";
  }
}

