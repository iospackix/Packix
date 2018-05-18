/* tslint:disable */
/**
* @module SDKModule
* @author Jonathan Casarrubias <t:@johncasarrubias> <gh:jonathan-casarrubias>
* @license MIT 2016 Jonathan Casarrubias
* @version 2.1.0
* @description
* The SDKModule is a generated Software Development Kit automatically built by
* the LoopBack SDK Builder open source module.
*
* The SDKModule provides Angular 2 >= RC.5 support, which means that NgModules
* can import this Software Development Kit as follows:
*
*
* APP Route Module Context
* ============================================================================
* import { NgModule }       from '@angular/core';
* import { BrowserModule }  from '@angular/platform-browser';
* // App Root 
* import { AppComponent }   from './app.component';
* // Feature Modules
* import { SDK[Browser|Node|Native]Module } from './shared/sdk/sdk.module';
* // Import Routing
* import { routing }        from './app.routing';
* @NgModule({
*  imports: [
*    BrowserModule,
*    routing,
*    SDK[Browser|Node|Native]Module.forRoot()
*  ],
*  declarations: [ AppComponent ],
*  bootstrap:    [ AppComponent ]
* })
* export class AppModule { }
*
**/
import { ErrorHandler } from './services/core/error.service';
import { LoopBackAuth } from './services/core/auth.service';
import { LoggerService } from './services/custom/logger.service';
import { SDKModels } from './services/custom/SDKModels';
import { InternalStorage, SDKStorage } from './storage/storage.swaps';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CookieBrowser } from './storage/cookie.browser';
import { StorageBrowser } from './storage/storage.browser';
import { SocketBrowser } from './sockets/socket.browser';
import { SocketDriver } from './sockets/socket.driver';
import { SocketConnection } from './sockets/socket.connections';
import { RealTime } from './services/core/real.time';
import { AccountApi } from './services/custom/Account';
import { PackageApi } from './services/custom/Package';
import { PackageFileApi } from './services/custom/PackageFile';
import { PackageVersionApi } from './services/custom/PackageVersion';
import { SectionApi } from './services/custom/Section';
import { PackageDownloadApi } from './services/custom/PackageDownload';
import { DeviceLinkNonceApi } from './services/custom/DeviceLinkNonce';
import { PayPalApi } from './services/custom/PayPal';
import { PackagePurchaseApi } from './services/custom/PackagePurchase';
import { PackageScreenshotApi } from './services/custom/PackageScreenshot';
import { PackageScreenshotFileApi } from './services/custom/PackageScreenshotFile';
import { PackageVersionRatingApi } from './services/custom/PackageVersionRating';
import { PackageVersionReviewApi } from './services/custom/PackageVersionReview';
import { RepositoryApi } from './services/custom/Repository';
import { PackageDownloadRestrictionApi } from './services/custom/PackageDownloadRestriction';
import { AccountGroupApi } from './services/custom/AccountGroup';
import { AccountGroupLinkApi } from './services/custom/AccountGroupLink';
import { PackageGiftLinkApi } from './services/custom/PackageGiftLink';
import { PatreonUserApi } from './services/custom/PatreonUser';
import { PackageCouponCodeApi } from './services/custom/PackageCouponCode';
import { DeveloperPreferencesApi } from './services/custom/DeveloperPreferences';
import { DeveloperInfoApi } from './services/custom/DeveloperInfo';
import { PackageRefundRequestApi } from './services/custom/PackageRefundRequest';
/**
* @module SDKBrowserModule
* @description
* This module should be imported when building a Web Application in the following scenarios:
*
*  1.- Regular web application
*  2.- Angular universal application (Browser Portion)
*  3.- Progressive applications (Angular Mobile, Ionic, WebViews, etc)
**/
@NgModule({
  imports:      [ CommonModule, HttpClientModule ],
  declarations: [ ],
  exports:      [ ],
  providers:    [
    ErrorHandler,
    SocketConnection
  ]
})
export class SDKBrowserModule {
  static forRoot(internalStorageProvider: any = {
    provide: InternalStorage,
    useClass: CookieBrowser
  }): ModuleWithProviders {
    return {
      ngModule  : SDKBrowserModule,
      providers : [
        LoopBackAuth,
        LoggerService,
        SDKModels,
        RealTime,
        AccountApi,
        PackageApi,
        PackageFileApi,
        PackageVersionApi,
        SectionApi,
        PackageDownloadApi,
        DeviceLinkNonceApi,
        PayPalApi,
        PackagePurchaseApi,
        PackageScreenshotApi,
        PackageScreenshotFileApi,
        PackageVersionRatingApi,
        PackageVersionReviewApi,
        RepositoryApi,
        PackageDownloadRestrictionApi,
        AccountGroupApi,
        AccountGroupLinkApi,
        PackageGiftLinkApi,
        PatreonUserApi,
        PackageCouponCodeApi,
        DeveloperPreferencesApi,
        DeveloperInfoApi,
        PackageRefundRequestApi,
        internalStorageProvider,
        { provide: SDKStorage, useClass: StorageBrowser },
        { provide: SocketDriver, useClass: SocketBrowser }
      ]
    };
  }
}
/**
* Have Fun!!!
* - Jon
**/
export * from './models/index';
export * from './services/index';
export * from './lb.config';
export * from './storage/storage.swaps';
export { CookieBrowser } from './storage/cookie.browser';
export { StorageBrowser } from './storage/storage.browser';

