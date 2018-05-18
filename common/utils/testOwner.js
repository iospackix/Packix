module.exports = function(ctx, cb) {
  console.log(ctx);
  return cb(null, true);
};
