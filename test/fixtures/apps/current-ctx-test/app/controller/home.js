'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    this.ctx.body = this.ctx.app.currentCtx.query;
  }
}

module.exports = HomeController;
