/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @see https://github.com/TimboKZ/Von
 * @copyright 2017
 * @license MIT
 */

const vonPackage = require('../package.json');
const ArgumentParser = require('argparse').ArgumentParser;
const {ALL_GROUPINGS, ALL_ORDERS} = require('../lib/typedef');

const parser = new ArgumentParser({
    version: vonPackage.version,
    addHelp: true,
    description: vonPackage.description,
    argumentDefault: undefined,
});

let defineParameter = (name, short, metavar, help, choices = undefined, defaultValue = null) => {
    parser.addArgument([`-${short}`, `--${name}`], {
        action: 'store',
        metavar,
        help,
        choices,
        defaultValue,
    });
};

let defineFlag = (name, short, help) => {
    parser.addArgument([`-${short}`, `--${name}`], {
        action: 'storeConst',
        help,
        constant: true,
        defaultValue: null,
    });
};

defineParameter('directory', 'd', '<path>', 'directory where images are located', undefined, process.cwd());
defineParameter('output', 'o', '<path>', 'file to which Von HTML will be written');
defineParameter('template', 't', '<name>', 'built-in template to use');
defineParameter('template-path', 'tp', '<path>', 'custom template path');
defineParameter('config', 'c', '<path>', 'custom config path');
defineParameter('title', 'ti', '<title>', 'title of the gallery');
defineParameter('description', 'de', '<desc>', 'description of the gallery');
parser.addArgument(['-g', '--grouping'], {
    action: 'append',
    help: 'grouping heuristic for images',
    choices: ALL_GROUPINGS,
    defaultValue: null,
});
defineParameter('group-order', 'go', undefined, 'group sorting logic', ALL_ORDERS);
defineParameter('image-order', 'io', undefined, 'image sorting logic', ALL_ORDERS);

defineFlag('defined-groups-only', 'dgo', 'only include the groups from the config');
defineFlag('recursive', 'r', 'discover images recursively');
defineFlag('schema', 's', 'print the schema without building the gallery');
defineFlag('print-options', 'po', 'print command line options without doing anything');

module.exports = parser;
