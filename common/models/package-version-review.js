'use strict';

const deviceNames = require('./../../server/assets/deviceStrings.json');

module.exports = function(Packageversionreview) {
  Packageversionreview.updateRecentReviews = async (packageId, packageVersionId) => {
    try {
      const dataPromises = [
        Packageversionreview.app.models.Package.findById(packageId),
        Packageversionreview.find({
          where: {
            packageId: packageId
          },
          limit: 3,
          order: "updatedOn DESC",
          fields: {clientIp: false}
        }),
        Packageversionreview.app.models.PackageVersion.findById(packageVersionId),
        Packageversionreview.find({
          where: {
            packageVersionId: packageVersionId
          },
          limit: 3,
          order: "updatedOn DESC",
          fields: {clientIp: false}
        })
      ];

      const results = await Promise.all(dataPromises);

      const updatePromises = [
        results[0].updateAttributes({
          recentReviews: results[1]
        }),
        results[2].updateAttributes({
          recentReviews: results[3]
        })
      ];

      let updateResults = await Promise.all(updatePromises);
    } catch (err) {
      console.log('method failed', err);
    }
  };

  Packageversionreview.observe('after save', function(ctx, next) {
    if (ctx.instance) {
      Packageversionreview.updateRecentReviews(ctx.instance.packageId, ctx.instance.packageVersionId);
    }
    next();
  });

  Packageversionreview.getClientName = async (packageVersionReviewObj) => {
    return deviceNames[packageVersionReviewObj['clientType']];
  };

  // Packageversionreview.beforeRemote("deleteById", )

  Packageversionreview.getAssociatedRating = async (versionReviewObj) => {
    try {
      let associatedRating = await Packageversionreview.app.models.PackageVersionRating.findOne({
        where: {
          packageVersionId: versionReviewObj.packageVersionId,
          clientIp: versionReviewObj.clientIp,
          clientType: versionReviewObj.clientType
        },
        order: 'createdOn ASC'
      });

      if (associatedRating) {
        if (associatedRating.toJSON) {
          associatedRating = associatedRating.toJSON()
        }
        if (associatedRating['ip']) delete associatedRating['ip'];

        return associatedRating;
      }
    } catch (err) {
      return null;
    }
  }
};
