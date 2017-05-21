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

  const cb = (err, stdout, stderr, cmd, done) => {
    if (!_.isEmpty(err)) {
      done(new Error());
      process.stdout.write(`\nCOMMAND : ${colors.blue.bold(cmd)}\n`);
      process.stdout.write(colors.red.bold(`\n${stdout}`));
      process.exit(1);
    } else {
      done();
    }
  };

  it('should run the "list" command', (done) => {
    const cmd = `${baseCommand} list`;
    shelltest()
      .cmd(cmd)
      .expect('stdout', /Available commands/)
      .expect(0)
      .end((err, stdout, stderr) => cb(err, stdout, stderr, cmd, done));
  });

  it('should run the "help" command', (done) => {
    const cmd = `${baseCommand} help config`;
    shelltest()
      .cmd(cmd)
      .expect('stdout', /Usage/)
      .expect(0)
      .end((err, stdout, stderr) => cb(err, stdout, stderr, cmd, done));
  });

  it('should run the "version" command', (done) => {
    const cmd = `${baseCommand} version`;
    shelltest()
      .cmd(cmd)
      .expect('stdout', /CLI version/)
      .expect(0)
      .end(done);
  });

  parallel('create projects based on all available templates', () => {
    _.forEach(templates, (template) => {
      const cmd = `cd ${projectsBuildPath} && ${baseCommand} create --project ${template} --template ${template} --email test@squeezer.io --noChecksums true`;
      it(`creating test project ${template}\n     Running command : ${cmd}`, (done) => {
        shelltest()
          .cmd(cmd)
          .expect('stdout', /Project successfully created/)
          .expect(0)
          .end((err, stdout, stderr) => cb(err, stdout, stderr, cmd, done));
      });
    });
  });

  describe('configuring credentials', () => {
    _.forEach(templates, (template) => {
      const cmd = `cd ${projectsBuildPath}/${template} && ${baseCommand} config --setting aws_profile --value ${awsTestProfile}`;
      it(`configuring AWS profile on project ${template}\n     Running command : ${cmd}`, (done) => {
        shelltest()
          .cmd(cmd)
          .expect('stdout', /Done !/)
          .expect(0)
          .end((err, stdout, stderr) => cb(err, stdout, stderr, cmd, done));
      });
    });
  });

  parallel('installing packages on all projects', () => {
    _.forEach(templates, (template) => {
      const cmd = `cd ${projectsBuildPath}/${template} && ${baseCommand} install`;
      it(`installing packages for project ${template}\n     Running command : ${cmd}`, (done) => {
        shelltest()
          .cmd(cmd)
          .expect('stdout', /Installed !/)
          .expect(0)
          .end((err, stdout, stderr) => cb(err, stdout, stderr, cmd, done));
      });
    });
  });

  parallel('development compile all projects', () => {
    _.forEach(templates, (template) => {
      const cmd = `cd ${projectsBuildPath}/${template} && ${baseCommand} compile`;
      it(`compiling project ${template}\n     Running command : ${cmd}`, (done) => {
        shelltest()
          .cmd(cmd)
          .expect('stdout', /Compiled !/)
          .expect(0)
          .end((err, stdout, stderr) => cb(err, stdout, stderr, cmd, done));
      });
    });
  });

  parallel('production compile all projects', () => {
    _.forEach(templates, (template) => {
      const cmd = `cd ${projectsBuildPath}/${template} && ${baseCommand} compile --production`;
      it(`compiling project ${template}\n     Running command : ${cmd}`, (done) => {
        shelltest()
          .cmd(cmd)
          .expect('stdout', /Compiled !/)
          .expect(0)
          .end(done);
      });
    });
  });

  parallel('deploying all projects', () => {
    _.forEach(templates, (template) => {
      const cmd = `cd ${projectsBuildPath}/${template} && ${baseCommand} deploy`;
      it(`deploying project ${template}\n     Running command : ${cmd}`, (done) => {
        shelltest()
          .cmd(cmd)
          .expect('stdout', /Saving checksums/)
          .expect(0)
          .end((err, stdout, stderr) => cb(err, stdout, stderr, cmd, done));
      });
    });
  });

  parallel('testing all projects', () => {
    _.forEach(templates, (template) => {
      const cmd = `sh -c 'cd ${projectsBuildPath}/${template} && ${baseCommand} test'`;
      it(`testing project ${template}\n     Running command : ${cmd}`, (done) => {
        shelltest()
          .cmd(cmd)
          .expect(0)
          .end((err, stdout, stderr) => cb(err, stdout, stderr, cmd, done));
      });
    });
  });
};
