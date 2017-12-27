/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @see https://github.com/TimboKZ/Von
 * @copyright 2017
 * @license MIT
 */

const path = require('path');

/** @type {string} */
let configDirPath = path.join(__dirname, 'config');

/** @type {string} */
let galleriesPath = path.join(__dirname, 'galleries');

/**
 * @type {Object.<string, string>}
 */
module.exports = {
    configDirPath,
    galleriesPath,
    emptyDir: path.join(galleriesPath, 'empty-directory'),
    noImagesDir: path.join(galleriesPath, 'no-images'),
    imagesOnlyDir: path.join(galleriesPath, 'images-only'),
    autoGroupsDir: path.join(galleriesPath, 'auto-groups'),
};
