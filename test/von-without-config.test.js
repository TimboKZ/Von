/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @see https://github.com/TimboKZ/Von
 * @copyright 2017
 * @license MIT
 */

const {it, describe} = require('mocha');
const assert = require('chai').assert;
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const constants = require('./test-constants');

const Von = require('../lib/Von');

describe('Von (without config)', () => {

    it('should not crash and create no output on an empty directory', () =>
        Promise.resolve()
            .then(() => fs.rmdirAsync(constants.emptyDir))
            .then(() => fs.mkdirAsync(constants.emptyDir))
            .then(() => Von.run({directory: constants.emptyDir}))
            .then(() => fs.readdirAsync(constants.emptyDir))
            .then(files => assert.equal(files.length, 0))
    );

    let initialCount = -1;
    it('should do nothing on a directory with no images', () =>
        Promise.resolve()
            .then(() => fs.readdirAsync(constants.noImagesDir))
            .then(files => initialCount = files.length)
            .then(() => Von.run({directory: constants.noImagesDir}))
            .then(() => fs.readdirAsync(constants.noImagesDir))
            .then(files => assert.equal(files.length, initialCount))
    );

    let imageCount = -1;
    it('should correctly initialise groups without a config', () =>
        Promise.resolve()
            .then(() => fs.readdirAsync(constants.imagesOnlyDir))
            .then(files => imageCount = files.length)
            .then(() => Von.generateSchema({directory: constants.imagesOnlyDir}))
            .then(schema => assert.equal(schema.groups.length, imageCount))
    );

});
