#! /usr/bin/env node

/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @see https://github.com/TimboKZ/Von
 * @copyright 2017
 * @license MIT
 */

const Von = require('../lib/Von');
const parser = require('./arg-parser');

const args = parser.parseArgs();
let options = {};
for (let key in args) {
    if (!args.hasOwnProperty(key) || args[key] === null) continue;
    let camelized = key.replace(/_./g, s => s.substring(1).toUpperCase());
    options[camelized] = args[key];
}

let exitWithError = error => {
    console.error(error);
    process.exit(1);
};

if (options.printOptions) {

    console.log(options);

} else if (options.schema) {

    // Use a magic string to make sure `undefined` is still printed
    let specialString = '%Von-Magic-String$';
    const replacer = (k, v) => v === undefined ? specialString : v;
    Von.generateSchema(options)
        .then(schema => console.log(JSON.stringify(schema, replacer, 2).replace(new RegExp(`"${specialString}"`, 'g'), 'undefined')))
        .then(() => process.exit(0))
        .catch(exitWithError);

} else {

    Von.run(options)
        .then(() => process.exit(0))
        .catch(exitWithError);

}
