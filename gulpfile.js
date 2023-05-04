const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const webp = require('gulp-webp');
const rename = require("gulp-rename");
const squoosh = require('gulp-libsquoosh');
const htmlmin = require('gulp-htmlmin');
const svgstore = require('gulp-svgstore');
const terser = require('gulp-terser');
const csso = require('postcss-csso');
const autoprefixer = require("autoprefixer");
const sync = require("browser-sync").create();



// Styles
const styles = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer(), csso()
    ]))
    .pipe(rename('style.min.scss'))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
}
exports.styles = styles;

// Scripts
const scripts = () => {
  return gulp.src("/js/script.js")
    .pipe(terser())
    .pipe(rename("script.min.js"))
    .pipe(gulp.dest("build/js"))
    .pipe(sync.stream());
}
exports.scripts = scripts;


// HTML
gulp.task('minify', () => {
  return gulp.src('src/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('build'));
});


// webp manual version
const createWebp = () => {
  gulp.src('source/img/**/*.{jpg,png}')
      .pipe(webp({optimize: 90}))
      .pipe(gulp.dest('build/img'))
};
exports.createWebp = createWebp;


//IMAGES
const optimizeImage = () => {
  return gulp.src('source/img/**/*.{jpg,png,svg}')
    .pipe(squoosh())
    .pipe(dest('build/img'));
}
exports.images = optimizeImage;

const copyImage = () => {
  return gulp.src('source/img/**/*.{jpg,png,svg}')
    .pipe(squoosh())
    .pipe(dest('build/img'));
}
exports.images = copyImage;

//SVG
const sprite = () => {
  return gulp.src('source/img/**/*.svg')
  .pipe(svgstore({ inlineSvg: true }))
  .pipe(rename('sprite.svg'))
  .pipe(gulp.dest('build/img'));
}
exports.sprite = sprite;

// DEL






// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'source'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series("styles"));
  gulp.watch("source/*.html").on("change", sync.reload);
}

exports.default = gulp.series(
  styles, server, watcher
);
