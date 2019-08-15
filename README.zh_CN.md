# egg-current-ctx

[![Build Status](https://travis-ci.org/Claude-Ray/egg-current-ctx.svg?branch=master)](https://travis-ci.org/Claude-Ray/egg-current-ctx)
[![codecov](https://codecov.io/gh/Claude-Ray/egg-current-ctx/branch/master/graph/badge.svg)](https://codecov.io/gh/Claude-Ray/egg-current-ctx)

通过 app 即可获取当前上下文对应的 ctx 对象，用于在特殊插件的回调中定位接口上下文。

基于 async_hooks。

## 安装

```bash
$ npm i egg-current-ctx --save
```

## 开启插件

```js
// {app_root}/config/plugin.js
exports.currentCtx = {
  enable: true,
  package: 'egg-current-ctx',
};
```

## 使用场景

举个例子，在 egg 中使用 [dubbo2.js](https://www.npmjs.com/package/dubbo2.js)。
引入的方式参考 dubbo2.js 和 egg 的集成[指引](https://github.com/apache/dubbo-js/blob/master/docs/api.md#when-dubbo-was-ready)，并在其中使用[中间件扩展](https://github.com/apache/dubbo-js/blob/master/docs/middleware.md)

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

上述的 ctx 并不属于 egg 创建的 ctx，两者之间相互隔离。唯一能让两者产生联系的，就是使用闭包中的 `app`。

借助 app.currentCtx 方法，可以将两种 ctx 联系起来。

```js
module.exports = app => {
  const dubbo = Dubbo.from({....});
  app.beforeStart(async () => {
    dubbo.use(async (ctx, next) => {
      const startTime = Date.now();
      const eggCtx = app.currentCtx;
      // 对 eggCtx 处理
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

> 这里我省略了部分 dubbo2.js 的调用细节，如有需要，请移步查看它的文档。

这在极少情况下会非常有用，例如把 dubbo2.js 中 ctx 的属性挂载到 egg 的 ctx 上。

## License

[MIT](LICENSE)
