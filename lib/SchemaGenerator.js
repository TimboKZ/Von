/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @see https://github.com/TimboKZ/Von
 * @copyright 2017
 * @license MIT
 */

const Promise = require('bluebird');
const path = require('path');
const fs = Promise.promisifyAll(require('fs'));

class SchemaGenerator {

    /**
     * @param {VonOptions} options
     */
    static generateSchema(options) {
        let schema = {};
        return Promise.resolve()
            .then(() => SchemaGenerator.discoverAllImages(options))
            .then(images => {
                if (images.length === 0) {
                    console.warn('No images were found.');
                    return [];
                }
                return SchemaGenerator.generateGroups(options, images);
            })
            .then(groups => schema.groups = groups)
            .then(() => schema);
    }

    static generateGroups(options, images) {
        let groups = [];
        if (!options.groups) {
            groups = images.map(imageName => ({images: [{path: `./${imageName}`}]}));
            return Promise.resolve(groups);
        }
    }

    static discoverAllImages(options) {
        return SchemaGenerator.discoverImagesInDir(options.directory);
    }

    /**
     * @param {string} directory
     * @param {boolean} recurse
     */
    static discoverImagesInDir(directory, recurse = true) {
        let images = [];
        return Promise.resolve()
            .then(() => fs.readdirAsync(directory))
            .then(files => {
                let promises = [];
                files.forEach(fileName => {
                    let fullPath = path.join(directory, fileName);
                    let stats = fs.lstatSync(fullPath);
                    if (recurse && stats.isDirectory()) {
                        let promise = Promise.resolve()
                            .then(() => SchemaGenerator.discoverImagesInDir(fullPath))
                            .then(childImages => images.push({
                                name: fileName,
                                images: childImages,
                            }));
                        promises.push(promise);
                    }
                    else if (stats.isFile() && SchemaGenerator.isImage(fileName)) return images.push(fileName);
                });
                return Promise.all(promises);
            })
            .then(() => images);
    }

    static isImage(fileName) {
        let ext = path.extname(fileName);
        return !!ext.match(/^\.(jpg|png|svg|gif|bmp|tiff)$/);
    }

}

module.exports = SchemaGenerator;
