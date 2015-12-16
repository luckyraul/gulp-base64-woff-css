var through2 = require('through2');
var gutil = require('gulp-util');
var path = require('path');
var template = [
    '@font-face {\n',
    '  font-family: "{{fontName}}";\n',
    '  src: local("{{fontName}}"),\n',
    '       url("data:application/x-font-{{fontType}};base64,{{base64}}") format("{{fontType}}");\n',
    '}'
].join('');

module.exports = function(list) {
    'use strict';

    var files = [],
        transform = function(file, encoding, callback) {
            if (file.isNull()) {
                this.push(file);
                return callback();
            }
            files.push(file);
            callback();
        },
        flush = function(callback) {
            files.forEach(function(file, idx) {
                if (path.extname(file.path) === '.woff') {
                    var base64 = file.contents.toString('base64');
                    var fontName = path.basename(file, '.woff');
                    var tmpl = template
                        .replace(/{{fontName}}/g, fontName)
                        .replace('{{base64}}', base64),
                        output = new gutil.File({
                            path: fileName + '.css'
                        });
                    output.contents = new Buffer(tmpl);
                    this.push(output);
                }
            }.bind(this));

            callback();
        };

    return through2.obj(transform, flush);

};
