/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @see https://github.com/TimboKZ/Von
 * @copyright 2017
 * @license MIT
 */

const Joi = require('joi');

class Von {

    static run(rawOptions) {
        let options = Von.validateOptions(rawOptions);
        console.log('VoN');
        // TODO: Add generation logic
    }

    /**
     * @param {object} rawOptions
     * @returns {{directory: string, output: string, config: string}}
     */
    static validateOptions(rawOptions) {
        let schema = Joi.object().required().keys({
            directory: Joi.string().required().trim(),
            output: Joi.string().optional().trim(),
            config: Joi.string().optional().trim(),
        });
        const result = Joi.validate(rawOptions, schema);
        if (result.error) throw new Error(`Invalid options: ${result.error}`);
        return result.value;
    }

}

module.exports = Von;
