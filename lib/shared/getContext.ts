import path from 'path';
import fse from 'fs-extra';
import toString from 'lodash/fp/toString';
import Logger from './logger';
import fileExists from './fileExists';
import BuildStaticPageConfig from '../types/BuildStaticPageConfig';
import BuildStaticPageOptions from '../types/BuildStaticPageOptions';
import BuildStaticPageContext from '../types/BuildStaticPageContext';

export default function (options: BuildStaticPageOptions) {
  const configPath = path.resolve(options.config || 'build.static.page.config.js');
  const defaultConfigPath = path.resolve(__dirname, '../initializer/default.config.js');
  const userConfigExists = fileExists(configPath);

  if (!userConfigExists) {
    if (options.init) {
      fse.outputFileSync(configPath, fse.readFileSync(defaultConfigPath));
    } else {
      throw new Error('config does not exists, '
        + 'please use `--init` to create one.\n\n'
        + `config path: ${configPath}`);
    }
  }

  const configDir = path.dirname(configPath);

  /* eslint @typescript-eslint/no-var-requires: "off" */
  const configFn = require(configPath);

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

  settings.src = path.resolve(configDir, settings.src || 'www');
  settings.dist = path.resolve(configDir, settings.dist || 'dist');

  const { logLevel, quiet, noColors } = settings;
  const logger = new Logger({ logLevel, quiet, noColors });
  const context: BuildStaticPageContext = {
    mode,
    options,
    config,
    logger,
    configPath,
    userConfigExists,
  };

  return context;
}
