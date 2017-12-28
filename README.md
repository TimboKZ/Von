# ![](https://s3-eu-central-1.amazonaws.com/foxypanda-ghost/2017/11/von-small.png)

[![npm](https://img.shields.io/npm/v/von-gallery.svg)]()
[![npm](https://img.shields.io/npm/dt/von-gallery.svg)](https://www.npmjs.com/package/von-gallery)

🖼️🤔 Node.js generator for (static) single page galleries. The default template is responsive and supports lazy loading.
Available as a CommonJS module and as a command line tool.

Building a single page gallery using just the `von` command:

![The concept behind Von.](https://s3-eu-central-1.amazonaws.com/foxypanda-ghost/2017/12/von-concept.png)

# Example usage

Install [Node.js](https://nodejs.org/en/), which will automatically install NPM. Then, install Von globally:

```bash
npm install -g von-gallery
```

Now go into any folder on your computer with some images, open a terminal window, and simply run:

```bash
von -r
```

Where `-r` stands for "recursive". This will create an `index.html` file with a gallery of all of the images in
that folder. By default, Von groups images either using their directory or prefix (e.g. `prefix-my_image.jpg`), but
you can adjust this behaviour. 

# About

Von was meant to be very simple to use. Most of the time, `von` command will be all you need. You can also specify some
extra options - this can all be done by passing command line arguments to `von`, for example:
 
```bash
von -o ./build/output.html -tp ./custom-template.pug --recursive
```

Alternatively, you can create a config file called `vonrc.js`. The config lets you do anything that command line
arguments can do, plus a little extra. Namely, you can use the config to define groups and custom grouping/sorting
functions. Once you have defined a config, simply run `von` in the same directory. Check out this
[example config](./test/config/vonrc.js) for more info.

If you want to automate the process even further, you can add `von-gallery` as a dependency to your NPM project and use
it as a CommonJS module, for example:

```javascript
const Von = require('von-gallery');

// Specify options for Von
let options = {
    directory: './path/to/images/',
    output: './build/my-gallery.html',
    template: 'mini',
    groupOrder: 'desc',
};

// Only generate a schema, without actually creating any new files:
let schema = Von.generateSchema(options);
console.log(schema);

// Build a single page gallery and store in the specified `output` file:
Von.run(options);
```
 In fact,
the command line tool is simply a wrapper around this module, so both offer identical functionality.

Remember that Von is a single page gallery generator - if you want to develop something complex
you should use a proper [static site generator](https://www.staticgen.com/). 

## How Von works

There are 4 components Von works with:

1. **Images.** Images are the actual files located in the folder Von is working with.
2. **Groups.** Groups are collection of images. You tell Von which heuristics to use to group images by specifying
either command line arguments or config properties.
3. **Schema.** Schema contains information about your gallery. This includes the page title, page description, array of
all groups, and other arbitrary information. You can append extra information to it using the config.
4. **Template.** Template uses the schema created in the previous step to produce HTML for your gallery. Currently Von
uses `mini` as the default template, but you can also define custom templates.

The logic Von executes can be separated into two distinct steps: schema generation and template compilation.

### Phase 1: Schema generation

No new files are created during this phase. First, Von scans the working directory for images. Once all of the images
have been discovered, they are grouped and sorted using the options you specified. Then, said groups, images and options
are used to generate a schema object which describes your gallery.

This new schema is an independent piece of data. In fact, you don't even have to proceed to the next step - you can
simply export the schema using the `von -s` command or `Von.generateSchema({...})` function. The former might be useful
for debugging your `vonrc.js`.  

### Phase 2: Template compilation

During this phase Von takes the generated schema and uses it to build the template you chose. At the moment, the only
built-in template is `mini` but you can specify your own templates.

There is a built-in support for Pug templates, so you can simply point Von at a Pug file using
`von -tp ./path/to/template.pug`. If you use Pug, the `schema` object will be available in your Pug code. For example,
you can use `schema.title` and `schema.description` to access the title and the description of the gallery respectively. 

If you want to use some other templating engine, you can define a `my-template.von.js`, where `my-template` is the name
of your template. Then, you can tell Von to use it by specifying the appropriate command line arguments:

```bash
von -tp ./path/to/my-template.von.js
```

Von will initialise your template and call the `.compile()` method letting you handle the rest of the logic. See
[mini.von.js](./templates/mini/mini.von.js) for example implementation. 

Finally, built-in Von templates will write HTML out to the output file you specified. Note that your custom template
can override this logic: it can write out to a different file, to multiple files or not write anything at all. 
