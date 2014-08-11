var fs = require('fs');
var http = require('http');
var https = require('https');

var settings = require('./settings');
var server = require('./board/server');
var board = require('./board/board');
var parser = require('./board/parser');
var inspect = require('eyes').inspector({maxLength: false});


setupData(settings.sourcePath, prettyPrint);


function prettyPrint(err, data) {
	if (!err, !!data) {
		inspect(data);
	}
}

function setupData(sourcePath, callback) {
	try {
		var sourceData = fs.readFileSync(sourcePath);
	} catch(exception) {
		sourceData = '';
		console.log('And error ocured while reading the source file.');
		console.log('Stack trace:\n' + exception.stack);
	}
	parser.Parse(sourceData, callback);
}
