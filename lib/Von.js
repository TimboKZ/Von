/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @see https://github.com/TimboKZ/Von
 * @copyright 2017
 * @license MIT
 */

const OptionsParser = require('./OptionsParser');
const SchemaGenerator = require('./SchemaGenerator');
const GalleryBuilder = require('./GalleryBuilder');

class Von {

    static run(rawOptions) {
        let options;
        return OptionsParser.prepareOptions(rawOptions)
            .then(_options => options = _options)
            .then(() => SchemaGenerator.generateSchema(options))
            .then(schema => GalleryBuilder.buildGallery(options, schema))
            .then(() => 'VoN!')
    }

    /**
     * @param {VonOptions} rawOptions
     * @returns {Promise.<VonSchema>|Bluebird.<VonSchema>}
     */
    static generateSchema(rawOptions) {
        let options;
        return OptionsParser.prepareOptions(rawOptions)
            .then(_options => options = _options)
            .then(() => SchemaGenerator.generateSchema(options));
    }

}

module.exports = Von;
