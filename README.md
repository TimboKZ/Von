# ![](https://s3-eu-central-1.amazonaws.com/foxypanda-ghost/2017/11/von-small.png)

🖼️🤔 Node.js generator for (static) single page galleries. The default template is responsive and supports lazy loading.
Available as a CommonJS module and as a command line tool.

Ever wanted to make a single page gallery of all of the pics you had? Well, now you can!

# Usage

Install [Node.js](https://nodejs.org/en/), which will automatically install NPM. Then, install Von globally:

```bash
npm install -g von-gallery
```

Now go into any folder on your computer with some images (make sure it's not too big) and simply run:

```bash
von
```

This will create an `index.html` file with a gallery of all of the images in your directory. For now it will just look
like a bunch of pictures arranged in a nice grid since you haven't done any configuration. 

> Von is still in active development, some APIs may change.

# Philosophy behind Von

Von was meant to be very simple to use. In most cases you will only ever need to use the `von` command. Of course, you
might want to add some configuration too - this can all be done by passing additional arguments to `von`, e.g.
`von -o custom-output.html -t custom-template.pug --recursive`.

You can also create a `vonrc.js` or `vonrc.json` (choose one). Von will recognise both files as its config, but
`vonrc.js` gives you more freedom since you have all JavaScript features at your disposal. Config lets you do anything
that command line arguments can achieve, plus a little extra. Namely, you need the config to define groups. Once you
have defined a config, simply run `von` in the same directory and Von will automatically import it.

If you want to automate the process even further, you can add Von as a dependency to your NPM project
(`npm install --save von-gallery`) and use it as a CommonJS module (`const Von = require('von-gallery');`). In fact,
the command line tool is simply a wrapper around this module, so both offer identical functionality.

It's **very important** to remember that Von is a *simple* gallery generator - if you want to develop something complex
you should probably use a proper static site generator. 
