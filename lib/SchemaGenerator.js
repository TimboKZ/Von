/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @see https://github.com/TimboKZ/Von
 * @copyright 2017
 * @license MIT
 */

const path = require('path');
const _ = require('lodash');
const Promise = require('bluebird');
const sizeOf = require('image-size');

/** @type {FSAsync|Object} */
const fs = Promise.promisifyAll(require('fs'));

class SchemaGenerator {

    /**
     * @param {VonOptions} options
     */
    static generateSchema(options) {
        let schema = {
            title: options.title,
            description: options.description,
        };
        return Promise.resolve()
            .then(() => SchemaGenerator.discoverAllImages(options, options.recursive))
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

    /**
     * @param {VonOptions} options
     * @param {VonSchemaImage[]} images
     * @return {VonSchemaGroup[]}
     */
    static generateGroups(options, images) {
        let groups = [];
        let groupsHash = {};
        let groupIdRegex = /^(\d+)[-_]/;
        for (let i = 0; i < images.length; i++) {
            let image = images[i];
            let groupId = image.name;
            image.path = `./${image.name}`;

            // Extract group prefix if auto-group is enabled
            if (options.autoGroup) {
                let sortCandidate = image.name.match(groupIdRegex);
                if (sortCandidate) {
                    groupId = parseInt(sortCandidate[1]);
                }
            }

            if (groupsHash[groupId]) {
                groupsHash[groupId].images.push(image);
            } else {
                let group = this.createGroup(groupId, [image]);
                groups.push(group);
                groupsHash[groupId] = group;
            }
        }

        // Augment schema groups with data from the config
        for (let i = 0; i < options.groups.length; i++) {
            let group = options.groups[i];
            if (!groupsHash[group.id]) continue;

            let schemaGroup = groupsHash[group.id];
            for (let key in group) {
                if(!schemaGroup[key]) schemaGroup[key] = group[key];
            }
        }

        return _.sortBy(groups, 'id').reverse();
    }

    /**
     * @param {int} id
     * @param {VonSchemaImage[]} images
     * @returns {VonSchemaGroup}
     */
    static createGroup(id, images) {
        return {
            id,
            images,
        };
    }

    static discoverAllImages(options, recursive = true) {
        return SchemaGenerator.discoverImagesInDir(options.directory, recursive);
    }

    /**
     * @param {string} directory
     * @param {boolean} recursive
     * @return {VonSchemaImage[]}
     */
    static discoverImagesInDir(directory, recursive = true) {
        let images = [];
        return Promise.resolve()
            .then(() => fs.readdirAsync(directory))
            .then(files => {
                let promises = [];
                files.forEach(fileName => {
                    let fullPath = path.join(directory, fileName);
                    let stats = fs.lstatSync(fullPath);
                    if (recursive && stats.isDirectory()) {
                        let promise = Promise.resolve()
                            .then(() => SchemaGenerator.discoverImagesInDir(fullPath))
                            .then(childImages => images.push({
                                directory: true,
                                name: fileName,
                                images: childImages,
                            }));
                        promises.push(promise);
                    }
                    else if (stats.isFile() && SchemaGenerator.isImage(fileName)) {
                        return images.push({
                            directory: false,
                            name: fileName,
                            path: fullPath,
                            dimensions: sizeOf(fullPath)
                        });
                    }
                });
                return Promise.all(promises);
            })
            .then(() => _.sortBy(images, 'name'));
    }

    static isImage(fileName) {
        let ext = path.extname(fileName);
        return !!ext.match(/^\.(jpg|png|svg|gif|bmp|tiff)$/);
    }

}

module.exports = SchemaGenerator;
