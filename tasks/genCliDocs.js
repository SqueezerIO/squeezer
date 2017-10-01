'use strict';

const fs = require('fs');
const _ = require('lodash');
const stripColorCodes = require('stripcolorcodes');
const yaml = require('js-yaml');

const Help = require('../lib/common/cli/help');
const sqz = require('../bin/Squeezer');

sqz.init();

const CLI = require('../bin/cli');

const help = new Help();

const docsYaml = `${__dirname}/../docs/doc-links.yaml`;
const doc = yaml.safeLoad(fs.readFileSync(docsYaml));
const commands = CLI.get();
const data = {};
const cliTree = {};

_.forEach(commands, (mainVal, cmd) => {
  const cmdNames = cmd.split(':');
  const formatBaseName = cmdNames.join('-');
  const filename = `/docs/cli/${formatBaseName}`;

  _.updateWith(cliTree, `["${cmdNames.join('"]["')}"]`, _.constant(filename));

  let output = `---\ntitle: CLI - ${cmdNames.join(' - ')}\n---\n`;
  output = `${output}${help.get(commands, cmdNames.join(':'))}`;

  // cliTree = `${cliTree}${spacing.repeat(index)}* [${alphaVal}](${filename})\n`;

  data[formatBaseName] = `${data[cmdNames[0]] || ''}${output}`;
  //  eval(`cliTree["${cmdNames.join('"]["')}"] = '${filename}'`)
  // _.forEach(cmdNames, (val, index) => {
  //   if (index < cmdNamesLen) {}
  // });

  // _.forEach(cmdNames, (val, index) => {
  //   const formatBaseName = cmdNames.join('-');
  //   const filename     = `/docs/cli/${formatBaseName}/`;
  //   const alphaVal     = val.replace(/[^a-z0-9]+/gi, ' ');
  //   let command        = '';
  //   let output         = null;

  //   const init = () => {
  //     if (index === 0) {
  //       command = cmdNames[0];
  //     } else if (index === cmdNamesLen - 1) {
  //       command        = cmdNames.join(':');
  //     } else {
  //       command        = cmdNames.slice(0, index + 1).join(':');
  //     }
  //   };

  //   init();

  //   if (addedCmds.indexOf(command) < 0) {
  //     output = `---\ntitle: CLI - ${cmdNames.join(' - ')}\n---\n`;
  //       // ` ${alphaVal} ${hashIdentifier ? `{#${hashIdentifier}}` : ''}\n\n`;
  //     if (index === cmdNamesLen - 1) {
  //       output = `${output}${help.get(commands, cmdNames.join(':'))}`;
  //     }

  //     // cliTree = `${cliTree}${spacing.repeat(index)}* [${alphaVal}](${filename})\n`;
  //     cliTree[alphaVal]

  //     data[formatBaseName] = `${data[cmdNames[0]] || ''}${output}`;
  //     addedCmds.push(command);
  //   }
  // });
});

_.forEach(data, (value, key) => {
  fs.writeFileSync(`${__dirname}/../docs/cli/${key}.md`, stripColorCodes(value));
});

const cliSectionKey = _.findKey(doc, (o) =>  { return o.title === 'CLI'; });
const finalDocObj = {
  title : 'CLI',
  links : cliTree
};

if (cliSectionKey) {
  doc[cliSectionKey] = finalDocObj;
} else {
  doc.push(finalDocObj);
}

fs.writeFileSync(docsYaml, yaml.dump(doc));

// const startChars = 'CLI';
// const endChars   = '<!--END-->';
// const re         = new RegExp(`${startChars}[\\s\\S]*?${endChars}`);

// fs.writeFileSync(`${__dirname}/../docs/SUMMARY.md`, summary.replace(re, `${startChars}\n<!--this section is generated-->\n${cliTree}${endChars}`));
