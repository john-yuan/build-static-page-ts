import path from 'path';
import toString from 'lodash/fp/toString';
import Logger from './logger';
import fileExists from './fileExists';
import BuildStaticPageConfig from '../types/BuildStaticPageConfig';
import BuildStaticPageOptions from '../types/BuildStaticPageOptions';
import BuildStaticPageContext from '../types/BuildStaticPageContext';

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
  settings.quiet = options.quiet || settings.quiet || false;
  settings.noColors = options.noColors || settings.noColors || false;

  if (typeof settings.host !== 'string') {
    throw new TypeError('host is not a string');
  }

  if (typeof settings.port !== 'number') {
    settings.port = parseInt(settings.port, 10);
    if (isNaN(settings.port)) {
      throw new TypeError('port is not a number');
    }
  }

  settings.src = path.resolve(userConfigDir, settings.src || 'www');
  settings.dist = path.resolve(userConfigDir, settings.dist || 'dist');

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
  };

  return context;
}
