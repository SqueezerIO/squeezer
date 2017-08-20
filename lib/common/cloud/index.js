'use strict';


/**
 * Class that manages Cloud operations
 */
class Cloud {
  /**
   * Uploads a file to the Cloud's storage
   *
   * @param {String} localPath - local file path "/tmp/file.zip"
   * @param {String} remotePath - remote file path "upload/path/file.zip"
   * @param {Object} params
   * @returns {Promise}
   *
   * @example
   *
   * this.sqz.cloud.storage.uploadFile('/tmp/file.zip', 'upload/path/file.zip', {
   *     public : true // uploads the file as a public access URL
   * }).then(() => {
   *     // file successfully uploaded
   * });
   *
   * @name this.sqz.cloud.storage.uploadFile
   */

  /**
   * Uploads a directory to the Cloud's storage
   *
   * @param {string} localPath - local path "/tmp/source_dir"
   * @param {string} remotePath - remote path "upload/path"
   * @param {Object} params
   * @returns {Promise}
   *
   * @example
   *
   * this.sqz.cloud.storage.uploadDir('/tmp/source_dir', 'upload/path', {
   *     public : true, // uploads the file as a public access URL
   *     sync   : true  // synchronize directory
   * }).then(() => {
   *     // file successfully uploaded
   * });
   *
   * @name this.sqz.cloud.storage.uploadDir
   */

  /**
   * Retrieve Cloud storage public URL
   *
   * @returns {Promise}
   *
   * @example
   *
   * this.sqz.cloud.storage.getPublicUrl().then((res) => {
   *     console.log(res.publicUrl);
   * });
   *
   * @name this.sqz.cloud.storage.getPublicUrl
   */

  /**
   * Removes a file from to the Cloud's storage
   *
   * @param {string} remotePath - remote path "upload/path"
   * @returns {Promise}
   *
   * @example
   *
   * this.sqz.cloud.storage.removeFile(remotePath).then(() => {
   *     // file successfully removed
   * });
   *
   * @name this.sqz.cloud.storage.removeFile
   */
}

module.exports = Cloud;
