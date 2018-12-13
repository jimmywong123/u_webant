'use strict';

const path = require('path');
const serve = require('koa-static');

// 检查用户会话
module.exports = () => {
  return serve(path.join(__dirname, '../public'));
}
;
