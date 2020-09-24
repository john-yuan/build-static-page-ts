import Log from './Log';

export default interface BuildStaticPageResult {
  logs: Log[];
  // --serve
  // --build
  // --preview
  mode?: string;
  // --build
  dist?: string;
  // --init
  configPath?: string;
  // --serve
  root?: string;
  host?: string[];
  port?: number;
  // --help
  help?: string;
  // --version
  version?: string;
}
