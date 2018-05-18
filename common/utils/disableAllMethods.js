
const relTypeMethods = {
  'belongsTo': [
    'get'
  ],
  'hasOne': [
    'create',
    'get',
    'update',
    'destroy'
  ],
  'hasMany': [
    'count',
    'create',
    'delete',
    'destroyById',
    'findById',
    'get',
    'updateById'
  ],
  'hasManyThrough': [
    'count',
    'create',
    'delete',
    'destroyById',
    'exists',
    'findById',
    'get',
    'link',
    'updateById',
    'unlink'
  ]
};

module.exports = (model, methodsToExpose) => {
  if (model && model.sharedClass) {
    methodsToExpose = methodsToExpose || [];
    let rootAllowedMethods = model.definition.settings['allowedMethods'] ? model.definition.settings['allowedMethods'] : [];

    let modelName = model.sharedClass.name;
    let methodsObj = model.sharedClass.methods();
    let methods = [];
    for (let method of methodsObj) {
      let methodName = !method.isStatic ? 'prototype.' : '';
      methodName += method.name;
      if (rootAllowedMethods.indexOf(methodName) < 0) {
        methods.push({name: method.name, isStatic: method.isStatic});
      }
    }
    //
    // console.log('Methods');
    // console.log(methods);
    let relationMethods = [];
    let hiddenMethods = [];

    try {
      //console.log(model.definition);
      // console.log('Relations');
      // console.log(Object.keys(model.definition.settings.relations));
      Object.keys(model.definition.settings.relations).forEach((relationName) => {
        let relation = model.definition.settings.relations[relationName];
        let allowedMethods = relation['allowedMethods'] ? relation['allowedMethods'] : [];
        let relMethods = relTypeMethods[relation.type];
        for (let methodName of relMethods) {
          if (allowedMethods.indexOf(methodName) < 0) {
            relationMethods.push({ name: '__' + methodName + '__' + relationName, isStatic: false });
          }
        }
        //relationMethods.push({ name: '__findById__' + relation, isStatic: false });
        // relationMethods.push({ name: '__destroyById__' + relation, isStatic: false });
        // relationMethods.push({ name: '__updateById__' + relation, isStatic: false });
        // relationMethods.push({ name: '__exists__' + relation, isStatic: false });
        // relationMethods.push({ name: '__link__' + relation, isStatic: false });
        // //relationMethods.push({ name: '__get__' + relation, isStatic: false });
        // relationMethods.push({ name: '__create__' + relation, isStatic: false });
        // relationMethods.push({ name: '__update__' + relation, isStatic: false });
        // relationMethods.push({ name: '__destroy__' + relation, isStatic: false });
        // relationMethods.push({ name: '__unlink__' + relation, isStatic: false });
        // //relationMethods.push({ name: '__count__' + relation, isStatic: false });
        // relationMethods.push({ name: '__delete__' + relation, isStatic: false });
        // relationMethods.push({ name: '__rel__' + relation, isStatic: false });
      });
    } catch(err) {
     // console.log(err);
    }

    methods.concat(relationMethods).forEach((method) => {
      let methodName = !method.isStatic ? 'prototype.' : '';
      methodName += method.name;
      //console.log(methodName);
      if (methodsToExpose.indexOf(methodName) < 0) {
        hiddenMethods.push(methodName);
        model.disableRemoteMethodByName(methodName);
      }
    });

    // if(hiddenMethods.length > 0) {
    //   console.log('\nRemote mehtods hidden for', modelName, ':', hiddenMethods.join(', '), '\n');
    // }
  }
};
