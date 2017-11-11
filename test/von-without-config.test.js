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
const path = require('path');
const constants = require('./test-constants');

const Von = require('../lib/Von');

describe('Von (without config)', () => {

    it('should not crash and create no output on an empty directory', () =>
        Promise.resolve()
            .then(() => fs.rmdirAsync(constants.emptyDirectory))
            .then(() => fs.mkdirAsync(constants.emptyDirectory))
            .then(() => Von.run({directory: constants.emptyDirectory}))
            .then(() => fs.readdirAsync(constants.emptyDirectory))
            .then(files => assert.equal(files.length, 0))
    );

    let initialCount = -1;
    it('should do nothing on a directory with no images', () =>
        Promise.resolve()
            .then(() => fs.readdirAsync(constants.directoryWithNoImages))
            .then(files => initialCount = files.length)
            .then(() => Von.run({directory: constants.directoryWithNoImages}))
            .then(() => fs.readdirAsync(constants.directoryWithNoImages))
            .then(files => assert.equal(files.length, initialCount))
    );

});
