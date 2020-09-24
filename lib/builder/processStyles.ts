import path from 'path';
import CleanCSS from 'clean-css';
import toString from 'lodash/fp/toString';
import cloneDeep from 'lodash/fp/cloneDeep';
import isAbsoluteURL from '../shared/isAbsoluteURL';
import BuildStaticPageContext from '../types/BuildStaticPageContext';
import dirContains from '../shared/dirContains';
import renderLess from '../shared/renderLess';
import relativePath from '../shared/relativePath';
import saveProcessedFile from '../shared/saveProcessedFile';

export default function (
  $: CheerioStatic,
  htmlPath: string,
  context: BuildStaticPageContext,
) {
  return new Promise<void>((resolve, reject) => {
    const { logger } = context;
    const rootDir = context.config.settings.dist;
    const htmlDir = path.dirname(htmlPath);
    const links: {
      $link: Cheerio;
      href: string;
      base: string;
      name: string;
      query: string;
      stylePath: string;
      output: string;
    }[] = [];

    $('link').filter(function (index, link) {
      const $link = $(link);
      const rel = toString($link.attr('rel')).trim().toLowerCase();
      return rel === '' || rel === 'stylesheet';
    }).each(function (index, element) {
      const $link = $(element);
      const href = $link.attr('href');

      if (href && !isAbsoluteURL(href)) {
        const regSearchAndHash = /(\?|#).*$/;
        const query = href.match(regSearchAndHash);
        const cleanHref = href.replace(regSearchAndHash, '');
        const paths = cleanHref.split('/');
        const items = toString(paths.pop()).split('.');

        if (items.length === 2) {
          if (items[0] !== '') items.pop();
        } else if (items.length > 2) {
          items.pop();
        }

        const stylePath = cleanHref.startsWith('/')
          ? path.resolve(rootDir, `.${cleanHref}`)
          : path.resolve(htmlDir, cleanHref);

        if (!dirContains(rootDir, stylePath)) {
          logger.error(`The stylesheet ${cleanHref} used in ${htmlPath} is `
            + `not a file inside the project root directory ${rootDir}`);
          throw new Error('Failed to build static page');
        }

        const output = toString($link.attr('build-static-page:output')).trim()
          || context.config.output.stylesheet;

        $link.removeAttr('build-static-page:output');

        links.push({
          $link: $link,
          base: paths.join('/'),
          name: items.join('.'),
          href: cleanHref,
          query: query ? query[0] : '',
          stylePath: stylePath,
          output
        });
      }
    });

    const stylesheetCache = context.cache.stylesheet;
    const { autoprefixerOptions, cleanCssOptions } = context.config;

    const processNextLink = () => {
      const linkDetail = links.shift();

      if (linkDetail) {
        const { stylePath } = linkDetail;
        const styleRelativePath = relativePath(stylePath);
        const updateStyleLinkHref = () => {
          const { $link, name, output, stylePath, base, query } = linkDetail;
          const styleDir = path.dirname(stylePath);
          const styleContent = stylesheetCache[stylePath] || '';

          saveProcessedFile(
            styleDir, name, styleContent, output,
            context.config.output.defaultHashLength)
            .then((result) => {
              const { existing, savedBefore, filename, filepath } = result;

              if (existing.length) {
                existing.forEach((existingFilePath) => {
                  logger.warn(`path ${relativePath(existingFilePath)} exists`);
                });
              }

              if (savedBefore) {
                logger.info(`reuse ${relativePath(filepath)}`);
              } else {
                logger.info(`create ${relativePath(filepath)}`);
              }

              $link.attr('href', `${base}/${filename}${query}`);

              processNextLink();
            }).catch((err) => {
              logger.error(`failed to process ${styleRelativePath}`);
              reject(err);
            });
        };

        if (stylesheetCache[stylePath]) {
          logger.info(`reuse ${styleRelativePath}`);
          updateStyleLinkHref();
        } else {
          logger.info(`process ${styleRelativePath}`);
          renderLess(stylePath, cloneDeep(autoprefixerOptions))
            .then((css) => {
              const { errors, styles } = new CleanCSS(cleanCssOptions ? {
                ...cloneDeep(cleanCssOptions),
                returnPromise: false
              } : undefined).minify({ [stylePath]: { styles: css } });

              if (errors && errors.length) {
                logger.error(`Failed to process ${styleRelativePath}`)
                throw new Error(errors.join('\n'));
              }

              stylesheetCache[stylePath] = styles;
              updateStyleLinkHref();
            }).catch((err) => {
              logger.error(`failed to process ${styleRelativePath}`);
              reject(err);
            });
        }
      } else {
        resolve();
      }
    };

    processNextLink();
  });
}
