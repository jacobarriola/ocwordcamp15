// Load our plugins
var	gulp			=	require('gulp'),
	sass				=	require('gulp-sass'),  // Our sass compiler
	notify			=	require('gulp-notify'), // Basic gulp notificatin using OS
	minifycss		=	require('gulp-minify-css'), // Minification
	rename			=	require('gulp-rename'), // Allows us to rename our css file prior to minifying
	autoprefixer	=	require('gulp-autoprefixer'), // Adds vendor prefixes for us
	concat				= require('gulp-concat'),
	jshint				= require('gulp-jsHint'),
	uglify				= require('gulp-uglify'),
	browserSync		=	require('browser-sync'); // Sends php, js, img and css updates to browser for us

// Our browser-sync task.

gulp.task('browser-sync', function() {
	var files = [
		'**/*.php'
	];

	browserSync.init(files, {
		proxy: 'ocwordcamp15.dev'
	});
});


// Our 'styles' tasks, which handles our sass actions such as compliling and minification

gulp.task('styles', function() {
	gulp.src('./assets/sass/**/*.scss')
		.pipe(sass({sourceComments: true}))
		.on('error', notify.onError(function(error) {
			return "Error: " + error.message;
		}))
		.pipe(autoprefixer()) // our autoprefixer - add and remove vendor prefixes using caniuse.com
		.pipe(gulp.dest('./assets/dist/css')) // Location of our app.css file
		.pipe(browserSync.reload({stream:true})) // CSS injection when app.css file is written
		.pipe(rename({suffix: '.min'})) // Create a copy version of our compiled app.css file and name it app.min.css
		.pipe(minifycss({
			keepSpecialComments:0
		})) // Minify our newly copied app.min.css file
		.pipe(gulp.dest('./assets/dist/css')) // Save app.min.css onto this directory
		.pipe(browserSync.reload({stream:true})) // CSS injection when app.min.css file is written
		.pipe(notify({
			message: "Styles task complete"
		}))
});


gulp.task('js', function() {
	return gulp.src('./assets/js/*.js')
    .pipe(concat('app.js'))
		.pipe(gulp.dest('./assets/dist/js'))
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify())
    .pipe(gulp.dest('./assets/dist/js'))
		.pipe(browserSync.reload({stream:true})) // CSS injection when app.min.css file is written
		.pipe(notify({
			message: "JS task complete"
		}))
})


gulp.task('watch', function() {
	gulp.watch('assets/sass/**/*.scss', ['styles']);
	gulp.watch('assets/js/**/*.js', ['js']);
});

// Our default gulp task, which runs 'styles' when a sass file changes.  This is task is executed by typing 'gulp' on the Terminal
gulp.task('default', ['styles', 'js', 'browser-sync', 'watch']);
