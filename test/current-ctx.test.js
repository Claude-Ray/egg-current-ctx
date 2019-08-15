'use strict';

const mock = require('egg-mock');

describe('test/current-ctx.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/current-ctx-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .query({ name: 'claude' })
      .expect({ name: 'claude' })
      .expect(200);
  });
});
