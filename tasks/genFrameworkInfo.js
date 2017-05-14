'use strict';

const fs       = require('fs');
const appRoot  = require('app-root-path');
const moment = require('moment');

const settings = require(`${appRoot}/package.json`);

const versionReleaseDate = moment(new Date()).format('YYYY-MM-DD');

const info = `
window.frameworkVersion = '${settings.version}';
window.frameworkVersionReleaseDate = '${versionReleaseDate}';
`;

fs.writeFileSync(`${appRoot}/docs/gitbook/js/framework.js`, info);
