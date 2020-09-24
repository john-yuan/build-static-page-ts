import BuildStaticPageConfig from './BuildStaticPageConfig';
import Logger from '../shared/logger';
import BuildStaticPageOptions from './BuildStaticPageOptions';

export default interface BuildStaticPageContext {
  mode: string;
  cache: {
    javascript: { [filepath: string]: string };
    stylesheet: { [filepath: string]: string };
  };
  options: BuildStaticPageOptions
  config: BuildStaticPageConfig;
  logger: Logger;
  userConfigPath: string;
  userConfigExists: boolean;
  defaultConfigPath: string;
  workingConfigPath: string;
}
