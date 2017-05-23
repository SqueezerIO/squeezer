'use strict';

const fs        = require('fs');
const fsExtra   = require('fs-extra');
const appRoot   = require('app-root-path');
const shelltest = require('shelltest');
const _         = require('lodash');
const colors    = require('colors');
const parallel  = require('mocha.parallel');

module.exports = () => {
  const baseCommand       = 'sqz';
  const templates         = fs.readdirSync(`${appRoot}/lib/plugins/templates/lib/samples`);
  const awsTestProfile    = 'squeezer-test';
  const projectsBuildPath = '/tmp/projects';

  fsExtra.removeSync(projectsBuildPath);
  fsExtra.ensureDirSync(projectsBuildPath);
  fsExtra.ensureSymlinkSync(`${appRoot}/bin/bin.js`, '/usr/bin/sqz');

  const shtest = (cmd, done, regex) => {
    const cb = (err, stdout, stderr) => {
      if (!_.isEmpty(err)) {
        done(new Error());
        process.stdout.write(`\nCOMMAND : ${colors.blue.bold(cmd)}\n`);
        process.stdout.write(colors.red.bold(`\n${stdout || stderr}`));
        process.exit(1);
      } else {
        done();
      }
    };

    return shelltest()
      .cmd(cmd)
      .expect('stdout', regex)
      .expect(0)
      .end((err, stdout, stderr) => cb(err, stdout, stderr));
  };

  const testTemplates = (cmd, regex) => {
    _.forEach(templates, (template) => {
      const templateCmd = cmd.replace(/#template/gi, template);
      it(templateCmd, (done) => {
        shtest(templateCmd, done, regex);
      });
    });
  };

  it('should run the "hwclock" command', (done) => {
    shtest('hwclock -s', done, /.*/);
  });

  it('should run the "list" command', (done) => {
    shtest(`${baseCommand} list`, done, /Available commands/);
  });

  it('should run the "help" command', (done) => {
    shtest(`${baseCommand} help config`, done, /Usage/);
  });

  it('should run the "version" command', (done) => {
    shtest(`${baseCommand} version`, done, /CLI version/);
  });

  parallel('create projects based on all available templates', () => {
    const cmd = `cd ${projectsBuildPath} && ${baseCommand} create --project #template --template #template --email test@squeezer.io --noChecksums true`;
    testTemplates(cmd, /Project successfully created/);
  });

  describe('configuring clouds credentials', () => {
    const cmd = `cd ${projectsBuildPath}/#template && ${baseCommand} config --setting aws_profile --value ${awsTestProfile}`;
    testTemplates(cmd, /Done !/);
  });

  parallel('installing packages on all projects', () => {
    const cmd = `cd ${projectsBuildPath}/#template && ${baseCommand} install`;
    testTemplates(cmd, /Installed !/);
  });

  parallel('development compile current projects', () => {
    const cmd = `cd ${projectsBuildPath}/#template && ${baseCommand} compile`;
    testTemplates(cmd, /Compiled !/);
  });

  parallel('production compile all projects', () => {
    const cmd = `cd ${projectsBuildPath}/#template && ${baseCommand} compile --production`;
    testTemplates(cmd, /Compiled !/);
  });

  parallel('deploying all projects', () => {
    const cmd = `cd ${projectsBuildPath}/#template && ${baseCommand} deploy`;
    testTemplates(cmd, /Saving checksums/);
  });

  parallel('testing all projects', () => {
    const cmd = `sh -c 'cd ${projectsBuildPath}/#template && ${baseCommand} test'`;
    testTemplates(cmd, /.*/);
  });
};
