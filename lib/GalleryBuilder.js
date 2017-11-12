/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @see https://github.com/TimboKZ/Von
 * @copyright 2017
 * @license MIT
 */

const pug = require('pug');
const Promise = require('bluebird');
const path = require('path');
/** @type {FSAsync|Object} */
const fs = Promise.promisifyAll(require('fs'));
const {TEMPLATE_TYPES, TEMPLATE_MAP} = require('../templates');

class GalleryBuilder {

    /**
     * @param {VonOptions} options
     * @param {VonSchema} schema
     */
    static buildGallery(options, schema) {
        if (schema.groups.length === 0) return Promise.resolve();

        return Promise.resolve()
            .then(() => GalleryBuilder.discoverTemplate(options))
            .then(template => GalleryBuilder.compileTemplate(options, schema, template))
            .then(outputString => outputString ? fs.writeFileAsync(options.output, outputString) : null);
    }

    /**
     * @param {VonOptions} options
     * @returns {Promise.<VonTemplate>|Bluebird.<VonTemplate>}
     */
    static discoverTemplate(options) {
        return new Promise((resolve, reject) => {
            if (options.template) {
                let template = TEMPLATE_MAP[options.template];
                if (!template) reject(new Error(`Built-in template '${options.template}' was not recognised!`));
                else resolve(template);
            } else if (options.templatePath) {
                resolve(GalleryBuilder.discoverCustomTemplate(options.templatePath));
            } else {
                reject(new Error('No template specified!'));
            }
        });

    }

    /**
     * @param {string} templatePath
     * @returns {Promise.<VonTemplate>}
     */
    static discoverCustomTemplate(templatePath) {
        let template = {
            name: path.basename(templatePath),
            type: templatePath.endsWith('.von.js') ? TEMPLATE_TYPES.Von : TEMPLATE_TYPES.Pug,
            path: templatePath,
        };
        return Promise.resolve()
            .then(() => fs.accessAsync(template.path, fs.constants.R_OK))
            .then(() => template);
    }

    /**
     * @param {VonOptions} options
     * @param {VonSchema} schema
     * @param {VonTemplate} template
     * @returns {Promise.<string|null>} Compiled HTML, or null if Von template handled writing data out
     */
    static compileTemplate(options, schema, template) {
        return Promise.resolve()
            .then(() => {
                if (template.type === TEMPLATE_TYPES.Pug) {
                    let fn = pug.compileFile(template.path);
                    return fn(schema);
                } else if (template.type === TEMPLATE_TYPES.Von) {
                    return GalleryBuilder.compileVonTemplate(options, schema, template);
                } else {
                    throw new Error(`Unrecognised template type: ${template.type}`);
                }
            });
    }

    /**
     * @param {VonOptions} options
     * @param {VonSchema} schema
     * @param {VonTemplate} template
     * @returns {Promise.<string|null>}
     */
    static compileVonTemplate(options, schema, template) {
        return Promise.resolve()
            .then(() => {
                let templateClass = require(template.path);
                let vonTemplate = new templateClass(options, schema);
                if (vonTemplate.compile) {
                    return vonTemplate.compile();
                } else {
                    throw new Error(`Von template ${template.name} did not define a 'compile()' method!`);
                }
            });
    }

}

module.exports = GalleryBuilder;
