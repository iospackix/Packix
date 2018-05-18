/* tslint:disable */
import { SDKModels } from './SDKModels';
import { BaseLoopBackApi } from '../core/base.service';
import { LoopBackConfig } from '../../lb.config';
import { LoopBackFilter,  } from '../../models/BaseModels';
import { JSONSearchParams } from '../core/search.params';
import { ErrorHandler } from '../core/error.service';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';
import { DeviceLinkNonce } from '../../models/DeviceLinkNonce';


/**
 * Api services for the `DeviceLinkNonce` model.
 */

export class DeviceLinkNonceApi extends BaseLoopBackApi {

  constructor(
     
  ) {
    
    super();
    
  }



  /**
   * The name of the model represented by this $resource,
   * i.e. `DeviceLinkNonce`.
   */
  getModelName() {
    return "DeviceLinkNonce";
  }
}

