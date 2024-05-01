const {
  src,
  dest,
  watch,
  series,
  // parallel
} = require('gulp');

// Css + Sass
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');

// Images
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

// SourceMaps: Mapear los archivos originales a los archivos compilados
const sourcemaps = require('gulp-sourcemaps');

// cssnano: minificar CSS
const cssnano = require('cssnano');

function scssToCssCompiler(done) {
  // Pasos para compilar los archivos Sass
  // 1. Identificar el archivo Sass
  src('src/scss/style.scss')
    .pipe(sourcemaps.init())
    // 2. Compilarlo
    .pipe(sass())
    // .pipe(sass({ outputStyle: 'compressed' })) // Minificar el CSS
    // .pipe(sass({ outputStyle: 'expanded' })) // Expandir el CSS
    .pipe(
      postcss([
        autoprefixer(), // Agregar los prefijos de compatibilidad
        cssnano(), // Minificar el CSS (reduce y optimiza el css)
      ])
    )
    // 3. Guardar el archivo css
    .pipe(sourcemaps.write('.'))
    .pipe(dest('public/css'));

  done();
}

function optimizeImg(done) {
  src('src/images/**/*')
    .pipe(imagemin({ optimizationLevel: 3 }))
    .pipe(dest('public/img'));

  done();
}

// Convertir imagenes a webp
function webpImg(done) {
  const options = {
    quality: 50,
  };

  src('src/images/**/*.{png,jpg}')
    //
    .pipe(webp(options))
    .pipe(dest('public/img'));

  done();
}

// Convertir imagenes a avif
function avifImg(done) {
  const options = {
    quality: 50,
  };

  src('src/images/**/*.{png,jpg}')
    //
    .pipe(avif(options))
    .pipe(dest('public/img'));

  done();
}

function watchTask() {
  watch('src/scss/**/*.scss', scssToCssCompiler);
  watch('src/images/**/*', optimizeImg);
}

exports.scssToCssCompiler = scssToCssCompiler;
exports.optimizeImg = optimizeImg;
exports.webpImg = webpImg;
exports.avifImg = avifImg;
exports.watchTask = watchTask;

exports.default = series(
  scssToCssCompiler,
  optimizeImg,
  webpImg,
  avifImg,
  watchTask
);
// exports.default = parallel(optimizeImg, scssToCssCompiler, watchTask);

// series: Ejecuta tareas en serie
// parallel: Ejecuta varias tareas en paralelo
