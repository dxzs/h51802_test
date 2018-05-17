const gulp = require("gulp"),
		minifyCss = require("gulp-clean-css"),
		babel = require("gulp-babel"),
		uglify = require("gulp-uglify"),
		sass = require("gulp-sass");

gulp.task("css",function(){
	gulp.src("./src/**/*.css")
		.pipe(minifyCss())
		.pipe(gulp.dest("./dist/"));
})
gulp.task("js",function(){
	gulp.src("./src/**/*.js")
		.pipe(babel({
			presets : ['env']
		}))
		.pipe(uglify())
		.pipe(gulp.dest("./dist/"));
})
gulp.task("sass",function(){
	gulp.src("./src/sass/*.scss")
		.pipe(sass())
		.pipe(gulp.dest("./dist/"));
})
