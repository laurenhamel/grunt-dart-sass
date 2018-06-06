# grunt-dart-sass

> Compile Sass to CSS via Dart Sass

## Getting Started

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```
npm install grunt-dart-sass --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```
grunt.loadNpmTasks('grunt-dart-sass');
```

## Usage

Run this task with the `grunt dart-sass` command.

## Options

Refer to the [Dart Sass JavaScript API](https://github.com/sass/dart-sass#javascript-api) for more information about these options and guidelines for proper usage. These options are similar to the those of [Node-sass](https://github.com/sass/node-sass), excluding `precision` and `sourceComments` options and sans the `nested` and `compact` values for the `outputStyle` option.

**includePaths**

Type: `Array<String>`
Default: `[]`

An array of paths to use for resolving `@import` declarations

**indentType**

Type: `String`
Default: `space`

Determines whether to use space or tab characters for indentation

**indentWidth**

Type: `Number`
Default: `2`
Maximum: `10`

Determines the number of spaces or tabs to be used for indentation

**indentedSyntax**

Type: `Boolean`
Default: `false`

Enables (`true`) or disabled (`false`) [Sass Indented Syntax](http://sass-lang.com/documentation/file.INDENTED_SYNTAX.html) for parsing the Sass input

**lineFeed**

Type: `String`
Default: `lf`

Determines the line break style, either `cr`, `crlf`, `lf`, or `lfcr`

**omitSourceMapUrl**

Type: `Boolean`
Default: `false`

Enables (`false`) or disabled (`true`) the inclusino of source map information in the output file

**outputStyle**

Type: `String`
Default: `'expanded'`

The output format of the compiled CSS, either `expanded` or `compressed`

**sourceMapContents**

Type: `Boolean`
Default: `false`

Includes (`true`) or excludes (`false`) the `contents` in the source map information

**sourceMapEmbed**

Type: `Boolean`
Default: `false`

Embeds (`true`) or skips embedding (`false`) the source map as a data URI

**sourceMapRoot**

Type: `String`
Default: `undefined`

The value will be emitted as `sourceRoot` in the source map information

**sourceMap**

Type: `Boolean | String | undefined`
Default: `undefined`

Enables the output of a source map when some Sass input is compiled. When `true`, the source map is rendered to the target output location. When passing a `string` path, the source map is written to the given location. Otherwise, `false` or `undefined` will disable writing of source maps.

## Examples

Add a section named `dart-sass` to the data object passed into `grunt.initConfig()`, the pass in some files.

```js
grunt.initConfig({
  'dart-sass': {
    target: {
      files: [{
        expand: true,
        cwd: 'src/scss/',
        src: ['*.scss'],
        dest: ['dest/css'],
        ext: '.css'
      }]
    }
  }
});
```