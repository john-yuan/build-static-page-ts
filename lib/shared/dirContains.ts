import { resolve, sep } from 'path';

export default function (dir: string, path: string) {
  const directory = resolve(dir) + sep;
  const filepath = resolve(path);

  return filepath.indexOf(directory) === 0;
}
