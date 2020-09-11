import ejs from 'ejs';
import autoprefixer from 'autoprefixer';

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
  templateGlobals: ejs.Data;
  autoprefixerOptions: autoprefixer.Options;
  scan: {
    index: string[];
    htmlRegexp: RegExp;
    fragmentRegexp: RegExp;
  }
}
