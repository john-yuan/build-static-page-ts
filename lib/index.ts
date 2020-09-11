import fse from 'fs-extra';
import path from 'path';
import BuildStaticPageOptions from './types/BuildStaticPageOptions';
import BuildStaticPageResult from './types/BuildStaticPageResult';
import getContext from './shared/getContext';
import initProject from './initProject';

export default function (options: BuildStaticPageOptions) {
  return new Promise<BuildStaticPageResult>((resolve, reject) => {
    const context = getContext(options);
    const { logger } = context;

    if (options.init) {
      return initProject(context).then(resolve).catch(reject);
    } else if (options.build) {
      // TODO
    } else if (options.preview) {
      // TODO
    } else if (options.serve) {
      // TODO
    } else if (options.version) {
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
