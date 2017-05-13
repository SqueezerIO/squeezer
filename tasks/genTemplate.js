'use strict';

const appRoot = require('app-root-path');
const args    = require('yargs').argv;
const fs      = require('fs');
const yaml    = require('js-yaml');
const _       = require('lodash');
const fsExtra = require('fs-extra');

const pkg        = require(`${appRoot}/package.json`);
const samplesDir = `${appRoot}/lib/plugins/templates/lib/samples`;
const destDir    = `${appRoot}/../squeezer-templates`;

if (!args.template) {
  process.stdout.write('missing template name, --template VALUE');
  process.exit(1);
}

if (!args.key) {
  process.stdout.write('missing deployment key argument, --key VALUE');
  process.exit(1);
}

const template = args.template;

fsExtra.ensureDirSync(`${destDir}/${template}`);

const dataList   = fs.readdirSync(`${samplesDir}/${template}/data`) || [];
const sharedList = yaml.safeLoad(
  fs.readFileSync(`${samplesDir}/${template}/shared.yml`, 'utf8')) || [];

const link = ((source, output) => {
  process.stdout.write(`${source} -> ${output}\n`);
  fsExtra.copySync(source, output);
});

_.forEach(dataList, (src) => {
  link(`${samplesDir}/${template}/data/${src}`, `${destDir}/${template}/${src}`);
});


_.forEach(sharedList, (src) => {
  const xplSrc    = src.split(':');
  const sourceSrc = xplSrc[0];
  const destSrc   = xplSrc[1];
  const srcFile   = sourceSrc.split('/').slice(-1)[0];

  if (srcFile !== 'squeezer.yml') {
    const srcTmp = `${samplesDir}/${template}/../../${sourceSrc}`;
    const outputTmp = `${destDir}/${template}/${destSrc}`;
    link(srcTmp, outputTmp);
  }

  if (srcFile === 'squeezer.yml') {
    const compiledProjectConfig = _.template(
      fs.readFileSync(`${samplesDir}/${template}/../../${sourceSrc}`, 'utf8')
    );

    fs.writeFileSync(
      `${destDir}/${template}/${destSrc}`,
      compiledProjectConfig({
        name    : template,
        key     : args.key,
        version : pkg.version
      }).replace(/\\\\/g, '')
    );
  }
});
