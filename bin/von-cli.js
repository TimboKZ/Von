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
    description: vonPackage.description
});
parser.addArgument(['-s', '--schema'], {
    action: 'storeTrue',
    help: 'print the schema without building',
});

const args = parser.parseArgs();
let options = {
    directory: process.cwd(),
};
if (args.schema) {
    let specialString = 'vonvonvon%%123123';
    const replacer = (k, v) => v === undefined ? specialString : v;
    Von.generateSchema(options)
        .then(schema => console.log(JSON.stringify(schema, replacer, 2).replace(new RegExp(`"${specialString}"`, 'g'), 'undefined')));
} else {
    Von.run(options);
}

