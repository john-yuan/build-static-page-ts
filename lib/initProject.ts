import path from 'path';
import fse from 'fs-extra';
import BuildStaticPageContext from './types/BuildStaticPageContext';
import BuildStaticPageResult from './types/BuildStaticPageResult';
import relativePath from './shared/relativePath';

export default function (context: BuildStaticPageContext) {
  return new Promise<BuildStaticPageResult>((resolve) => {
    const { logger, configPath, userConfigExists, config } = context;
    const { src } = config.settings;

    if (userConfigExists) {
      logger.info(`config exists (${relativePath(configPath)})`);
    } else {
      logger.info(`config created (${relativePath(configPath)})`);
    }

    if (fse.pathExistsSync(src)) {
      logger.info(`source directory exists (${relativePath(src)})`);
    } else {
      const defaultSrc = path.resolve(__dirname, 'initializer/www');
      fse.copySync(defaultSrc, src);
      logger.info(`source directory created (${relativePath(src)})`);
    }

    logger.info('project initialized.');

    resolve({
      logs: logger.getLogs(),
      configPath,
    });
  });
}
