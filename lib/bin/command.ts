#!/usr/bin/env node
import yargs from 'yargs';
import pick from 'lodash/fp/pick';
import buildStaticPage from '../index';
import BuildStaticPageOptions from '../types/BuildStaticPageOptions';

const { argv } = yargs.help(false);
const options = pick([
  'init',
  'build',
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

buildStaticPage(options as BuildStaticPageOptions);
