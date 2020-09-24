import less from 'less';
import fse from 'fs-extra';
import autoprefixer, { Options } from 'autoprefixer';
import postcss from 'postcss';

export default function (filepath: string, autoprefixerOptions?: Options) {
  return less.render(fse.readFileSync(filepath).toString(), {
    filename: filepath
  }).then(({ css }) => {
    return postcss([ autoprefixer(autoprefixerOptions) ])
      .process(css, { from: filepath })
      .then(({ css }) => css);
  });
}
