import ejs, { Data } from 'ejs';

export default function (filepath: string, data?: Data) {
  return ejs.renderFile(filepath, data);
}
