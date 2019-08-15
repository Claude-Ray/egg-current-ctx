'use strict';

module.exports = () => (ctx, next) => {
  ctx.app.currentCtx = ctx;
  return next();
};
