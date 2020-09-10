import Log from './Log';

export default interface BuildStaticPageResult {
  logs: Log[];
  help?: string;
  version?: string;
}
