/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @see https://github.com/TimboKZ/Von
 * @copyright 2017
 * @license MIT
 */

const {it, describe} = require('mocha');
const path = require('path');
const Promise = require('bluebird');
const constants = require('./test-constants');

const OptionsParser = require('../lib/OptionsParser');

// Variables for different tests
let configPath = path.join(constants.configDirPath, 'vonrc.js');

describe('Example Von config', () => {

    it('should not generate any errors', () =>
        Promise.resolve()
            .then(() => OptionsParser.prepareOptions({directory: constants.configDirPath, config: configPath}))
            .then(() => null)
    );

});
