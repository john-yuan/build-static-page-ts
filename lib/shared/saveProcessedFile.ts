import crypto from 'crypto';
import path from 'path';
import fse from 'fs-extra';
import fileExists from './fileExists';

interface Result {
  filepath: string;
  filename: string;
  existing: string[];
  savedBefore: boolean;
}

export default function (
  dirname: string,
  name: string,
  content: string | Buffer,
  filenameTemplate: string,
  defaultHashLength: number,
) {
  return new Promise<Result>((resolve) => {
    let hash = '';

    const getHash = () => {
      if (!hash) {
        hash = crypto.createHash('md5').update(content).digest('hex');
      }
      return hash;
    };

    const targetName = filenameTemplate.replace(/\[hash(:\d+)?]/g, (match, size) => {
      let hashLength = +(size ? size.substr(1) : defaultHashLength);
      if (hashLength <= 0) {
        hashLength = defaultHashLength;
      }
      return getHash().substr(0, hashLength);
    }).replace(/\[name]/g, name);

    const existing: string[] = [];
    let counter = 0;
    let filename = targetName;
    let filepath = '';
    let savedBefore = false;
    let tryNextFilename = true;

    while (tryNextFilename) {
      filepath = path.resolve(dirname, filename);

      if (!fse.pathExistsSync(filepath)) {
        tryNextFilename = false;
        break;
      }

      if (fileExists(filepath)) {
        const existingFile = fse.readFileSync(filepath);
        if (typeof content === 'string') {
          if (existingFile.toString() === content) {
            savedBefore = true;
            tryNextFilename = false;
            break;
          }
        }
        if (Buffer.isBuffer(content)) {
          if (Buffer.compare(content, existingFile) === 0) {
            savedBefore = true;
            tryNextFilename = false;
            break;
          }
        }
      }

      existing.push(filepath);
      counter += 1;
      filename = `${counter}.${targetName}`;
    }

    if (!savedBefore) {
      fse.outputFileSync(filepath, content);
    }

    resolve({
      filename,
      filepath,
      existing,
      savedBefore,
    });
  });
}
