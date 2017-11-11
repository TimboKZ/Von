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
            .then(files => SchemaGenerator.generateGroups(options, files))
            .then(groups => schema.groups = groups)
            .then(() => schema);
    }

    static generateGroups(options, files) {
        let groups = [];
        if (!options.groups) {
            groups = files.map(file => ({files: [file]}));
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
        let dirFiles = [];
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
                            .then(childFiles => dirFiles.push({
                                name: fileName,
                                files: childFiles,
                            }));
                        promises.push(promise);
                    }
                    else if (stats.isFile() && SchemaGenerator.isImage(fileName)) return dirFiles.push(fileName);
                });
                return Promise.all(promises);
            })
            .then(() => dirFiles);
    }

    static isImage(fileName) {
        let ext = path.extname(fileName);
        return !!ext.match(/^\.(jpg|png|svg|gif|bmp|tiff)$/);
    }

}

module.exports = SchemaGenerator;
