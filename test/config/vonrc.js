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
    grouping: 'integer-prefix',
    groupOrder: 'asc', // or 'desc'
    imageOrder: 'asc', // or 'desc'
    schema: {},
    groups: [
        {
            id: 2,
        },
    ],
};
