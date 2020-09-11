import { Data } from 'ejs';

export default interface BuildStaticPageConfig {
  settings: {
    src: string;
    dist: string;
    host: string;
    port: number;
    logLevel: 'log' | 'info' | 'warning' | 'error';
    quiet: boolean;
    noColors: boolean;
  };
  templateGlobals: Data;
  scan: {
    index: string[];
    htmlRegexp: RegExp;
    fragmentRegexp: RegExp;
  }
}
