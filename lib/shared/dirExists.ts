import fs from 'fs';

export default function (filepath: string) {
  try {
    return fs.statSync(filepath).isDirectory();
  } catch (err) {
    // nothing
  }
  return false;
}
