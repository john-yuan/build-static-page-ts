import path from 'path';
import fse from 'fs-extra';
import prop from 'lodash/fp/prop';
import toString from 'lodash/fp/toString';
import cloneDeep from 'lodash/fp/cloneDeep';
import { Request, Response, NextFunction } from 'express';
import BuildStaticPageContext from '../types/BuildStaticPageContext';
import dirExists from '../shared/dirExists';
import fileExists from '../shared/fileExists';
import renderHtml from '../shared/renderHtml';

function resolveRequestPath(root: string, requestPath: string, index: string[]) {
  const filepath = path.resolve(root, requestPath.substr(1));

  if (dirExists(filepath)) {
    for (let i = 0; i < index.length; ++i) {
      const indexPath = path.resolve(filepath, toString(index[i]));
      if (fileExists(indexPath)) {
        return indexPath;
      }
    }
  }

  return filepath;
}

export default function (root: string, context: BuildStaticPageContext) {
  const { fragmentRegexp, htmlRegexp, index } = context.config.scan;
  const { templateGlobals } = context.config;
  return (req: Request, res: Response, next: NextFunction) => {
    const filepath = resolveRequestPath(root, req.path, index);

    if (fragmentRegexp.test(filepath)) {
      try {
        res.setHeader('Content-Type', 'text/plain; charset=UTF-8');
        res.send(fse.readFileSync(filepath).toString());
      } catch (err) {
        res.statusCode = prop('code')(err) === 'ENOENT' ? 404 : 500;
        res.send(err);
      }
    } else if (htmlRegexp.test(filepath)) {
      if (fileExists(filepath)) {
        renderHtml(filepath, cloneDeep(templateGlobals))
          .then((html) => {
            res.setHeader('Content-Type', 'text/html; charset=UTF-8');
            res.send(html);
          }).catch((err) => {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'text/plain; charset=UTF-8');
            res.send(err.toString());
          });
      } else {
        res.statusCode = 404;
        res.send('Not found');
      }
    } else {
      next();
    }
  }
}
