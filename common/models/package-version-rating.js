'use strict';

const disableAllMethods = require('../utils/disableAllMethods');

const unauthorizedErrorDict = {
  name: 'Unauthorized',
  status: 401,
  message: 'You are not authorized to perform this action'
};

module.exports = function(Packageversionrating) {

  Packageversionrating.updateRatingForId = async (packageVersionId) => {
    let packageVersion = await Packageversionrating.app.models.PackageVersion.findById(packageVersionId);

    let ratingStats = {};
    ratingStats['ratings'] = [];
    let totalCount = 0;
    let divideWith = 0;

    let promises = [];

    for (let x = 5; x > 0; x--) {
      promises.push(Packageversionrating.count({
        packageVersionId: packageVersionId,
        value: x
      }));
    }

    let results = await Promise.all(promises);

    for (let x = 0; x < 5; x++) {
      let count = results[x];
      const star = (5 - x);
      ratingStats['ratings'].push({
        starCount: count,
        star: star
      })

      divideWith += count*star;
      totalCount += count;
    }

    ratingStats['total'] = totalCount;
    ratingStats['average'] = divideWith/totalCount;


    let updatedPackageVersion = await packageVersion.updateAttributes({
      ratingStats: ratingStats
    });

    await Packageversionrating.app.models.PackageVersionReview.updateRecentReviews(packageVersion.packageId, packageVersionId);
  };

  Packageversionrating.observe('after save', function(ctx, next) {
    if (ctx.instance) {
      Packageversionrating.updateRatingForId(ctx.instance.packageVersionId);
    }
    next();
  });

  // Packageversionrating.beforeRemote('deleteById', )

  disableAllMethods(Packageversionrating, []);
};
