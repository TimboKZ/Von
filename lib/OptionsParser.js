/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2017
 * @license GPL-3.0
 */

const Joi = require('joi');
const _ = require('lodash');
const path = require('path');
const Promise = require('bluebird');
/** @type {FSAsync|object} */
const fs = Promise.promisifyAll(require('fs'));

const {TEMPLATE_NAMES, DEFAULT_TEMPLATE} = require('../templates');

const {DEFAULT_OUTPUT_FILE, CONFIG_NAMES, ALL_GROUPINGS, DEFAULT_GROUPINGS, ALL_ORDERS, DEFAULT_ORDER} = require('./typedef');

class OptionsParser {

    /**
     * @param {object} rawOptions
     * @returns {Bluebird.<VonOptions>}
     */
    static prepareOptions(rawOptions) {
        // Make sure directory is specified, we don't want to run on a random directory
        if (!_.isString(rawOptions.directory)) throw new Error('`directory` is not specified in the options!');

        return Promise.resolve()
            .then(() => OptionsParser.discoverConfig(rawOptions))

            // Load the config file and merge it with options. Note that keys from `options` will overwrite config
            .then(configPath => configPath ? require(configPath) : {})
            .then(loadedConfig => Object.assign({}, loadedConfig, rawOptions))
            .then(options => OptionsParser.validateOptions(options));
    }

    /**
     * If `config` is specified in the options, check that the file is readable and return its path (or throw an error).
     * If `config` is not specified, check if a file with any of the default config names exist and return the path to
     * it. Otherwise, return null.
     *
     * @param {object} rawOptions
     * @returns {Promise.<string>}
     */
    static discoverConfig(rawOptions) {
        if (rawOptions.config)
            return Promise.resolve()
                .then(() => fs.accessAsync(rawOptions.config, fs.constants.R_OK))
                .then(() => rawOptions.config);

        let configPromises = [];
        for (let i = 0; i < CONFIG_NAMES.length; i++) {
            let configPath = path.join(rawOptions.directory, CONFIG_NAMES[i]);
            let promise = Promise.resolve()
                .then(() => fs.accessAsync(configPath, fs.constants.R_OK))
                .then(() => configPath);
            configPromises.push(promise);
        }
        return Promise.resolve()
            .then(() => Promise.any(configPromises))
            .catch(() => null);
    }

    /**
     * Checks `rawOptions` against the defined Joi schema. Assumes `rawOptions` already has `directory` defined.
     *
     * @param {object} rawOptions
     * @returns {Bluebird.<VonOptions>}
     */
    static validateOptions(rawOptions) {
        /*
        Grouping type - a single object or an array of objects that are either a string (one of the built-in grouping
        types) or a function that takes a `VonImage` and returns a group ID or `null`.
         */
        let groupingSingleType = Joi.alternatives(
            Joi.string().lowercase().allow(ALL_GROUPINGS),
            Joi.func().arity(1)
        );
        let groupingArrayType = Joi.array().items(groupingSingleType);
        let groupingType = Joi.alternatives(
            groupingSingleType,
            groupingArrayType
        ).default(DEFAULT_GROUPINGS);

        // Either a string specifying the order or a function that compares 2 objects (for sorting).
        let orderType = Joi.alternatives(
            Joi.string().lowercase().allow(ALL_ORDERS),
            Joi.func().arity(2)
        ).default(DEFAULT_ORDER);

        let joiSchema = Joi.object().required().keys({
            directory: Joi.string().required().trim(),
            output: Joi.string().default(path.join(rawOptions.directory, DEFAULT_OUTPUT_FILE)).trim(),
            templatePath: Joi.string().optional(),
            template: Joi.string().allow(TEMPLATE_NAMES).default(DEFAULT_TEMPLATE),
            config: Joi.string().optional().trim(),
            title: Joi.string().default('Generated gallery | Von'),
            description: Joi.string().default('Single page gallery created using Von generator.'),
            definedGroupsOnly: Joi.bool().default(false),
            recursive: Joi.bool().default(false),
            grouping: groupingType,
            groupOrder: orderType,
            imageOrder: orderType,
            schema: Joi.object().default({}),
            groups: Joi.array().default([]),
        });

        return new Promise((resolve, reject) => {
            const result = Joi.validate(rawOptions, joiSchema);
            if (result.error) return reject(new Error(`Invalid options: ${result.error}`));

            // Convert `grouping` into an array if it isn't one already
            if (!_.isArray(result.value.grouping)) result.value.grouping = [result.value.grouping];
            resolve(result.value);
        });
    }

}

module.exports = OptionsParser;
