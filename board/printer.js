var inspect = require('eyes').inspector({maxLength: false});
var colors = require('colors');

exports.PrintOk = function(text) {
	console.log("[ConBoard]".green.bold.inverse, text);
}

exports.PrintError = function(text) {
	console.log("[ConBoard]".red.bold.inverse, text);
}

exports.PrintWarn = function(text) {
	console.log("[ConBoard]".yellow.bold.inverse, text);
}

exports.PrintJson = function(json) {
	inspect(json);
}