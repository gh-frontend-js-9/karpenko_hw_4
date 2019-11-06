const gulp = require('gulp'),
    gulp_sass = require('gulp-sass'),
    browser_sync = require('browser-sync'),
    gulp_uglify = require('gulp-uglify'),
    concat = require('gulp-concat')
    // cleanCSS = require('gulp-clean-css')

// const imagemin = require('gulp-imagemin'),
//     mozjpeg = require('imagemin-mozjpeg'),
//     pngquant = require('imagemin-pngquant'),
//     del = require('del')

// compile sass to css
gulp.task('sass', () => {
    return gulp.src('app/public/stylesheets/sass/*.sass')
    .pipe(gulp_sass({
        outputStyle: 'expandet'
    })).on('error', gulp_sass.logError)
    .pipe(concat('all.min.css'))
    // .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('app/public/stylesheets/css'))
    .pipe(browser_sync.reload({
        stream: true
    }))
})

// Auto reload page on change sourse
gulp.task('html', () => {
    return gulp.src('app/views/index.html')
    .pipe(browser_sync.reload({stream: true}))
})
gulp.task('script', () => {
    return gulp.src('app/public/javascripts/*.js')
    .pipe(browser_sync.reload({stream: true}))
})

// Minify js
gulp.task('js', () => {
    return gulp.src([
        'app/public/javascripts/original/**/*'
    ])
    .pipe(concat('.min.js'))
    .pipe(gulp_uglify())
    .pipe(gulp.dest('app/public/javascripts/min/'))
    .pipe(browser_sync({stream: true}))
})

// Minifed images
gulp.task("images", () => {
    return gulp.src(['app/public/images/original/**/*'])
    .pipe(cache(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.jpegtran({progressive: true}),
      imagemin.optipng({optimizationLevel: 1}),
      imagemin.svgo({
        plugins: [
            {removeViewBox: true},
            {cleanupIDs: false}
        ]}),
        mozjpeg({quality: 70}),
        pngquant({quality: [0.5, 0.5]}),
    ])))
    .pipe(gulp.dest('public/images/minifed'))
})

// Clear all cramped data after quit
// gulp.task('clear', () => {
//     del.sync('app/public/images/minifed')
//     del.sync('app/public/stylesheets/sass')
//     del.sync('app/public/javascrits/min')
// })

// Browser syncronisation
gulp.task('browser-sync', () => {
    browser_sync.init({
        server: {
            baseDir: 'app/',
            index: "app/views/index.html",
            directory: true
        },
        open: false
    })
})

gulp.task('watch', () => {
    gulp.watch('app/public/stylesheets/css/*.css', gulp.parallel('sass'));
    gulp.watch('app/views/**/*.html', gulp.parallel('html'))
    gulp.watch('app/javascripts/min/*.js')
})

gulp.task('default', gulp.parallel('sass', 'browser-sync', 'watch'))