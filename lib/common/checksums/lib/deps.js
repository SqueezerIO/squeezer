'use strict';

const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const precinct = require('precinct');

class Deps {
  constructor(sqz) {
    this.sqz = sqz;
  }

  crawl(data, file) {
    const pathParse = path.parse(file);

    let deps = [];

    if (pathParse.ext === '.js') {
      deps = this.javascriptCrawler(data, pathParse.dir);
    }

    return deps;
  }

  javascriptCrawler(data, dir) {
    const localRegex = /^.\.\/|^.\/|^\//;

    const files = [];
    const packages = [];

    const umdData = precinct(data);

    _.forEach(umdData, (val) => {
      if (val.match(localRegex)) {
        const permutations = [
          path.normalize(path.join(dir, `${val}.js`)),
          path.normalize(path.join(dir, val, 'index.js'))
        ];

        _.forEach(permutations, (permutation) => {
          if (fs.existsSync(permutation)) {
            files.push(permutation);
          }
        });
      } else {
        if (!this.packages) {
          this.packages = JSON.parse(fs.readFileSync(path.join(this.sqz.vars.project.path, 'package.json'))).dependencies;
        }

        packages.push({
          pkg : val,
          version : this.packages[val]
        });
      }
    });

    return {
      files : files,
      packages : packages
    };
  }
}

module.exports = Deps;
