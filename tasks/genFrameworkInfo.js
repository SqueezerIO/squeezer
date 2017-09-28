'use strict';

const fs       = require('fs');
const moment = require('moment');

const settings = require('../package.json');

const versionReleaseDate = moment(new Date()).format('YYYY-MM-DD');

const info = `
window.frameworkVersion = '${settings.version}';
window.frameworkVersionReleaseDate = '${versionReleaseDate}';
`;

fs.writeFileSync(`${__dirname}/../docs/gitbook/js/framework.js`, info);
