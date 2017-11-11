/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @see https://github.com/TimboKZ/Von
 * @copyright 2017
 * @license MIT
 */

const _ = require('lodash');
const Promise = require('bluebird');
const path = require('path');
const fs = Promise.promisifyAll(require('fs'));
const sizeOf = require('image-size');

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

    static generateGroups(options, images) {
        let schemaGroups = [];
        for (let i = 0; i < options.groups.length; i++) {
            let configGroup = options.groups[i];
            let {schemaGroup, leftoverImages} = SchemaGenerator.generateGroup(options, configGroup, images);
            schemaGroups.push(schemaGroup);
            images = leftoverImages;
        }

        if (!options.definedGroupsOnly) {
            let newGroups = images.map(imageObject => {
                if (imageObject.directory) {
                    // TODO: Add recursively
                } else {
                    let images = [{
                        path: `./${imageObject.name}`,
                        dimensions: imageObject.dimensions,
                    }];
                    return {
                        name: imageObject.name,
                        images,
                    };
                }
            });
            schemaGroups = schemaGroups.concat(newGroups);
        }
        if (options.orderGroupsAlphabetically) schemaGroups = _.sortBy(schemaGroups, 'name').reverse();
        return Promise.resolve(schemaGroups);
    }

    /**
     * @param {VonOptions} options
     * @param {VonConfigGroup} configGroup
     * @param images
     */
    static generateGroup(options, configGroup, images) {
        let schemaGroup = Object.assign({}, configGroup);

        let basePath = '';
        let dir = images;
        let dirParts = [];
        if (configGroup.folder && configGroup.folder.trim() !== '') {
            dirParts = path.normalize(configGroup.folder).trim().split(path.sep);

            // Descend to target folder
            let i = 0;
            let found = false;
            let part = dirParts.shift();
            while (i < dir.length) {
                let dirFile = dir[i];
                if (dirFile.directory && dirFile.name === part) {
                    basePath = path.join(basePath, part);
                    dir = dirFile.images;
                    if (dirParts.length === 0) {
                        found = true;
                        break;
                    }
                    part = dirParts.shift();
                }
                i++;
            }
            if (!found) return null;
        }

        let {leftover, schemaIm} = SchemaGenerator.searchForGroupMembersRecursively(options, basePath, configGroup, dir);
        schemaGroup.images = schemaIm;
        return {schemaGroup, leftoverImages: leftover};
    }

    static searchForGroupMembersRecursively(options, basePath, configGroup, images) {
        let check;
        if (configGroup.regex) {
            check = (name) => !!name.match(configGroup.regex);
        } else if (configGroup.prefix) {
            check = (name) => name.startsWith(configGroup.prefix);
        }
        else {
            check = () => true;
        }

        let leftoverImages = [];
        let schemaImages = [];
        for (let i = 0; i < images.length; i++) {
            let imageFile = images[i];
            let fullPath = path.join(basePath, imageFile.name);
            if (imageFile.directory) {
                let {leftover, schemaIm} = SchemaGenerator.searchForGroupMembersRecursively(options, fullPath, configGroup, imageFile.images);
                if (leftover.length > 0) {
                    let leftoverFile = Object.assign({}, imageFile);
                    leftoverFile.images = leftover;
                    leftoverImages.push(leftoverFile);
                }
                schemaImages = schemaImages.concat(schemaIm);
            } else {
                if (check(imageFile.name)) schemaImages.push({
                    path: `./${fullPath}`,
                    dimensions: imageFile.dimensions,
                });
                else leftoverImages.push(imageFile);
            }
        }

        return {leftover: leftoverImages, schemaIm: schemaImages};
    }

    static discoverAllImages(options, recursive = true) {
        return SchemaGenerator.discoverImagesInDir(options.directory, recursive);
    }

    /**
     * @param {string} directory
     * @param {boolean} recursive
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
