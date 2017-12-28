/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @see https://github.com/TimboKZ/Von
 * @copyright 2017
 * @license MIT
 *
 * This is a template script for `mini`, a built-in Von template.
 */

const Promise = require('bluebird');
const path = require('path');
const pug = require('pug');

const PUG_TEMPLATE = path.join(__dirname, 'mini.pug');

class MiniTemplate {

    /**
     * This constructor is called by the parent Von process.
     *
     * @param {VonOptions} options
     * @param {VonSchema} schema
     */
    constructor(options, schema) {
        this.options = options;
        this.schema = schema;

        // Default values
        this.maxImagesPerRow = 6;
    }

    /**
     * This function will be called by the parent Von process. It can be synchronous or asynchronous, this is up to you.
     * If you chose to make it asynchronous, make sure it returns a Promise.
     *
     * @return {Promise.<string|null>}
     */
    compile() {
        return Promise.resolve()
            .then(() => this.processSchema())
            .then(() => this.compileTemplate())

            // If you pass a string to Von, it will write it to `options.output` file. If you pass `null,` Von will
            // simply ignore the return value and carry on WITHOUT writing anything. In the latter case, Von will assume
            // that you have handled writing to file yourself.
            .then(compiledTemplate => compiledTemplate);
    }

    /**
     * @return {Promise.<VonSchema>}
     */
    processSchema() {
        return Promise.resolve()
            .then(() => {
                for (let group of this.schema.groups) {
                    // Calculate an optimal amount of images per row
                    let count = group.images.length;
                    let maxLeftover = -Infinity;
                    let imagesPerRow = -1;
                    for(let currImagesPerRow = this.maxImagesPerRow; currImagesPerRow > Math.floor(this.maxImagesPerRow * 0.75); currImagesPerRow--) {
                        if (count % currImagesPerRow > maxLeftover) {
                            maxLeftover = count % imagesPerRow;
                            imagesPerRow = currImagesPerRow;
                        }
                    }

                    let rows = [];
                    let totalRows = Math.ceil(count / imagesPerRow);
                    for (let i = 0; i < totalRows; i++) {
                        rows.push(group.images.slice(i * imagesPerRow, (i + 1) * imagesPerRow - 1));
                    }
                    console.log(rows);
                    group.rows = rows;
                }
            });
    }

    /**
     * @return {Promise.<string>}
     */
    compileTemplate() {
        return Promise.resolve()
            .then(() => {
                let fn = pug.compileFile(PUG_TEMPLATE);
                return fn({schema: this.schema});
            });
    }

}

module.exports = MiniTemplate;
