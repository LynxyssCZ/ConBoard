var fs = require('fs');
var http = require('http');
var https = require('https');

var settings = require('./settings');
var server = require('./board/server');
var board = require('./board/board');
var parser = require('./board/parser');
var printer = require('./board/printer');
var collection = require('./board/collection');

printer.PrintOk('Starting ConBoard', 'nom');
printer.PrintOk('Setting up data');
setupData(settings.sourcePath, storeData);

// Server start
server.createServer(collection, settings);
server.start();

function storeData(err, data) {
	if (!err, !!data) {
		printer.PrintOk('End of data setup');
		collection.Init({index: settings.index, segmentation: settings.segmentation}, data);
	}
	else {
		printer.PrintError('Error while loading data');
		process.exit();
	}
}

function prettyPrint(err, data) {
	if (!err, !!data) {
		printer.PrintJson(data);
		printer.PrintOk('End of data');
	}
}

function setupData(sourcePath, callback) {
	try {
		var sourceData = fs.readFileSync(sourcePath);
	}
	catch(exception) {
		sourceData = '';
		printer.PrintError('And error ocured while reading the source file.');
		printer.PrintError('Stack trace:\n' + exception.stack);
	}
	parser.Parse(sourceData, callback);
}

function gracefulExit() {
	printer.PrintOk('Exiting ConBoard');
	process.exit();
}

process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);