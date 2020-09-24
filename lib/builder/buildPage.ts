import cheerio from 'cheerio';
import fse from 'fs-extra';
import cloneDeep from 'lodash/fp/cloneDeep';
import { html as beautifyHtml } from 'js-beautify';
import relativePath from '../shared/relativePath';
import renderHtml from '../shared/renderHtml';
import BuildStaticPageContext from '../types/BuildStaticPageContext';
import processStyles from './processStyles';

export default function (htmlPath: string, context: BuildStaticPageContext) {
  return new Promise<void>((resolve, reject) => {
    const { templateGlobals } = context.config;

    context.logger.info(`process ${relativePath(htmlPath)}`);

    renderHtml(htmlPath, cloneDeep(templateGlobals))
      .then((html) => {
        const $ = cheerio.load(html);
        return processStyles($, htmlPath, context)
          .then(() => {
            fse.outputFileSync(
              htmlPath,
              beautifyHtml($.html(), context.config.htmlBeautifyOptions)
            );
          });
      })
      .then(resolve)
      .catch(reject);
  });
}
