'use strict';

const path = require('path');

exports.cacheBuster = (data) => {
  if (process.env.ASSETS_CHECKSUMS) {
    const checksums = JSON.parse(new Buffer(process.env.ASSETS_CHECKSUMS, 'base64').toString('ascii'));
    for (let srcPath in checksums.assets) {
      const checksum = checksums.assets[srcPath];

      const parsedAssetPath = path.parse(srcPath);
      const finalAssetPath  = `${parsedAssetPath.dir}/${parsedAssetPath.name}-${checksum}${parsedAssetPath.ext}`;
      data                  = data.replace(srcPath, finalAssetPath);
    }
  }

  return data;
};
