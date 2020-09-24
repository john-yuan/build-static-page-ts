#!/usr/bin/env node
import yargs from 'yargs';
import pick from 'lodash/fp/pick';
import buildStaticPage from '../index';
import BuildStaticPageOptions from '../types/BuildStaticPageOptions';

const { argv } = yargs.help(false);
const options = pick([
  'init',
  'build',
  'preview',
  'serve',
  'config',
  'mode',
  'host',
  'port',
  'quiet',
  'help',
  'version'
])(argv);

if (argv['log-level']) {
  options.logLevel = argv['log-level'];
}

if (argv['no-colors']) {
  options.noColors = argv['no-colors'];
}

buildStaticPage(options as BuildStaticPageOptions).then(() => {
  console.log('finished');
}).catch((err) => {
  console.log('exiting');
  console.error(err);
  process.exit(1);
});
