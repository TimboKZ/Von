#! /usr/bin/env node

/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @see https://github.com/TimboKZ/Von
 * @copyright 2017
 * @license MIT
 */

const Von = require('../lib/Von');

let options = {
    directory: process.cwd(),
};

Von.run(options);
