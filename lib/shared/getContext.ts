import path from 'path';
import toString from 'lodash/fp/toString';
import toNumber from 'lodash/fp/toNumber';
import Logger from './logger';
import fileExists from './fileExists';
import BuildStaticPageConfig from '../types/BuildStaticPageConfig';
import BuildStaticPageOptions from '../types/BuildStaticPageOptions';
import BuildStaticPageContext from '../types/BuildStaticPageContext';
import dirContains from './dirContains';

function fillDefaultConfig(context: BuildStaticPageContext) {
  const { config, logger } = context;

  const output = config.output || {};
  const defaultHashLength = toNumber(output.defaultHashLength || 0);
  const invalidLength = (isNaN(defaultHashLength) || defaultHashLength <= 0);

  if (invalidLength) {
    logger.warn(`${output.defaultHashLength} is not a valid default `
      + 'hash length, using 7 as default hash length');
    output.defaultHashLength = 7;
  } else {
    output.defaultHashLength = defaultHashLength;
  }

  if (!output.javascript) {
    output.javascript = '[name].[hash].js';
  }
  if (!output.stylesheet) {
    output.stylesheet = '[name].[hash].css';
  }

  config.output = output;

  const scan = config.scan || {};
  scan.index = scan.index || ['index.html', 'index.htm'];
  scan.htmlRegexp = scan.htmlRegexp || /\.html$/i;
  scan.fragmentRegexp = scan.fragmentRegexp || /\.fragment\.html$/i;
  config.scan = scan;

  const copy = config.copy || {};
  copy.ignorePaths = copy.ignorePaths || [];
  copy.ignoreNames = copy.ignoreNames || ['.DS_Store', 'node_modules'];
  config.copy = copy;
}

function checkDir(userConfigDir: string, src: string, dist: string) {
  if (!dirContains(userConfigDir, src)) {
    throw new Error('source directory must be a subdirectory of '
      + `${userConfigDir} bug got ${src}`);
  }

  if (!dirContains(userConfigDir, dist)) {
    throw new Error('dist directory must be a subdirectory of '
      + `${userConfigDir} bug got ${dist}`);
  }

  if (src === dist) {
    throw new Error(`dist directory (${dist}) can not be same with `
    + `source directory (${src})`);
  }

  if (dirContains(src, dist)) {
    throw new Error(`dist directory (${dist}) can not be a subdirectory `
     + `of source directory (${src})`);
  }

  if (dirContains(dist, src)) {
    throw new Error(`source directory (${src}) can not be a subdirectory `
     + `of dist directory (${dist})`);
  }
}

export default function (options: BuildStaticPageOptions) {
  const configArg = toString(options.config);
  const userConfig = configArg || 'build.static.page.config.js';
  const userConfigPath = path.resolve(userConfig);
  const userConfigDir = path.dirname(userConfigPath);
  const userConfigExists = fileExists(userConfigPath);
  const defaultConfigName = '../initializer/default.config.js';
  const defaultConfigPath = path.resolve(__dirname, defaultConfigName);
  const workingConfigPath = userConfigExists
    ? userConfigPath
    : defaultConfigPath;

  if (configArg && !userConfigExists) {
    throw new Error(`config not found ${userConfigPath}`);
  }

  /* eslint @typescript-eslint/no-var-requires: "off" */
  const configFn = require(workingConfigPath);

  if (typeof configFn !== 'function') {
    throw new TypeError('config is not a function');
  }

  const useDevelopment = !(options.build || options.preview) && options.serve;
  const defaultMode = useDevelopment ? 'development' : 'production';
  const mode = toString(options.mode ? options.mode : defaultMode);
  const config = configFn(mode) as BuildStaticPageConfig;
  const settings = config.settings || {};

  settings.host = options.host || settings.host || '0.0.0.0';
  settings.port = options.port || settings.port || 8080;
  settings.logLevel = options.logLevel || settings.logLevel || 'log';
  settings.quiet = !!(options.quiet || settings.quiet || false);
  settings.noColors = !!(options.noColors || settings.noColors || false);

  if (typeof settings.host !== 'string') {
    throw new TypeError('host is not a string');
  }

  if (typeof settings.port !== 'number') {
    settings.port = parseInt(settings.port, 10);
    if (isNaN(settings.port)) {
      throw new TypeError('port is not a number');
    }
  }

  if (!['log', 'info', 'warning', 'error'].includes(settings.logLevel)) {
    throw new TypeError('log level is not one of log, info, warning or error');
  }

  settings.src = path.resolve(userConfigDir, settings.src || 'www');
  settings.dist = path.resolve(userConfigDir, settings.dist || 'dist');

  checkDir(userConfigDir, settings.src, settings.dist);

  const { logLevel, quiet, noColors } = settings;
  const logger = new Logger({ logLevel, quiet, noColors });
  const context: BuildStaticPageContext = {
    mode,
    logger,
    config,
    options,
    userConfigPath,
    userConfigExists,
    defaultConfigPath,
    workingConfigPath,
    cache: { javascript: {}, stylesheet: {} },
  };

  fillDefaultConfig(context);

  return context;
}
