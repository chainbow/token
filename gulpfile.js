const gulp = require('gulp')
const del = require('del')
const shell = require('gulp-shell')

gulp.task('testrpc', shell.task('node_modules/.bin/testrpc --account="0xfeb72ffb6bb482e3d4b5f0168f24ece904e8ddb7d3076362b94a209078666de6,6000000000000000000000000" --account="0xdd1f69c790ec35a5e70b6511b2c7128a23109617372bcc3102d0caef47ffdf0e,10000000000000000000" --account="0xfe1b14649a99e27ad630e19d114330db7fc30870c4fd8a5d3946a15cd0b111d6,100000000000000000000" --account="0xa61266a8513e80ad455ff5764e155ab492c365a2b720084a77427436eb3de01c,100000000000000000000"　'))

gulp.task('test', ['build'], shell.task('node_modules/.bin/truffle test test/test_01_token.js'))

gulp.task('contracts:compile', shell.task('node_modules/.bin/truffle compile'))
gulp.task('contracts:migrate:development', shell.task('node_modules/.bin/truffle migrate --network development'))
gulp.task('contracts:migrate:testnet', shell.task('node_modules/.bin/truffle migrate --network testnet'))
// gulp.task('contracts:migrate:live', shell.task('node_modules/.bin/truffle migrate --network live'));
gulp.task('contracts:migrate:reset', shell.task('node_modules/.bin/truffle migrate --reset'))

gulp.task('webpack', ['theme', 'contracts:compile'], shell.task('./node_modules/.bin/webpack --mode production --optimize-minimize --config webpack.dist.config.js'))

gulp.task('theme', function () {
  return gulp.src(['app/**/*.*', '!app/src/*.*', '!app/contracts/*.*'])
    .pipe(gulp.dest('build/'))
})

gulp.task('copyContract', function () {
  return gulp.src(['build/contracts/**/*.*'])
    .pipe(gulp.dest('app/contracts/'))
})

gulp.task('build', ['theme', 'contracts:compile', 'copyContract'])

gulp.task('clean', function () {
  del(['build'])
})

gulp.task('watch', ['theme', 'contracts:compile', 'copyContract'], function () {
  gulp.watch(['app/**/*.*', '!app/src/*.*'], ['theme'])
  gulp.watch(['contracts/**/*.sol'], ['contracts:compile', 'copyContract'])
})

gulp.task('dev', ['watch'], shell.task('./node_modules/.bin/webpack-dev-server --mode development --content-base build/ --hot --watch-content-base --config webpack.config.js'))

gulp.task('default', ['build', 'contracts:compile'])
