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
                let groupCount = this.schema.groups.length;
                for (let i = 0; i < groupCount; i++) {
                    let group = this.schema.groups[i];
                    for (let k = 0; k < group.images.length; k++) {
                        let image = group.images[k];
                        image.flex = image.dimensions.width / image.dimensions.height;
                    }
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
                return fn(this.schema);
            });
    }

}

module.exports = MiniTemplate;
