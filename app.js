'use strict';

const asyncHook = require('./lib/async-hook');

module.exports = app => {
  app.ready(() => { asyncHook(app); });
  app.config.coreMiddleware.unshift('currentCtx');
};

