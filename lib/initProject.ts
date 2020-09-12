import path from 'path';
import fse from 'fs-extra';
import BuildStaticPageContext from './types/BuildStaticPageContext';
import BuildStaticPageResult from './types/BuildStaticPageResult';
import relativePath from './shared/relativePath';

export default function (context: BuildStaticPageContext) {
  return new Promise<BuildStaticPageResult>((resolve) => {
    const {
      logger,
      userConfigPath,
      userConfigExists,
      defaultConfigPath,
      config,
    } = context;

    const { src } = config.settings;

    if (userConfigExists) {
      logger.info(`config exists (${relativePath(userConfigPath)})`);
    } else {
      fse.copySync(defaultConfigPath, userConfigPath);
      logger.info(`config created (${relativePath(userConfigPath)})`);
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
      configPath: userConfigPath,
    });
  });
}
