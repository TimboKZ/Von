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
const GalleryBuilder = require('./GalleryBuilder');
const CONFIG_NAMES = ['vonrc.js', 'vonrc.json', '.vonrc.js', '.vonrc.json'];
const TEMPLATE_DIR = path.normalize(path.join(__dirname, '..', 'templates'));
const TEMPLATE_NAMES = ['mini'];
const DEFAULT_TEMPLATE = TEMPLATE_NAMES[0];
const DEFAULT_OUTPUT_FILE = 'index.html';

class Von {

    static run(rawOptions) {
        let options;
        return Von.prepareOptions(rawOptions)
            .then(_options => options = _options)
            .then(() => SchemaGenerator.generateSchema(options))
            .then(schema => GalleryBuilder.buildGallery(options, schema))
            .then(() => 'VoN!')
            .catch(error => console.error(error));
    }

    /**
     * @param {VonOptions} rawOptions
     * @returns {Bluebird.<VonSchema>}
     */
    static generateSchema(rawOptions) {
        let options;
        return Von.prepareOptions(rawOptions)
            .then(_options => options = _options)
            .then(() => SchemaGenerator.generateSchema(options));
    }

    static prepareOptions(rawOptions) {
        let options;
        return Von.validateOptions(rawOptions)
            .then(_options => {
                options = _options;
                return Von.loadConfig(options);
            })
            .then(config => {
                options = Object.assign(options, config);
                if (!options.templatePath) {
                    options.templatePath = path.join(TEMPLATE_DIR, `${options.template}.pug`);
                }
            })
            .then(() => options);
    }

    /**
     * @param {object} rawOptions
     * @returns {Bluebird.<VonOptions>}
     */
    static validateOptions(rawOptions) {
        let joiSchema = Joi.object().required().keys({
            directory: Joi.string().required().trim(),
            output: Joi.string().default(path.join(rawOptions.directory, DEFAULT_OUTPUT_FILE)).trim(),
            template: Joi.string().allow(TEMPLATE_NAMES).default(DEFAULT_TEMPLATE),
            config: Joi.string().optional().trim(),
        });
        return new Promise((resolve, reject) => {
            const result = Joi.validate(rawOptions, joiSchema);
            if (result.error) return reject(new Error(`Invalid options: ${result.error}`));
            resolve(result.value);
        });
    }

    /**
     * @param {VonOptions} options
     * @param {VonConfig} config
     * @returns {VonOptions}
     */
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
            .then(configPath => configPath ? require(configPath) : {})
            .then(config => {
                let joiSchema = Joi.object().required().keys({
                    title: Joi.string().default('Generated gallery | Von'),
                    description: Joi.string().default('Single page gallery created using Von generator.'),
                    definedGroupsOnly: Joi.bool().default(false),
                    orderGroupsAlphabetically: Joi.bool().default(false),
                    recursive: Joi.bool().default(true),
                    groups: Joi.array().default([]),
                });
                let result = Joi.validate(config, joiSchema);
                if (result.error) return reject(new Error(`Invalid config: ${result.error}`));
                return result.value;
            });
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
        return Promise.resolve()
            .then(() => Promise.any(configPromises))
            .catch(() => null);
    }

}

module.exports = Von;
