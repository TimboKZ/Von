/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @see https://github.com/TimboKZ/Von
 * @copyright 2017
 * @license MIT
 */

const path = require('path');

/**
 * Array of all built-in template names
 * @type {string[]}
 */
const TEMPLATE_NAMES = ['mini'];

/**
 * Template use by default
 * @type {string}
 */
const DEFAULT_TEMPLATE = TEMPLATE_NAMES[0];

/**
 * Template types supported by Von. `von` template type stands for a `*.von.js` template.
 * @enum {string}
 */
const TEMPLATE_TYPES = {
    Von: 'von',
    Pug: 'pug',
};

/**
 * Map from template name to the template file for all built-in templates
 * @type {Object.<string, VonTemplate>}
 */
const TEMPLATE_MAP = {
    mini: {
        name: 'mini',
        type: TEMPLATE_TYPES.Von,
        path: path.join(__dirname, 'mini', 'mini.von.js'),
    },
};

module.exports = {TEMPLATE_NAMES, DEFAULT_TEMPLATE, TEMPLATE_TYPES, TEMPLATE_MAP};
