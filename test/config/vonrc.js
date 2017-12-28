/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @see https://github.com/TimboKZ/Von
 * @copyright 2017
 * @license MIT
 *
 * This is an example of a Von config. It includes all of the supported configuration options.
 */

module.exports = {
    title: 'Example Von Gallery',
    description: 'This is an example Von gallery. Google "von-gallery" for more info.',
    definedGroupsOnly: false,
    recursive: true,
    grouping: ['folder', 'integer-prefix', 'string-prefix'],
    groupOrder: 'asc', // 'asc', 'desc', 'none' or your own sorting function
    imageOrder: 'asc', // 'asc', 'desc', 'none' or your own sorting function
    schema: {},
    groups: [
        {
            id: 2,
        },
    ],
};
