/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @see https://github.com/TimboKZ/Von
 * @copyright 2017
 * @license MIT
 */

const {it, describe} = require('mocha');
const assert = require('chai').assert;
const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');
const constants = require('../test-constants');

const Von = require('../../lib/Von');
const OptionsParser = require('../../lib/OptionsParser');

// Variables for different tests
let configPath = path.join(constants.utilDir, 'vonrc.js');

describe('Mini template', () => {

    assert.equal(configPath.template, 'mini');

    it('should not generate any errors on example config', () =>
        Promise.resolve()
            .then(() => OptionsParser.prepareOptions({directory: constants.utilDir, config: configPath}))
    );

    let emptyOutput = path.join(constants.tempDir, 'empty.html');
    let emptyTemplate = path.join(constants.utilDir, 'empty-template.pug');
    it('should correctly use custom template over built-in templates', () =>
        Promise.resolve()
            .then(() => Von.run({
                directory: constants.imagesOnlyDir,
                templatePath: emptyTemplate,
                output: emptyOutput,
            }))
            .then(() => fs.readFileSync(emptyOutput))
            .then(contents => assert.isEmpty(contents.toString().trim()))
    );

    let nonEmptyOutput = path.join(constants.tempDir, 'non-empty.html');
    it('should correctly use a default built-in template if nothing else is specified', () =>
        Promise.resolve()
            .then(() => Von.run({
                directory: constants.imagesOnlyDir,
                output: nonEmptyOutput,
            }))
            .then(() => fs.readFileSync(nonEmptyOutput))
            .then(contents => assert.isNotEmpty(contents.toString().trim()))
    );

});
