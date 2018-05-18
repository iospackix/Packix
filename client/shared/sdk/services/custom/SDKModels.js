import { Account } from '../../models/Account';
import { Package } from '../../models/Package';
import { PackageFile } from '../../models/PackageFile';
import { PackageVersion } from '../../models/PackageVersion';
import { Section } from '../../models/Section';
import { PackageDownload } from '../../models/PackageDownload';
import { DeviceLinkNonce } from '../../models/DeviceLinkNonce';
import { PayPal } from '../../models/PayPal';
import { PackagePurchase } from '../../models/PackagePurchase';
import { PackageScreenshot } from '../../models/PackageScreenshot';
import { PackageScreenshotFile } from '../../models/PackageScreenshotFile';
import { PackageVersionRating } from '../../models/PackageVersionRating';
import { PackageVersionReview } from '../../models/PackageVersionReview';
import { Repository } from '../../models/Repository';
import { PackageDownloadRestriction } from '../../models/PackageDownloadRestriction';
import { AccountGroup } from '../../models/AccountGroup';
import { AccountGroupLink } from '../../models/AccountGroupLink';
import { PackageGiftLink } from '../../models/PackageGiftLink';
import { PackageCouponCode } from '../../models/PackageCouponCode';
import { DeveloperPreferences } from '../../models/DeveloperPreferences';
import { DeveloperInfo } from '../../models/DeveloperInfo';
import { PackageRefundRequest } from '../../models/PackageRefundRequest';
import { TestModel } from '../../models/TestModel';
export class SDKModels {
  models = {
    Account: Account,
    Package: Package,
    PackageFile: PackageFile,
    PackageVersion: PackageVersion,
    Section: Section,
    PackageDownload: PackageDownload,
    DeviceLinkNonce: DeviceLinkNonce,
    PayPal: PayPal,
    PackagePurchase: PackagePurchase,
    PackageScreenshot: PackageScreenshot,
    PackageScreenshotFile: PackageScreenshotFile,
    PackageVersionRating: PackageVersionRating,
    PackageVersionReview: PackageVersionReview,
    Repository: Repository,
    PackageDownloadRestriction: PackageDownloadRestriction,
    AccountGroup: AccountGroup,
    AccountGroupLink: AccountGroupLink,
    PackageGiftLink: PackageGiftLink,
    PackageCouponCode: PackageCouponCode,
    DeveloperPreferences: DeveloperPreferences,
    DeveloperInfo: DeveloperInfo,
    PackageRefundRequest: PackageRefundRequest,
    TestModel: TestModel,
    
  };

  get(modelName) {
    return this.models[modelName];
  }

  getAll() {
    return this.models;
  }

  getModelNames() {
    return Object.keys(this.models);
  }
}
