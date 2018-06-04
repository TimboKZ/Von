/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @see https://github.com/TimboKZ/Von
 * @copyright 2017
 * @license MIT
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
        if (!rawOptions.directory) throw new Error('`directory` is not specified in the options!');

        let configPath;
        return Promise.resolve()
            .then(() => OptionsParser.discoverConfig(rawOptions))

            // Load the config file and merge it with options. Note that keys from `options` will overwrite config
            .then(_configPath => configPath = _configPath)
            .then(() => configPath ? require(configPath) : {})
            .then(loadedConfig => {
                const mergedOptions = Object.assign({}, loadedConfig, rawOptions);

                // Check if directory was specified in the config. If it is, then it overwrites the default directory
                // from the command line options.
                if (mergedOptions.directory === true) {
                    if (configPath && loadedConfig.directory) {
                        mergedOptions.directory = path.resolve(path.dirname(configPath), loadedConfig.directory);
                    } else {
                        mergedOptions.directory = process.cwd();
                    }
                }

                return mergedOptions;
            })
            .then(options => OptionsParser.validateOptions(options));
    }

    /**
     * If `config` is specified in the options, check that the file is readable and return its path (or throw an error).
     * If `config` is not specified, check if a file with any of the default config names exist and return the path to
     * it. Otherwise, return null.
     *
     * @param {object} rawOptions
     * @param {string} directory Directory in which search for config will start
     * @returns {Bluebird.<string>}
     */
    static discoverConfig(rawOptions, directory) {
        if (rawOptions.config)
            return Promise.resolve()
                .then(() => fs.accessAsync(rawOptions.config, fs.constants.R_OK))
                .then(() => rawOptions.config);

        let configPromises = [];
        for (let i = 0; i < CONFIG_NAMES.length; i++) {
            const directory = rawOptions.directory === true ? process.cwd() : rawOptions.directory;
            let configPath = path.join(directory, CONFIG_NAMES[i]);
            let promise = Promise.resolve()
                .then(() => fs.accessAsync(configPath, fs.constants.R_OK))
                .then(() => configPath);
            configPromises.push(promise);
        }
        return Promise.any(configPromises)
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
        let groupingSingleType = Joi.alternatives().try(
            Joi.string().valid(ALL_GROUPINGS),
            Joi.func().arity(1)
        );
        let groupingArrayType = Joi.array().items(groupingSingleType);
        let groupingType = Joi.alternatives().try(
            groupingSingleType,
            groupingArrayType
        ).default(DEFAULT_GROUPINGS);

        // Either a string specifying the order or a function sorts an array of groups/images.
        let orderType = Joi.alternatives().try(
            Joi.string().valid(ALL_ORDERS),
            Joi.func().arity(1)
        ).default(DEFAULT_ORDER);

        let joiSchema = Joi.object().required().keys({
            directory: Joi.string().required().default(process.cwd()).trim(),
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
            printConfig: Joi.boolean().default(false),
        });

        return new Promise((resolve, reject) => {
            const result = Joi.validate(rawOptions, joiSchema);
            if (result.error) return reject(result.error.toString());

            // Convert `grouping` into an array if it isn't one already
            if (!_.isArray(result.value.grouping)) result.value.grouping = [result.value.grouping];
            resolve(result.value);
        });
    }

}

module.exports = OptionsParser;
