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
 * @property {Object} constants
 */

/**
 * @typedef {VonConfig} VonOptions
 * @property {string} directory        - Path to working directory
 * @property {string} template         - Name of a default template (used over `templatePath`)
 * @property {string} templatePath     - Path to the template (automatically overwritten if `template is set)
 * @property {string} output           - Path to which resultant HTML will be written
 * @property {string} config           - Path to Von config. Any file format that can be `require()`'d is fine.
 */

////////////////// CONFIG START //////////////////

/**
 * @typedef {Object} VonConfig
 * @property {string} [title]           - Title of the site
 * @property {string} [description]     - (SEO-friendly) Description of the site
 * @property {VonConfigGroup} groups    - Definition of groups existing in the project
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
 */

/**
 * @typedef {Object} VonSchemaGroup
 */

////////////////// SCHEMA END //////////////////

