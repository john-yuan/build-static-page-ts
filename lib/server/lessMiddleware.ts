import { Request, Response, NextFunction } from 'express';
import BuildStaticPageContext from '../types/BuildStaticPageContext';

export default function (root: string, context: BuildStaticPageContext) {
  return (req: Request, res: Response, next: NextFunction) => {
    next();
  }
}
