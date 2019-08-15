# egg-current-ctx

[![Build Status](https://travis-ci.org/Claude-Ray/egg-current-ctx.svg?branch=master)](https://travis-ci.org/Claude-Ray/egg-current-ctx)
[![codecov](https://codecov.io/gh/Claude-Ray/egg-current-ctx/branch/master/graph/badge.svg)](https://codecov.io/gh/Claude-Ray/egg-current-ctx)

Track the current ctx via egg's app, especially in plugin's callbacks.

Based on async_hooks.

## Install

```bash
$ npm i egg-current-ctx --save
```

## Usage

```js
// {app_root}/config/plugin.js
exports.currentCtx = {
  enable: true,
  package: 'egg-current-ctx',
};
```

## Example

For example, if you want to use [dubbo2.js](https://www.npmjs.com/package/dubbo2.js) in egg.

The following code was written according to the [starting](https://github.com/apache/dubbo-js/blob/master/docs/api.md#when-dubbo-was-ready) and [middleware](https://github.com/apache/dubbo-js/blob/master/docs/middleware.md) guides of dubbo2.js.

```js
// {plugin_root} ./app.js
module.exports = app => {
  const dubbo = Dubbo.from({....});
  app.beforeStart(async () => {
    dubbo.use(async (ctx, next) => {
      const startTime = Date.now();
      await next();
      const endTime = Date.now();
      console.log('costtime: %d', endTime - startTime);
    });
    await dubbo.ready();
    console.log('dubbo was ready...');
  })
}
```

The above `ctx` which belongs to dubbo2.js isn't equal to ctx created by egg. 

You could use `app.currentCtx` to operate the ctx of egg.

```js
// {plugin_root} ./app.js
module.exports = app => {
  const dubbo = Dubbo.from({....});
  app.beforeStart(async () => {
    dubbo.use(async (ctx, next) => {
      const startTime = Date.now();
      // get ctx from current async context
      const eggCtx = app.currentCtx;
      console.log('', eggCtx.query);
      await next();
      const endTime = Date.now();
      console.log('costtime: %d', endTime - startTime);
    });
    await dubbo.ready();
    console.log('dubbo was ready...');
  })
}
```

> Here I omitted a part of calling process of dubbo2.js. For more details, you can follow its own documentation.

It can be very useful in rare conditions, such as mounting the properties of `dubbo2.js ctx` to `egg ctx`.

## License

[MIT](LICENSE)

