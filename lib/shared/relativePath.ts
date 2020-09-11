import { sep, relative } from 'path';

export default function(path: string, from?: string) {
  return `.${sep}${relative(from || process.cwd(), path)}`;
}
