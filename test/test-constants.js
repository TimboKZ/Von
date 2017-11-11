/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @see https://github.com/TimboKZ/Von
 * @copyright 2017
 * @license MIT
 */

const path = require('path');

let galleriesPath = path.join(__dirname, 'galleries');

module.exports = {
    galleriesPath,
    emptyDirectory: path.join(galleriesPath, 'empty-directory'),
    directoryWithNoImages: path.join(galleriesPath, 'no-images'),
};
