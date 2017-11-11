/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @see https://github.com/TimboKZ/Von
 * @copyright 2017
 * @license MIT
 */

const Joi = require('joi');
const path = require('path');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

const SchemaGenerator = require('./SchemaGenerator');
const CONFIG_NAMES = ['vonrc.js', 'vonrc.json', '.vonrc.js', '.vonrc.json'];

class Von {

    static run(rawOptions) {
        let options;
        Von.validateOptions(rawOptions)
            .then(_options => {
                console.log('VoN');
                options = _options;
                return Von.loadConfig(options);
            })
            .then(config => {
                if (!config) return;
                options = Von.augmentOptionsWithConfig(options, config);
            });
    }

    /**
     * @param {VonOptions} rawOptions
     * @returns {Promise.<VonSchema>}
     */
    static generateSchema(rawOptions) {
        let options, config;
        return Von.validateOptions(rawOptions)
            .then(_options => {
                options = _options;
                return Von.loadConfig(options);
            })
            .then(_config => {
                config = _config;
                return SchemaGenerator.generateSchema(options, config);
            });
    }

    static augmentOptionsWithConfig(options, config) {
        return Object.assign(options, config);
    }

    /**
     * @param {VonOptions} options
     * @returns {Promise.<VonConfig|null>}
     */
    static loadConfig(options) {
        return Promise.resolve()
            .then(() => Von.discoverConfig(options))
            .then(configPath => configPath ? require(configPath) : null);
    }

    /**
     * @param {VonOptions} options
     * @returns {Promise.<string>}
     */
    static discoverConfig(options) {
        if (options.config)
            return Promise.resolve()
                .then(() => fs.accessAsync(options.config, fs.constants.R_OK))
                .then(() => options.config);

        let configPromises = [];
        for (let i = 0; i < CONFIG_NAMES.length; i++) {
            let configPath = path.join(options.directory, CONFIG_NAMES[i]);
            let promise = Promise.resolve()
                .then(() => fs.accessAsync(configPath, fs.constants.R_OK))
                .then(() => configPath);
            configPromises.push(promise);
        }
        return Promise.any(configPromises)
            .catch(() => null);
    }

    /**
     * @param {object} rawOptions
     * @returns {Promise.<VonOptions>}
     */
    static validateOptions(rawOptions) {
        let joiSchema = Joi.object().required().keys({
            directory: Joi.string().required().trim(),
            output: Joi.string().optional().trim(),
            config: Joi.string().optional().trim(),
        });
        return new Promise((resolve, reject) => {
            const result = Joi.validate(rawOptions, joiSchema);
            if (result.error) return reject(new Error(`Invalid options: ${result.error}`));
            resolve(result.value);
        });
    }

}

module.exports = Von;
