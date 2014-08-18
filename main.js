var fs = require('fs');
var http = require('http');
var https = require('https');
var path = require('path');

var settings = require('./settings');
var server = require('./board/server');
var board = require('./board/board');
var parser = require('./board/parser');
var printer = require('./board/printer');
var collection = require('./board/collection');

printer.PrintOk('Starting ConBoard', 'nom');
printer.PrintOk('Setting up data');

if (Date.now() < settings.minTime) {
	printer.PrintError('Server time too low!');
	gracefulExit();
}

setupData(settings.dataPath + '/' + settings.sourceName, storeData);

// Server start
server.createServer(collection, {
	port: settings.port,
	staticPath: path.resolve(settings.wwwPath),
	dataPath: path.resolve(settings.dataPath)
});
server.start();

function storeData(err, data) {
	if (!err, !!data) {
		printer.PrintOk('End of data setup');
		collection.Init(
			{
				recordIndex: settings.recordIndex,
				recordFields: settings.recordFields,
				recordCatField: settings.recordCatField,
				ignoredCats: settings.ignoredCats
			},
			data
		);
	}
	else {
		printer.PrintError('Error while loading source data');
		gracefulExit();
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