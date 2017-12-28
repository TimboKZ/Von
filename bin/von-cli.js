#! /usr/bin/env node

/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @see https://github.com/TimboKZ/Von
 * @copyright 2017
 * @license MIT
 */

const Von = require('../lib/Von');
const vonPackage = require('../package.json');
const ArgumentParser = require('argparse').ArgumentParser;

const parser = new ArgumentParser({
    version: vonPackage.version,
    addHelp: true,
    description: vonPackage.description,
    argumentDefault: undefined,
});
parser.addArgument(['-d', '--directory'], {
    action: 'store',
    help: 'directory where images are located',
    defaultValue: process.cwd(),
});
parser.addArgument(['-o', '--output'], {
    action: 'store',
    help: 'file to which Von HTML will be written',
    defaultValue: null,
});
parser.addArgument(['-t', '--template'], {
    action: 'store',
    help: 'built-in template to use',
    defaultValue: null,
});
parser.addArgument(['-tp', '--template-path'], {
    action: 'store',
    help: 'custom template path',
    defaultValue: null,
});
parser.addArgument(['-c', '--config'], {
    action: 'store',
    help: 'custom config path',
    defaultValue: null,
});
parser.addArgument(['-ti', '--title'], {
    action: 'store',
    help: 'title of the gallery',
    defaultValue: null,
});
parser.addArgument(['-de', '--description'], {
    action: 'store',
    help: 'description of the gallery',
    defaultValue: null,
});
parser.addArgument(['-dgo', '--defined-groups-only'], {
    action: 'storeConst',
    help: 'print the schema without building the gallery',
    constant: true,
    defaultValue: null,
});
parser.addArgument(['-r', '--recursive'], {
    action: 'storeConst',
    help: 'discover images recursively',
    constant: true,
    defaultValue: null,
});
parser.addArgument(['-g', '--grouping'], {
    action: 'append',
    help: 'grouping heuristic for images',
    defaultValue: null,
});
parser.addArgument(['-go', '--group-order'], {
    action: 'store',
    help: 'group ordering',
    defaultValue: null,
});
parser.addArgument(['-io', '--image-order'], {
    action: 'store',
    help: 'image ordering',
    defaultValue: null,
});
parser.addArgument(['-s', '--schema'], {
    action: 'storeConst',
    help: 'print the schema without building the gallery',
    constant: true,
    defaultValue: null,
});

const args = parser.parseArgs();
let options = {};
for (let key in args) {
    if(!args.hasOwnProperty(key) || args[key] === null) continue;
    let camelized = key.replace(/_./g, s => s.substring(1).toUpperCase());
    options[camelized] = args[key];
}

if (options.schema) {
    // Use a magic string to make sure `undefined` is still printed
    let specialString = '%Von-Magic-String$';
    const replacer = (k, v) => v === undefined ? specialString : v;
    Von.generateSchema(options)
        .then(schema => console.log(JSON.stringify(schema, replacer, 2).replace(new RegExp(`"${specialString}"`, 'g'), 'undefined')));
} else {
    Von.run(options)
        .catch(error => console.error(error));
}
