import BuildStaticPageConfig from './BuildStaticPageConfig';
import Logger from '../shared/logger';
import BuildStaticPageOptions from './BuildStaticPageOptions';

export default interface BuildStaticPageContext {
  mode: string;
  options: BuildStaticPageOptions
  config: BuildStaticPageConfig;
  logger: Logger;
  configPath: string;
  userConfigExists: boolean;
}
