/*
 * grunt-contrib-less
 * http://gruntjs.com/
 *
 * Copyright (c) 2015 Tyler Kellen, contributors
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');
var _ = require('lodash');
var async = require('async');
var chalk = require('chalk');
var less = require('less');

var grunt;

exports.setGrunt = function(_gurnt) {
    grunt = _gurnt;
};

exports.compileLess = function(srcFile, destFile, options) {
    options = _.assign({
        filename: srcFile
    }, options);
    options.paths = options.paths || [path.dirname(srcFile)];

    if (_.isFunction(options.paths)) {
        try {
            options.paths = options.paths(srcFile);
        }
        catch (e) {
            grunt.fail.warn(wrapError(e, 'Generating @import paths failed.'));
        }
    }

    if (options.sourceMap && !options.sourceMapFileInline && !options.sourceMapFilename) {
        options.sourceMapFilename = destFile + '.map';
    }

    if (_.isFunction(options.sourceMapBasepath)) {
        try {
            options.sourceMapBasepath = options.sourceMapBasepath(srcFile);
        }
        catch (e) {
            grunt.fail.warn(wrapError(e, 'Generating sourceMapBasepath failed.'));
        }
    }

    if (_.isBoolean(options.sourceMap) && options.sourceMap) {
        options.sourceMap = {
            sourceMapBasepath: options.sourceMapBasepath,
            sourceMapFilename: options.sourceMapFilename,
            sourceMapInputFilename: options.sourceMapInputFilename,
            sourceMapFullFilename: options.sourceMapFullFilename,
            sourceMapURL: options.sourceMapURL,
            sourceMapRootpath: options.sourceMapRootpath,
            outputSourceFiles: options.outputSourceFiles,
            sourceMapFileInline: options.sourceMapFileInline
        };
    }

    var srcCode = grunt.file.read(srcFile);
    // Equivalent to --modify-vars option.
    // Properties under options.modifyVars are appended as less variables
    // to override global variables.
    var modifyVarsOutput = parseVariableOptions(options['modifyVars']);
    if (modifyVarsOutput) {
        srcCode += '\n';
        srcCode += modifyVarsOutput;
    }

    // Load custom functions
    if (options.customFunctions) {
        Object.keys(options.customFunctions).forEach(function(name) {
            less.functions.functionRegistry.add(name.toLowerCase(), function() {
                var args = [].slice.call(arguments);
                args.unshift(less);
                var res = options.customFunctions[name].apply(this, args);
                return _.isObject(res) ? res : new less.tree.Anonymous(res);
            });
        });
    }

    if(options.baseCode){
        srcCode = options.baseCode + '\n' + srcCode;
    }

    // console.log(options)
    return less.render(srcCode, options)
        .catch(function(err) {
            lessError(err, srcFile);
        });
};

var parseVariableOptions = function(options) {
    var pairs = _.pairs(options);
    var output = '';
    pairs.forEach(function(pair) {
        output += '@' + pair[0] + ':' + pair[1] + ';';
    });
    return output;
};

var formatLessError = function(e) {
    var pos = '[' + 'L' + e.line + ':' + ('C' + e.column) + ']';
    return e.filename + ': ' + pos + ' ' + e.message;
};

var lessError = function(e, file) {
    var message = less.formatError ? less.formatError(e) : formatLessError(e);

    grunt.log.error(message);
    grunt.fail.warn('Error compiling ' + file);
};

var wrapError = function(e, message) {
    var err = new Error(message);
    err.origError = e;
    return err;
};