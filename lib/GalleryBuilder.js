/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @see https://github.com/TimboKZ/Von
 * @copyright 2017
 * @license MIT
 */

const pug = require('pug');
const Promise = require('bluebird');

/** @type {FSAsync|Object} */
const fs = Promise.promisifyAll(require('fs'));

class GalleryBuilder {

    /**
     * @param {VonOptions} options
     * @param {VonSchema} schema
     */
    static buildGallery(options, schema) {
        if (schema.groups.length === 0) return Promise.resolve();

        return Promise.resolve()
            .then(() => GalleryBuilder.compileTemplate(options, schema))
            .then(html => fs.writeFileAsync(options.output, html));
    }

    /**
     * @param {VonOptions} options
     * @param {VonSchema} schema
     * @returns {Promise.<string>}
     */
    static compileTemplate(options, schema) {
        return Promise.resolve()
            .then(() => {
                let fn = pug.compileFile(options.templatePath);
                return fn(schema);
            });
    }

}

module.exports = GalleryBuilder;
