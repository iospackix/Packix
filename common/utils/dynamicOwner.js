module.exports = function(ctx, cb) {
  // return new Promise(async (resolve, reject) => {
    //console.log('Checking Dynamic Resolver');
    console.log(ctx.instance);
   // console.log('Args');
    console.log(ctx.args);
    //console.log('Where');
    console.log(ctx.where);
   // console.log('Fill');
    let model = ctx.model;
    //  console.log(ctx.accessToken);
      const ownerId = ctx.accessToken ? ctx.accessToken.userId : null;
      //console.log(ctx.accessToken);
     // console.log('ownerId: ' + ownerId);
      if (!ownerId || ownerId.length < 1) return cb(null, false);
      let instanceId = ctx.instance ? ctx.instance.id : null;
      if (instanceId === null || instanceId.length < 1) instanceId = ctx.args ? ctx.args.id : null;
      if (instanceId === null || instanceId.length < 1) instanceId = ctx.where ? ctx.where.id : null;
     // console.log('instanceId: ' + instanceId);
      if (instanceId === null || instanceId.length < 1) return cb(null, false);

      let ownerPath = model.definition.settings['ownerIdPath'] || "accountId";
      let propPaths = ownerPath.split('.');
      let modelSettings = model.definition.settings;
      let rootRelation = modelSettings.relations[propPaths[0]];

      let computedRels = [];
      if (rootRelation) {
        let lastModel = model;
        let lastRelation = rootRelation;
        for (let propPath of propPaths) {
          let relation = lastModel.definition.settings.relations[propPath];
          if (relation) {
            lastModel = model.app.models[relation['model']];
            lastRelation = relation;
            computedRels.push(propPath);
          } else {
            break;
          }
        }
      }

      computedRels = computedRels.reverse();
      let lastObj = null;
      for (let relPath of computedRels) {
        if (lastObj) {
          lastObj = {
            relation: relPath,
            scope: {
              include: [
                lastObj
              ]
            }
          }
        } else {
          lastObj = {
            relation: relPath
          }
        }
      }

      model.findById(instanceId, {
        include: [lastObj]
      }, function(err, modelValue) {
        if (modelValue.toJSON) modelValue = modelValue.toJSON();
        for (let propPath of propPaths) {
          modelValue = modelValue[propPath];
          if (!modelValue) return cb(null, false);
        }
        //console.log('Final Value: ' + modelValue);
        return cb(null, modelValue.toString() === ownerId.toString());
      });
  // });
};
