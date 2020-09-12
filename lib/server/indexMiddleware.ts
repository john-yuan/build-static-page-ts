import path from 'path';
import ejs from 'ejs';
import fse from 'fs-extra';
import filesize from 'filesize';
import toString from 'lodash/fp/toString';
import { Request, Response, NextFunction } from 'express';
import dirExists from '../shared/dirExists';

interface DirectoryEntry {
  name: string;
  url: string;
  size: string;
  mtime: string;
  type: 'file' | 'dir' | 'other' | 'error';
}

function formatDate(date: Date) {
  const fillZero = (n: number) => `${n > 10 ? n : ('0' + n)}`;
  const YYYY = date.getFullYear();
  const MM = fillZero(date.getMonth() + 1);
  const DD = fillZero(date.getDate());
  const hh = fillZero(date.getHours());
  const mm = fillZero(date.getMinutes());
  const ss = fillZero(date.getSeconds());

  return `${YYYY}-${MM}-${DD} ${hh}:${mm}:${ss}`;
}

export default function (root: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const filepath = path.resolve(root, req.path.substr(1));

    if (dirExists(filepath)) {
      const dir = fse.readdirSync(filepath);
      const entries: DirectoryEntry[] = [];
      const baseURL = req.path.endsWith('/')
        ? './'
        : `./${req.path.split('/').pop()}/`;

      if (req.path === '/') {
        dir.unshift('.');
      } else {
        dir.unshift('..');
        dir.unshift('.');
      }

      dir.forEach((name) => {
        const entry: DirectoryEntry = {
          name,
          type: 'error',
          size: '-',
          mtime: '-',
          url: `${baseURL}${name}`,
        };

        try {
          const stat = fse.statSync(path.resolve(filepath, name));

          entry.mtime = formatDate(stat.mtime);

          if (stat.isDirectory()) {
            entry.type = 'dir';
            entry.url += '/';
          } else if (stat.isFile()) {
            entry.type = 'file';
            entry.size = filesize(stat.size);
          } else {
            entry.type = 'other';
          }
        } catch (err) {
          entry.type = 'error';
        }

        entries.push(entry);
      });

      const templatePath = path.resolve(__dirname, 'indexMiddleware.template.html');

      ejs.renderFile(templatePath, {
        requestPath: req.path,
        entries
      }).then((html) => {
        res.send(html);
      }).catch((err) => {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain; charset=UTF-8');
        res.send(toString(err));
      });
    } else {
      next();
    }
  }
}
