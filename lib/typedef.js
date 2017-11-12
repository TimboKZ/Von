/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @see https://github.com/TimboKZ/Von
 * @copyright 2017
 * @license MIT
 *
 * This was originally a `von-gallery.d.ts` file, but my IDE failed to parse it.
 */

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
 * @typedef {VonConfig} VonOptions
 * @property {string} directory        - Path to working directory
 * @property {string} [template]       - Name of a default template (used over `templatePath`)
 * @property {string} [templatePath]   - Path to the template (automatically overwritten if `template is set)
 * @property {string} [output]         - Path to which resultant HTML will be written
 * @property {string} [config]         - Path to Von config. Any file format that can be `require()`'d is fine.
 */

/**
 * @typedef {Object} VonTemplate
 * @property {string} name             - Name of the template, either filename or built-in template name
 * @property {string} path             - Path to the template file
 * @property {string} type             - Enum type of the template
 */

////////////////// CONFIG START //////////////////

/**
 * @typedef {Object} VonConfig
 * @property {string} [title]            - Title of the site
 * @property {string} [description]      - (SEO-friendly) Description of the site
 * @property {Object} [schema]           - Object that will be merged with resulting schema
 * @property {VonConfigGroup[]} groups   - Definition of groups existing in the project
 */

/**
 * @typedef {Object} VonConfigGroup
 * @property {string} [name]           - Name of the group
 * @property {string} [folder]         - Folder of the group. If this is not specified, root folder is used.
 * @property {string} [prefix]         - Prefix used to find members of the group (used if `regex` is not set)
 * @property {RegExp} [regex]          - Regex used to find members (used over regex)
 */

////////////////// CONFIG END //////////////////


////////////////// SCHEMA START //////////////////

/**
 * @typedef {VonConfig} VonSchema
 * @property {VonSchemaGroup[]} groups    - Definition of schema groups, that is config groups with extra Von data
 */

/**
 * @typedef {VonConfigGroup} VonSchemaGroup
 * @property {VonSchemaImage[]} images    - Images this particular group contains
 */

/**
 * @typedef {VonConfigGroup} VonSchemaImage
 * @property {string[]} path              - Path to the image relative to the working directory.
 * @property {ImageDimensions} dimensions - Dimensions and type of the image
 */

////////////////// SCHEMA END //////////////////

