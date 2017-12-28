/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @see https://github.com/TimboKZ/Von
 * @copyright 2017
 * @license MIT
 */

const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const Promise = require('bluebird');
const sizeOf = require('image-size');
const Denque = require('denque');
const {Grouping, Order} = require('./typedef');

class SchemaGenerator {

    /**
     * @param {VonOptions} options
     * @return {Bluebird.<VonSchema>}
     */
    static generateSchema(options) {
        let schema = {
            title: options.title,
            description: options.description,
        };
        let generator = new SchemaGenerator(options);
        return Promise.resolve()
            .then(() => generator.discoverImages())
            .then(images => {
                if (images.length === 0) {
                    console.warn('No images were found.');
                    return [];
                }
                return generator.generateGroupsNew(images);
            })
            .then(groups => generator.sortGroupsAndImages(groups))
            .then(groups => schema.groups = groups)

            // Merge generated schema with schema from the config
            .then(() => Object.assign({}, schema, options.schema));
    }

    /**
     * @param {VonOptions} options
     */
    constructor(options) {
        this.options = options;

        // Prepare the ID extracting function
        let idExtractors = SchemaGenerator.convertGroupingToFunctions(this.options.grouping);

        /** @param {VonSchemaImage} image */
        this.extractGroupId = image => {
            for (let extractId of idExtractors) {
                let id = extractId(image);
                if (id) return id;
            }
            return null;
        };
    }

    static convertGroupingToFunctions(groupingArray) {
        let functions = [];
        for (let grouping of groupingArray) {
            switch (grouping) {
                case Grouping.Folder:
                    functions.push(image => {
                        if (!image.dir) return null;
                        let parts = image.dir.split(path.sep);
                        if (parts.length > 0 && parts[0]) return parts[0];
                        else return null;
                    });
                    break;
                case Grouping.IntegerPrefix:
                    functions.push(image => {
                        let groupIdRegex = /^(\d+)[-_]/;
                        let match = image.base.match(groupIdRegex);
                        if (match) return parseInt(match[1]);
                        else return null;
                    });
                    break;
                case Grouping.StringPrefix:
                    functions.push(image => {
                        let groupIdRegex = /^([^-_]+)[-_]/;
                        let match = image.base.match(groupIdRegex);
                        if (match) return match[1];
                        else return null;
                    });
                    break;
                default:
                    functions.push(grouping);
            }
        }
        return functions;
    }

    /**
     * @return {VonSchemaImage[]}
     */
    discoverImages() {
        let queue = new Denque(64);
        this.discoverImagesRecursively(queue, this.options.directory);
        return queue.toArray();
    }

    /**
     * Discovers images and stores them in the specified queue.
     *
     * @param {Denque} queue
     * @param {string} dirPath
     * @return {Denque.<VonSchemaImage>}
     */
    discoverImagesRecursively(queue, dirPath) {
        let files = fs.readdirSync(dirPath);
        for (let fileName of files) {
            let fullPath = path.join(dirPath, fileName);
            let stats = fs.lstatSync(fullPath);
            if (stats.isDirectory() && this.options.recursive) {
                this.discoverImagesRecursively(queue, fullPath);
            } else if (stats.isFile() && SchemaGenerator.isImage(fileName)) {
                queue.push(this.prepareImage(fullPath));
            }
        }
    }

    /**
     * @param {string} imagePath
     * @return {VonSchemaImage}
     */
    prepareImage(imagePath) {
        let relativePath = path.relative(this.options.directory, imagePath);
        let parts = path.parse(relativePath);
        let dimensions = sizeOf(imagePath);
        let outputParts = path.parse(this.options.output);
        let pathRelativeToOutput = path.relative(outputParts.dir, imagePath);
        let url = `./${pathRelativeToOutput.replace(path.sep, '/')}`;
        return {
            path: relativePath,
            dir: parts.dir,
            base: parts.base,
            name: parts.name,
            width: dimensions.width,
            height: dimensions.height,
            type: dimensions.type,
            url,
        };
    }

    /**
     * @param {VonSchemaImage[]} images
     * @return {VonSchemaGroup[]}
     */
    generateGroupsNew(images) {
        let definedGroupsLookup = {};
        for (let group of this.options.groups) {
            definedGroupsLookup[group.id] = true;
        }

        let groups = [];
        let groupsHash = {};
        for (let image of images) {

            let groupId = this.extractGroupId(image);
            if (this.options.definedGroupsOnly && !definedGroupsLookup[groupId]) continue;

            let group = groupsHash[groupId];
            if (!group) {
                group = SchemaGenerator.createGroup(groupId);
                groups.push(group);
                groupsHash[groupId] = group;
            }

            group.images.push(image);
        }

        // Augment schema groups with data from the config
        for (let group of this.options.groups) {
            if (!groupsHash[group.id]) continue;

            let schemaGroup = groupsHash[group.id];
            for (let key in group) {
                if (!schemaGroup[key]) schemaGroup[key] = group[key];
            }
        }

        return groups;
    }

    /**
     * @param {VonSchemaGroup[]} groups
     * @return {VonSchemaGroup[]}
     */
    sortGroupsAndImages(groups) {

        for (let group of groups) {

            let images = group.images;
            let sortedImages;
            switch (this.options.imageOrder) {
                case Order.Asc:
                    sortedImages = _.sortBy(images, 'name');
                    break;
                case Order.Desc:
                    sortedImages = _.sortBy(images, 'name').reverse();
                    break;
                case Order.None:
                    sortedImages = images;
                    break;
                default:
                    sortedImages = this.options.imageOrder(images);
            }
            group.images = sortedImages;

        }

        let sortedGroups;
        switch (this.options.groupOrder) {
            case Order.Asc:
                sortedGroups = _.sortBy(groups, 'id');
                break;
            case Order.Desc:
                sortedGroups = _.sortBy(groups, 'id').reverse();
                break;
            case Order.None:
                sortedGroups = groups;
                break;
            default:
                sortedGroups = this.options.groupOrder(groups);
        }

        return sortedGroups;
    }

    /**
     * @param {string|number} id
     * @param {VonSchemaImage[]} images
     * @returns {VonSchemaGroup}
     */
    static createGroup(id, images = []) {
        return {
            id,
            images,
        };
    }

    static isImage(fileName) {
        let ext = path.extname(fileName);
        return !!ext.match(/^\.(jpg|png|svg|gif|bmp|tiff)$/i);
    }

}

module.exports = SchemaGenerator;
