const fse = require('fs-extra');
const path = require('path');
const dist = path.resolve(__dirname, '../dist');
const lib = path.resolve(__dirname, '../lib');

fse.removeSync(dist);
fse.copySync(lib, dist);
