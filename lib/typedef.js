/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @see https://github.com/TimboKZ/Von
 * @copyright 2017
 * @license MIT
 */

const Groupings = {
    Folder: 'folder', // Group by top-most folder
    IntegerPrefix: 'integer-prefix', // '1-my-image.jpg' => `1` is the group ID
    StringPrefix: 'string-prefix', // 'hello-world.png' => `hello` is the group ID
};

const Order = {
    Asc: 'asc',
    Desc: 'desc',
    None: 'none',
};

module.exports = {
    DEFAULT_OUTPUT_FILE: 'index.html',
    CONFIG_NAMES: ['vonrc.js', 'vonrc.json', '.vonrc.js', '.vonrc.json'],

    Groupings,
    ALL_GROUPINGS: [Groupings.Folder, Groupings.IntegerPrefix, Groupings.StringPrefix],
    DEFAULT_GROUPINGS: [Groupings.Folder, Groupings.IntegerPrefix, Groupings.StringPrefix],

    Order,
    ALL_ORDERS: [Order.Asc, Order.Desc, Order.None],
    DEFAULT_ORDER: Order.Asc,
};

/**
 * @typedef {fs} FSAsync
 * @property {Function} writeFileAsync
 * @property {Function} lstatSync
 * @property {Function} readdirAsync
 * @property {Function} accessAsync
 * @property {Function} unlinkAsync
 * @property {Function} rmdirAsync
 * @property {Function} mkdirAsync
 * @property {Object} constants
 */

/**
 * @typedef {Object} ImageDimensions
 * @property {int} width
 * @property {int} height
 * @property {string} type             - Type of the image, (approx. equal to extension of the image file)
 */

/**
 * @typedef {string|function} FunctionOrString
 *
 * @typedef {Object} VonOptions
 * @property {string} directory           - Path to working directory
 * @property {string} output              - Path to file to which resultant HTML will be written
 * @property {string} [templatePath]      - Path of the custom template to use
 * @property {string} template            - Name of built-in template to use (if `templatePath` is not defined)
 * @property {string} [config]            - Path to Von config. Anything that can be require()'d is fine.
 * @property {string} title               - Title of the site
 * @property {string} description         - (SEO-friendly) Description of the site
 * @property {bool} definedGroupsOnly
 * @property {bool} recursive
 * @property {FunctionOrString[]} grouping
 * @property {FunctionOrString} groupOrder
 * @property {FunctionOrString} imageOrder
 * @property {Object} schema              - Object that will be merged with resulting schema
 * @property {VonSchemaGroup[]} groups    - Definition of groups existing in the project
 */

/**
 * @typedef {Object} VonTemplate
 * @property {string} name             - Name of the template, either filename or built-in template name
 * @property {string} path             - Path to the template file
 * @property {string} type             - Enum type of the template
 */

////////////////// SCHEMA START //////////////////

/**
 * @typedef {Object} VonSchema
 * @property {string} title               - Copied over from options
 * @property {string} description         - Copied over from options
 * @property {VonSchemaGroup[]} groups    - Definition of schema groups, that is config groups with extra Von data
 */

/**
 * @typedef {Object} VonSchemaGroup
 * @property {int|string} [id]            - ID of the group, used for sorting
 * @property {VonSchemaImage[]} images    - Images this particular group contains
 */

/**
 * @typedef {Object} VonSchemaImage
 * @property {string[]} path              - Path to the image relative to the working directory.
 * @property {ImageDimensions} dimensions - Dimensions and type of the image
 */

////////////////// SCHEMA END //////////////////

