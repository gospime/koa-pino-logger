const fs = require('fs');
const mkdirp = require('mkdirp');
const logger = require('koa-pino-logger');
const rfs = require('rotating-file-stream');

const isProduction = process.env.NODE_ENV === 'production';
const skipSuccessed = isProduction && false;

const defaultOptions = {
  size: '16M',
  interval: '1d',
  compress: 'gzip',
  path: process.cwd(),
  file: 'app.log'
};

module.exports = options => {
  const _options = Object.assign(
    {},
    defaultOptions,
    options || {}
  );

  const { file, ...rfsOptions } = _options;
  if (!file || typeof file !== 'string') throw new TypeError('invalid log file name');

  const { path } = rfsOptions;
  if (!path || typeof path !== 'string') throw new TypeError('invalid path to logs');

  fs.existsSync(path) || mkdirp.sync(path);

  const stream = rfs(file, rfsOptions);

  return logger(stream);
};
