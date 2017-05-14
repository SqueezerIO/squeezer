'use strict';

const appRoot         = require('app-root-path');
const fs              = require('fs');
const _               = require('lodash');
const stripColorCodes = require('stripcolorcodes');

const Help            = require(`${appRoot}/lib/common/cli/help`);
const sqz             = require(`${appRoot}/bin/Squeezer`);

sqz.init();

const CLI = require(`${appRoot}/bin/cli`);

const help = new Help();
// const CLI  = new CommandLineInterface();

// CLI.load(__dirname, '../cli/interface');
// CLI.run();

const spacing      = '    ';
const startHeading = '##';
const commands     = CLI.get();
let cliTree     = '';
const addedCmds = [];
const data      = {};
const summary   = fs.readFileSync(`${appRoot}/docs/SUMMARY.md`, 'utf8');

_.forEach(commands, (mainVal, cmd) => {
  const cmdNames    = cmd.split(':');
  const cmdNamesLen = cmdNames.length;

  _.forEach(cmdNames, (val, index) => {
    const filename     = `cli/${cmdNames[0]}.md`;
    const alphaVal     = _.capitalize(val.replace(/[^a-z0-9]+/gi, ' '));
    let command        = '';
    let output         = null;
    let hashIdentifier = null;


    const init = () => {
      if (index === 0) {
        command = cmdNames[0];
      } else if (index === cmdNamesLen - 1) {
        hashIdentifier = cmdNames.join('_');
        command        = cmdNames.join(':');
      } else {
        hashIdentifier = cmdNames.slice(0, index + 1).join('_');
        command        = cmdNames.slice(0, index + 1).join(':');
      }
    };

    init();

    if (addedCmds.indexOf(command) < 0) {
      output = `${startHeading}${'#'.repeat(index)}` +
        ` ${alphaVal} ${hashIdentifier ? `{#${hashIdentifier}}` : ''}\n\n`;
      if (index === cmdNamesLen - 1) {
        output = `${output}${help.get(commands, cmdNames.join(':'))}`;
      }

      cliTree = `${cliTree}${spacing.repeat(index)}* [${alphaVal}](${filename}${hashIdentifier ? `#${hashIdentifier}` : ''})\n`;

      data[cmdNames[0]] = `${data[cmdNames[0]] || ''}\n${output}`;
      addedCmds.push(command);
    }
  });
});

_.forEach(data, (value, key) => {
  fs.writeFileSync(`${appRoot}/docs/cli/${key}.md`, stripColorCodes(value));
});

const startChars = '### Command Line Interface';
const endChars   = '--';
const re         = new RegExp(`${startChars}[\\s\\S]*?${endChars}`);

fs.writeFileSync(`${appRoot}/docs/SUMMARY.md`, summary.replace(re, `${startChars}\n\n${cliTree}\n\n${endChars}`));
