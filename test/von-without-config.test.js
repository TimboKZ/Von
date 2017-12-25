/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @see https://github.com/TimboKZ/Von
 * @copyright 2017
 * @license MIT
 */

const {it, describe} = require('mocha');
const assert = require('chai').assert;
const path = require('path');
const Promise = require('bluebird');
const fse = require('fs-extra');
const constants = require('./test-constants');

const Von = require('../lib/Von');

// Variables for different tests
let outputFile = 'von.html';
let count, vonOptions, outputPath;

describe('Von (without config)', () => {

    it('should not crash and create no output on an empty directory', () =>
        Promise.resolve()
            .then(() => fse.rmdir(constants.emptyDir))
            .then(() => fse.mkdir(constants.emptyDir))
            .then(() => Von.run({directory: constants.emptyDir}))
            .then(() => fse.readdir(constants.emptyDir))
            .then(files => assert.equal(files.length, 0))
    );

    it('should do nothing on a directory with no images', () =>
        Promise.resolve()
            .then(() => fse.readdir(constants.noImagesDir))
            .then(files => count = files.length)
            .then(() => Von.run({directory: constants.noImagesDir}))
            .then(() => fse.readdir(constants.noImagesDir))
            .then(files => assert.equal(files.length, count))
    );

    it('should correctly group images by integer prefix', () =>
        Promise.resolve()
            .then(() => Von.generateSchema({directory: constants.autoGroupsDir}))
            .then(schema => assert.equal(schema.groups.length, 3))
    );

    it('should add some default title and description with images but no config', () =>
        Promise.resolve()
            .then(() => Von.generateSchema({directory: constants.imagesOnlyDir}))
            .then(schema => {
                assert.isDefined(schema.title);
                assert.isNotEmpty(schema.title);
                assert.isDefined(schema.description);
                assert.isNotEmpty(schema.description);
            })
    );

    it('should correctly generate HTML page with images but no config', () =>
        Promise.resolve()
            .then(() => {
                outputPath = path.join(constants.imagesOnlyDir, outputFile);
                vonOptions = {
                    directory: constants.imagesOnlyDir,
                    output: outputPath,
                };
            })
            .then(() => Von.run(vonOptions))
            .then(() => fse.access(outputPath, fse.constants.R_OK))
    );

});
