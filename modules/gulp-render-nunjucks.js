var gutil = require('gulp-util');
var nunjucks = require('nunjucks');
var through = require('through2');

function charToHex(str) {
	return str.charCodeAt(0).toString(16);
}

function toFixed(str, digits) {
	if(isNaN(str)) {
		return str;
	}
	var dig = digits || 1;
	return parseFloat(str).toFixed(dig);
}

function onRender(file, scope, cb) {
	return function(err, result) {
		if (err) {
			this.emit('error', new gutil.PluginError('ao-nunjucks', err, { fileName: file.path }));
			return;
		}

		file.contents = new Buffer(result);
		this.push(file);
		cb();

	}.bind(scope);
}

function compile(baseTemplate, templateLocations) {
	return through.obj(function(file, enc, cb) {

		var context = file.data;
		var filePath = file.path;

		var env = new nunjucks.Environment(new nunjucks.FileSystemLoader(templateLocations), { noCache: true, trimBlocks: true, lstripBlocks: true, autoescape: false });

		env.addFilter('toFredUrl', function(str) {
			return str.replace(/[^\w\s]/g, charToHex).replace(/\s/g, "_").toLowerCase();
		});

		env.addFilter('toFixed', toFixed);

		env.addFilter('toBrandSprite', function(brand) {
			let str = brand.toLowerCase().replace(/\s/g, '');
			return str.replace(/[^(a-z)(A-Z)(0-9)(-)]/g, '-');
		});

		try {
			env.render(baseTemplate, context, onRender(file, this, cb));
		} catch (err) {
			this.emit('error', new gutil.PluginError('ao-nunjucks', err, { fileName: filePath }));
		}

	});
}

module.exports.compile = compile;
