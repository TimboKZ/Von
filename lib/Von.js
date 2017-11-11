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
        // TODO: Add generation logic
    }

    /**
     * @param {object} rawOptions
     * @returns {{directory: string, config: string}}
     */
    static validateOptions(rawOptions) {
        let schema = Joi.object().required().keys({
            directory: Joi.string().required().trim(),
            config: Joi.string().optional().trim(),
        });
        const result = Joi.validate(rawOptions, schema);
        if (result.error) throw new Error(`Invalid options: ${result.error}`);
        return result.value;
    }

}

module.exports = Von;
