require("shelljs/global");
var fs = require("fs");

var file = __dirname + '/build.json';

fs.readFile(
	file,
	'utf8',
	function(err, res) {
		if(!err && !!res) {
			data = JSON.parse(res);
			cat(data.src).to(data.min);
			uglify(data.min, data.build);
			exec('sass '+data.scss+' '+data.css);
		}
	});

function uglify(src, dst) {
	var uglifier = require('uglify-js');

	fs.writeFileSync(dst, uglifier.minify(src).code);
	console.log('Built');
}
