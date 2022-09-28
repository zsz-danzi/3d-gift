
//路径 path
var path = '';

var gulp=require("gulp"),
	browserSync=require("browser-sync"),
	watch = require('gulp-watch');



//自动刷新
gulp.task("f5",function(){
	browserSync({
		files:"**",
		server:{
			baseDir:"./"
		}
	});

	watch('**.import.css',function(){
		browserSync.reload();
	});
	
	// gulp.watch('**.import.css',function(){
	// 	browserSync.reload();
	// });
})



//默认事件
gulp.task("default",['f5']);