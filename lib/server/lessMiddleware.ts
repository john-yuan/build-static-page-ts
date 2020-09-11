import path from 'path';
import cloneDeep from 'lodash/fp/cloneDeep';
import toString from 'lodash/fp/toString';
import { Request, Response, NextFunction } from 'express';
import BuildStaticPageContext from '../types/BuildStaticPageContext';
import renderLess from '../shared/renderLess';

export default function (root: string, context: BuildStaticPageContext) {
  const { autoprefixerOptions } = context.config;
  return (req: Request, res: Response, next: NextFunction) => {
    const filepath = path.resolve(root, req.path.substr(1));

    if (/\.less$/i.test(filepath)) {
      renderLess(filepath, cloneDeep(autoprefixerOptions))
        .then((css) => {
          res.setHeader('Content-Type', 'text/css; charset=UTF-8');
          res.send(css);
        }).catch((err) => {
          res.statusCode = 500;
          res.statusMessage = 'ERR_RENDER_LESS: Open link for error message';
          res.setHeader('Content-Type', 'text/plain; charset=UTF-8');
          res.send(toString(err));
        });
    } else {
      next();
    }
  }
}
