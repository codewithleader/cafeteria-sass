const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');

function sassToCssCompiler(done) {
  // Pasos para compilar los archivos Sass
  // 1. Identificar el archivo Sass
  src('src/scss/app.scss')
    // 2. Compilarlo
    .pipe(sass())
    // .pipe(sass({ outputStyle: 'compressed' })) // Minificar el CSS
    // .pipe(sass({ outputStyle: 'expanded' })) // Expandir el CSS
    .pipe(postcss([autoprefixer()])) // Agregar los prefijos de compatibilidad
    // 3. Guardar el archivo css
    .pipe(dest('build/css'));

  done();
}

function devWatch() {
  watch('src/scss/**/*.scss', sassToCssCompiler);
}

exports.sassToCssCompiler = sassToCssCompiler;
exports.devWatch = devWatch;

exports.default = series(sassToCssCompiler, devWatch);

// series: Ejecuta tareas en serie
// parallel: Ejecuta varias tareas en paralelo