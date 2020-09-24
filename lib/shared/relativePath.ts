import { relative } from 'path';

export default function(path: string, from?: string) {
  return relative(from || process.cwd(), path) || '.';
}
