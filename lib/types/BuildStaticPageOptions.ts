export default interface BuildStaticPageOptions {
  init?: boolean;
  build?: boolean;
  serve?: boolean;
  preview?: boolean;
  config?: string;
  mode?: string;
  host?: string;
  port?: number;
  logLevel?: 'log' | 'info' | 'warning' | 'error';
  quiet?: boolean;
  noColors?: boolean;
  help?: boolean;
  version?: boolean;
}
