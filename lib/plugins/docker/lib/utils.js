'use strict';

const _ = require('lodash');

class DockerUtils {
  constructor(sqz) {
    this.sqz = sqz;
  }

  parseOutput(output) {
    if (!output) {
      return [];
    }

    const lines = output.trim().split('\n');

    if (lines.length < 2) {
      return [];
    }

    const headers = {};

    lines[0].replace(/([A-Z\s]+?)($|\s{2,})/g, (all, name, space, index) => {
      headers[name] = {
        start : index,
        end   : index + all.length
      };

      if (space.length === 0) {
        headers[name].end = undefined;
      }

      return `${name} `;
    });

    const entries = [];
    for (let i = 1; i < lines.length; i += 1) {
      const entry = {};
      _.forEach(headers, (val, key) => {
        if (_.has(headers, key)) {
          entry[key] = lines[i].substring(headers[key].start, headers[key].end).trim();
        }
      });
      entries.push(entry);
    }

    return entries;
  }
}

module.exports = DockerUtils;
