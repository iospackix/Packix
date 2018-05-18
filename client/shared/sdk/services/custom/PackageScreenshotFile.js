/* tslint:disable */
import { SDKModels } from './SDKModels';
import { BaseLoopBackApi } from '../core/base.service';
import { LoopBackConfig } from '../../lb.config';
import { LoopBackFilter,  } from '../../models/BaseModels';
import { JSONSearchParams } from '../core/search.params';
import { ErrorHandler } from '../core/error.service';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';
import { PackageScreenshotFile } from '../../models/PackageScreenshotFile';
import { PackageScreenshot } from '../../models/PackageScreenshot';


/**
 * Api services for the `PackageScreenshotFile` model.
 */

export class PackageScreenshotFileApi extends BaseLoopBackApi {

  constructor(
     
  ) {
    
    super();
    
  }

  /**
   * Fetches belongsTo relation screenshot.
   *
   * @param {any} id PackageScreenshotFile id
   *
   * @param {boolean} refresh 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `PackageScreenshotFile` object.)
   * </em>
   */
   getScreenshot(id, refresh, customHeaders) {
    
    let _method = "GET";
    let _url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/PackageScreenshotFiles/:id/screenshot";
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
   * The name of the model represented by this $resource,
   * i.e. `PackageScreenshotFile`.
   */
  getModelName() {
    return "PackageScreenshotFile";
  }
}

