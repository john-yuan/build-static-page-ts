import fse from 'fs-extra';
import path from 'path';
import BuildStaticPageOptions from './types/BuildStaticPageOptions';
import Logger from './shared/logger';
import BuildStaticPageResult from './types/BuildStaticPageResult';

export default function(options: BuildStaticPageOptions) {
  return new Promise<BuildStaticPageResult>((resolve) => {
    const { quiet, logLevel, noColors } = options;
    const logger = new Logger({ quiet, logLevel, noColors });

    if (options.version) {
      const packagePath = path.resolve(__dirname, '../package.json');
      const packageJSON = JSON.parse(fse.readFileSync(packagePath).toString());
      const version = packageJSON.version as string;

      logger.log(version);
      resolve({ logs: logger.getLogs(), version });
    } else {
      const helpPath = path.resolve(__dirname, 'bin/help.txt');
      const help = fse.readFileSync(helpPath).toString().trim();

      logger.log(help);
      resolve({ logs: logger.getLogs(), help });
    }
  });
}
