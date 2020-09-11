import fs from 'fs';

export default function (filepath: string) {
  try {
    return fs.statSync(filepath).isFile();
  } catch (err) {
    // nothing
  }
  return false;
}
