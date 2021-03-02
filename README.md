# grunt-dart-sass

> Compile Sass to CSS via Dart Sass

## Getting Started

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```
npm install -D sass grunt-dart-sass
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```
grunt.loadNpmTasks('grunt-dart-sass');
```

## Usage

Run this task with the `grunt dart-sass` command.

## Options

Refer to the [Dart Sass JavaScript API](https://github.com/sass/dart-sass#javascript-api) for more information about options and guidelines for proper usage. [Dart Sass](https://github.com/sass/dart-sass) options are similar to the those of [Node-sass](https://github.com/sass/node-sass), excluding `precision` and `sourceComments` options and sans the `nested` and `compact` values for the `outputStyle` option.

## Examples

Add a section named `dart-sass` to the data object passed into `grunt.initConfig()`, then pass in your files object or array.

**Compile a file**

```js
grunt.initConfig({
  'dart-sass': {
    target: {
      files: {
        'dest/css/style.css': 'src/scss/style.scss'
      }
    }
  }
});
```

**Compile all files within a folder**

```js
grunt.initConfig({
  'dart-sass': {
    target: {
      files: [{
        expand: true,
        cwd: 'src/scss/',
        src: ['*.scss'],
        dest: 'dest/css',
        ext: '.css'
      }]
    }
  }
});
```

**Compress the CSS output**

```js
grunt.initConfig({
  'dart-sass': {
    target: {
      options: {
        outputStyle: 'compressed'
      },
      files: {
        'dest/css/style.css': 'src/scss/style.scss'
      }
    }
  }
});
```

**Prevent the creation of source maps**

```js
grunt.initConfig({
  'dart-sass': {
    target: {
      options: {
        sourceMap: false
      },
      files: {
        'dest/css/style.css': 'src/scss/style.scss'
      }
    }
  }
});
```
