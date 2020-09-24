import ejs from 'ejs';
import autoprefixer from 'autoprefixer';
import CleanCss from 'clean-css';

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
  cleanCssOptions: CleanCss.OptionsOutput;
  htmlBeautifyOptions: HTMLBeautifyOptions;
  output: {
    defaultHashLength: number;
    stylesheet: string;
    javascript: string;
  };
  scan: {
    index: string[];
    htmlRegexp: RegExp;
    fragmentRegexp: RegExp;
  };
  copy: {
    ignorePaths: (string | RegExp | ((relativePath: string) => boolean))[],
    ignoreNames: (string | RegExp | ((filename: string) => boolean))[],
  };
}
