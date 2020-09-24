import fs from 'fs';
import { resolve } from 'path';

export default function (dir: string, callback: (filepath: string) => void) {
  const walkDirSync = (dir: string, callback: (filepath: string) => void) => {
    fs.readdirSync(dir).forEach((filename) => {
      const filepath = resolve(dir, filename);
      const stat = fs.statSync(filepath);
      if (stat.isFile()) {
        callback(filepath);
      } else if (stat.isDirectory()) {
        walkDirSync(filepath, callback);
      }
    });
  };
  walkDirSync(resolve(dir), callback);
}
