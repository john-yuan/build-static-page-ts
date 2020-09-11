import Log from './Log';

export default interface BuildStaticPageResult {
  logs: Log[];
  configPath?: string;
  help?: string;
  version?: string;
}
