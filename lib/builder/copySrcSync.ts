import path from 'path';
import fse from 'fs-extra';
import isRegExp from 'lodash/fp/isRegExp';
import isFunction from 'lodash/fp/isFunction';
import toString from 'lodash/fp/toString';
import isString from 'lodash/fp/isString';
import isNumber from 'lodash/fp/isNumber';
import BuildStaticPageContext from '../types/BuildStaticPageContext';
import relativePath from '../shared/relativePath';

export default function (context: BuildStaticPageContext) {
  const { config, logger } = context;
  const src = config.settings.src;
  const dist = config.settings.dist;
  const types = (rule: unknown) =>
    isRegExp(rule) || isFunction(rule) || isString(rule) || isNumber(rule);

  const ignorePaths = config.copy.ignorePaths.filter(types).map((rule) =>
    (isRegExp(rule) || isFunction(rule))
      ? rule : path.resolve(src, toString(rule))
  );

  const ignoreNames = config.copy.ignoreNames.filter(types);

  logger.info(`copy ${relativePath(src)} to ${relativePath(dist)}`);

  fse.removeSync(dist);
  fse.copySync(src, dist, {
    filter: (filepath) => {
      let copy = true;

      if (filepath !== src) {
        const srcRelativePath = path.relative(src, filepath);

        for (let i = 0; i < ignorePaths.length; ++i) {
          const rule = ignorePaths[i];
          if (isRegExp(rule)) {
            if (rule.test(srcRelativePath)) {
              copy = false;
              break;
            }
          } else if (isFunction(rule)) {
            if (rule(srcRelativePath)) {
              copy = false;
              break;
            }
          } else if (rule === filepath) {
            copy = false;
            break;
          }
        }

        if (copy) {
          const filename = path.basename(filepath);
          for (let i = 0; i < ignoreNames.length; ++i) {
            const rule = ignoreNames[i];
            if (isRegExp(rule)) {
              if (rule.test(filename)) {
                copy = false;
                break;
              }
            } else if (isFunction(rule)) {
              if (rule(filename)) {
                copy = false;
                break;
              }
            } else if (rule === filename) {
              copy = false;
              break;
            }
          }
        }

        if (!copy) {
          logger.info(`ignore ${relativePath(filepath)}`);
        }
      }
      return copy;
    }
  });

  logger.info('source copied');
  logger.info(`start building with ${relativePath(dist)}`);
}
