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

function scssToCssCompiler(done) {
  // Pasos para compilar los archivos Sass
  // 1. Identificar el archivo Sass
  src('src/scss/style.scss')
    // 2. Compilarlo
    .pipe(sass())
    // .pipe(sass({ outputStyle: 'compressed' })) // Minificar el CSS
    // .pipe(sass({ outputStyle: 'expanded' })) // Expandir el CSS
    .pipe(postcss([autoprefixer()])) // Agregar los prefijos de compatibilidad
    // 3. Guardar el archivo css
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
  optimizeImg,
  webpImg,
  avifImg,
  scssToCssCompiler,
  watchTask
);
// exports.default = parallel(optimizeImg, scssToCssCompiler, watchTask);

// series: Ejecuta tareas en serie
// parallel: Ejecuta varias tareas en paralelo
