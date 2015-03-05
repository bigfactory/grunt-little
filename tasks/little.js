/*
 * grunt-little
 * https://github.com/bigfactory/grunt-little
 *
 * Copyright (c) 2015 xiaocong.hxc
 * Licensed under the MIT license.
 */

'use strict';

var compiler = require('./lib/compiler');
var chalk = require('chalk');
var _ = require('lodash');

module.exports = function(grunt) {
    compiler.setGrunt(grunt);

    grunt.registerMultiTask('little', 'less auto compiler', function() {
        var options = this.options({});

        options.baseCode = getBaseCode(grunt, options);

        this.files.forEach(function(f) {
            var src;

            src = f.src.map(function(srcFile) {
                var destFile = srcFile.replace('.less', '.css');
                compiler.compileLess(srcFile, destFile, options).then(function(output) {
                    grunt.file.write(destFile, output.css);
                    grunt.log.writeln('File ' + chalk.cyan(destFile) + ' created');
                });
            });


        });
    });

};

function getBaseCode(grunt, options) {
    var baseFiles = options.baseFiles;
    var baseCode = [];

    if (!baseFiles) {
        return '';
    }

    if (!_.isArray(baseFiles)) {
        baseFiles = [baseFiles];
    }
    baseFiles.forEach(function(baseFile) {
        var files = grunt.file.expand(baseFile);
        var contents = grunt.file.read(files);
        baseCode.push(contents);
    });

    baseCode = baseCode.join('');

    return baseCode;
}