import BuildStaticPageContext from './types/BuildStaticPageContext';
import BuildStaticPageResult from './types/BuildStaticPageResult';
import copySrcSync from './builder/copySrcSync';
import walkDirSync from './shared/walkDirSync';
import buildPage from './builder/buildPage';

export default function (context: BuildStaticPageContext) {
  return new Promise<BuildStaticPageResult>((resolve, reject) => {
    const { config, logger, mode } = context;
    const { dist } = config.settings;
    const { fragmentRegexp, htmlRegexp } = config.scan;
    const htmlFiles: string[] = [];

    copySrcSync(context);
    walkDirSync(dist, (filepath) => {
      if (!fragmentRegexp.test(filepath)) {
        if (htmlRegexp.test(filepath)) {
          htmlFiles.push(filepath);
        }
      }
    });

    const buildNextPage = () => {
      const filename = htmlFiles.shift();

      if (filename) {
        buildPage(filename, context).then(buildNextPage).catch(reject);
      } else {
        resolve({ mode, dist, logs: logger.getLogs() });
      }
    };

    buildNextPage();
  });
}
