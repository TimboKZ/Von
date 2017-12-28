/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @see https://github.com/TimboKZ/Von
 * @copyright 2017
 * @license MIT
 */

const path = require('path');

const utilDir = path.join(__dirname, 'util');
const galleriesDir = path.join(__dirname, 'galleries');
const tempDir = path.join(__dirname, 'temp');

/**
 * @type {Object.<string, string>}
 */
module.exports = {
    tempDir,
    utilDir,
    galleriesDir,
    emptyDir: path.join(galleriesDir, 'empty-directory'),
    noImagesDir: path.join(galleriesDir, 'no-images'),
    imagesOnlyDir: path.join(galleriesDir, 'images-only'),
    autoGroupsDir: path.join(galleriesDir, 'auto-groups'),
};
