'use strict';

const asyncHooks = require('async_hooks');

const activeCtxs = new Map();

module.exports = app => {
  Object.defineProperty(app, 'currentCtx', {
    get() {
      const asyncId = asyncHooks.executionAsyncId();
      return activeCtxs.get(asyncId) || null;
    },
    set(ctx) {
      const asyncId = asyncHooks.executionAsyncId();
      if (ctx) {
        activeCtxs.set(asyncId, ctx);
      } else {
        activeCtxs.delete(ctx);
      }
    },
  });

  const asyncHook = asyncHooks.createHook({ init, destroy });
  asyncHook.enable();

  function init(asyncId, type) {
    if (type === 'TIMERWRAP') return;
    const ctx = app.currentCtx;
    if (!ctx) return;
    activeCtxs.set(asyncId, ctx);
  }

  function destroy(asyncId) {
    activeCtxs.delete(asyncId);
  }
};

