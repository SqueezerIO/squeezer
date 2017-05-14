'use strict';

/*
 # checkdir

 Compute directory checksum.
 refactored to es6 from https://www.npmjs.com/package/lucy-dirsum ,
 credits to Author Gaspard Bucher gaspard@lucidogen.io
 */

const crypto = require('crypto');
const path   = require('path');
const fs     = require('fs');

const md5 = (self, apath, rpath, clbk, isdir) => {
  self.hash.update(rpath); // add relative path to hash
  // for empty directory and file rename
  if (isdir) {
    fs.readdir(apath, (err, filenames) => {
      if (err) return clbk(err);

      // for digest consistency across platforms
      filenames.sort();
      let i       = 0;
      const len   = filenames.length;
      const parse = (parseErr) => {
        if (parseErr) return clbk(parseErr);
        if (i >= len) return clbk();
        const f = filenames[i];
        i += 1;
        const p = path.join(apath, f);
        // ignore and compute relative path
        const rp  = self.keep(p, f);
        if (!rp) {
          parse();
        } else {
          fs.stat(p, (startErr, stats) => {
            if (startErr) return clbk(startErr);
            if (stats.isDirectory()) {
              md5(self, p, rp, parse, true);
            } else {
              md5(self, p, rp, parse);
            }
          });
        }
      };
      parse();
    });
  } else {
    const stream = fs.createReadStream(apath);

    stream.on('data', (data) => {
      self.hash.update(data);
    });

    stream.on('end', clbk);
  }
};

const IGNORE_DOT_FILES = /^\./;

const DEFAULT_IGNORE_FUNCTION = (ignorePath, filename) => {
  return IGNORE_DOT_FILES.exec(filename);
};

module.exports = (apath, clbk, ignore) => {
  apath      = path.resolve(apath);
  ignore     = ignore || DEFAULT_IGNORE_FUNCTION;
  const plen = apath.length + 1;

  const keepFunc = (keepPath, filename) => {
    const p = keepPath.substring(plen);
    if (ignore(keepPath, filename)) {
      return false;
    }

    return p;
  };

  const self = {
    hash : crypto.createHash('md5'),
    keep : keepFunc
  };

  fs.stat(apath, (err, stats) => {
    if (err) return clbk(err);
    md5(self, apath, '', (md5Err) => {
      if (md5Err) return clbk(md5Err);
      clbk(null, self.hash.digest('hex'));
    }, stats.isDirectory());
  });
};

