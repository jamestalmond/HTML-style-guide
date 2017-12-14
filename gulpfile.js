/* eslint-disable max-len, no-process-env */

/* Project setup... */
const AO_FEA_GLOBALS_PATH = '../../../globals/'; // Change path to point at root globals
const PROJECT_NAME = 'html-style-guide'; // Change project name to your project name
const PROJECT_SERVER_PATH = '//media.ao.com/'; // Change project server path to your project path

const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const proxy = require('http-proxy-middleware');
const plumber = require('gulp-plumber');

const rename = require('gulp-rename');
const njk = require('./modules/gulp-render-nunjucks'); // Modified version
const helperMethods = require('./modules/nunjucks-helper-methods'); // Methods for use in NJK files.
const data = require('gulp-data');
const fs = require('fs');
const htmlmin = require('gulp-htmlmin');
const replace = require('gulp-replace');

const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const sourcemaps = require('gulp-sourcemaps');

const jimp = require('gulp-jimp');
const image = require('gulp-image');
const webp = require('gulp-webp');

const mergeStream = require('merge-stream');
const clone = require('gulp-clone');
const newer = require('gulp-newer');

const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');
const path = require('path');

const URL_PREFIXING_REGEX = /(<link.+href\s*=\s*["']|src\s*=\s*["']|background-image\s*\:\s*url\(["']?)(?!(\/\/)|(\/Themes))/gi;

let config = {
	serverPath: '/',
	projectName: PROJECT_NAME,
	baseTemplate: 'build.njk',
	destination: 'build',
	postcss: [
		autoprefixer({
			grid: true
		})
	]
};

if (process.env.NODE_ENV === 'production') {
	config = Object.assign({}, config, {
		serverPath: PROJECT_SERVER_PATH,
		baseTemplate: 'dist.njk',
		destination: 'dist'
	});
	config.postcss.push(cssnano({
		zindex: false
	}));
}

gulp.task('dev', ['templates', 'scss', 'scripts', 'images'], function() {
	const apiProxy = proxy(['/HttpHandlers/EmailCommunicationHandler.ashx', '/ProductsHandler.axd', '/Themes', '/l/', '/product/'], {
		target: 'http://ao.com',
		changeOrigin: true // for vhosted sites
	});
	browserSync.init({
		server: {
			directory: true,
			baseDir: config.destination,
			middleware: [apiProxy]
		}
	});
});

gulp.task('templates', function() {
	let src = gulp.src(['src/configs/**/*.json'], {
			read: false
		})
		.pipe(plumber())
		.pipe(data(function(file) {
			const fileContents = JSON.parse(fs.readFileSync(file.path));
			fileContents.projectName = config.projectName;
			fileContents.helperMethods = helperMethods;
			return fileContents;
		}))
		.pipe(njk.compile(config.baseTemplate, ['./src/templates', `${AO_FEA_GLOBALS_PATH}modules`]))
		.pipe(replace(URL_PREFIXING_REGEX, `$&${config.serverPath}`)) // Prefixes URLs with media server path
		.pipe(replace(/srcset=\"(.*?)\"/gmi, function(match, p1) {
			const paths = p1.split(/,\s*/gi);
			const prefixedPaths = paths.map(p => `${config.serverPath}${p}`).join(', ');
			return `srcset="${prefixedPaths}"`;
		}))
		.pipe(rename({
			extname: '.html'
		}));

	if (process.env.NODE_ENV === 'production') {
		src = src.pipe(htmlmin({
			collapseWhitespace: true
		}));
	}

	return src.pipe(gulp.dest(config.destination));
});

gulp.task('templates-watch', ['templates'], function(done) {
	browserSync.reload();
	done();
});

gulp.task('amp', function() {
	let src = gulp.src(['src/configs/**/*.json'], {
			read: false
		})
		.pipe(plumber())
		.pipe(data(function(file) {
			const fileContents = JSON.parse(fs.readFileSync(file.path));
			fileContents.projectName = config.projectName;
			fileContents.helperMethods = helperMethods;
			return fileContents;
		}))
		.pipe(njk.compile(config.baseTemplate, ['./src/templates', `${AO_FEA_GLOBALS_PATH}modules`, `${AO_FEA_GLOBALS_PATH}amp`]))
		.pipe(replace(URL_PREFIXING_REGEX, `$&${config.serverPath}`)) // Prefixes URLs with media server path
		.pipe(rename({
			extname: '.amp.html'
		}));

	if (process.env.NODE_ENV === 'production') {
		src = src.pipe(htmlmin({
			collapseWhitespace: true
		}));
	}

	return src.pipe(gulp.dest(config.destination));
});

gulp.task('scss', function() {
	function assignProjectName(filepath) {
		if (filepath.basename === 'structure') {
			filepath.basename = config.projectName;
		}
	}

	let scssStream = gulp.src('src/scss/**/*.scss');

	if (process.env.NODE_ENV === 'development') {
		scssStream = scssStream.pipe(sourcemaps.init());
	}

	scssStream = scssStream.pipe(sass({
				includePaths: [`${AO_FEA_GLOBALS_PATH}sass`, `${AO_FEA_GLOBALS_PATH}modules`, 'node_modules']
			})
			.on('error', sass.logError))
		.pipe(postcss(config.postcss));

	if (process.env.NODE_ENV === 'development') {
		scssStream = scssStream.pipe(sourcemaps.write('.'))
			.pipe(rename(assignProjectName))
			.pipe(gulp.dest(`${config.destination}/css`))
			.pipe(browserSync.stream());
	} else {
		scssStream = scssStream.pipe(rename(assignProjectName))
			.pipe(gulp.dest(`${config.destination}/css`));
	}

	return scssStream;

});

gulp.task('images', function() {
	const dest = `${config.destination}/img`;

	let stream = gulp.src(['./src/img/**/*.+(jpg|png)']).pipe(newer(dest));

	let nonRetinaStream = stream.pipe(clone()).pipe(
		jimp({
			'': {
				scale: 0.5
			}
		})
	);

	let retinaStream = stream.pipe(
		rename({
			suffix: '_2x'
		})
	);

	let allImages = mergeStream(retinaStream, nonRetinaStream);

	let defaultStream = allImages
		.pipe(clone());

	if (process.env.NODE_ENV === 'production') {
		defaultStream = defaultStream.pipe(
			image({
				pngquant: false,
				optipng: true,
				zopflipng: true,
				jpegRecompress: false,
				jpegoptim: false,
				mozjpeg: false,
				guetzli: true,
				gifsicle: false,
				svgo: false,
				concurrent: 10
			})
		);
	}

	let webPStream = allImages.pipe(webp());

	return mergeStream(defaultStream, webPStream).pipe(gulp.dest(dest));
});

gulp.task('images-watch', ['images'], function(done) {
	browserSync.reload();
	done();
});

gulp.task('scripts', function() {
	webpackConfig.entry[config.projectName] = './src/scripts/main.js';
	webpackConfig.resolve.modules.push(path.resolve(__dirname, AO_FEA_GLOBALS_PATH));

	webpackConfig.plugins.push(
		new webpack.DefinePlugin({
			'process.env.SERVER_PATH': JSON.stringify(`${config.serverPath}`)
		})
	);

	if (process.env.NODE_ENV === 'development') {
		webpackConfig.devtool = 'inline-source-map';
	} else {
		webpackConfig.plugins.push(
			new webpack.LoaderOptionsPlugin({
				minimize: true,
				debug: false
			})
		);
		webpackConfig.plugins.push(
			new webpack.optimize.UglifyJsPlugin({
				compress: {
					warnings: false
				},
				sourceMap: webpackConfig.devtool && (webpackConfig.devtool.indexOf('sourcemap') >= 0 || webpackConfig.devtool.indexOf('source-map') >= 0)
			})
		);
	}
	return gulp.src(['./src/scripts/main.js'], {
			read: false
		})
		.pipe(plumber())
		.pipe(webpackStream(webpackConfig, webpack))
		.pipe(gulp.dest(`${config.destination}/scripts`));
});

gulp.task('scripts-watch', ['scripts'], function(done) {
	browserSync.reload();
	done();
});

gulp.task('watch', ['dev'], function() {
	gulp.watch(['src/templates/**/*.njk', 'src/configs/**/*.json', `${AO_FEA_GLOBALS_PATH}**/*.njk`], ['templates-watch']);
	gulp.watch(['src/scss/**/*.scss', `${AO_FEA_GLOBALS_PATH}**/*.scss`], ['scss']);
	gulp.watch([`${AO_FEA_GLOBALS_PATH}**/*.+(js|jsx)`, 'src/scripts/**/*.+(js|jsx)'], ['scripts-watch']);
	gulp.watch('src/img/**/*.+(jpg|png)', ['images-watch']);
});

gulp.task('dist', function() {
	gulp.start('templates');
	gulp.start('images');
	gulp.start('scss');
	gulp.start('scripts');
});

gulp.task('default', ['watch']);
