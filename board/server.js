var http = require('http');
var express = require('express');

var printer = require('./printer');

var nodeApp = express();
var settings = null;
var collection;

function Start() {
	nodeApp.listen(settings.port);
	printer.PrintOk('Server started on port: ' + settings.port);
}

function Stop() {

}

function Init(collection, config) {
	settings = config;
	collection = collection;

	var programmes = {
		list: function(req, res) {
			res.send(JSON.stringify(collection.GetAll()));
		},
		get: function(req, res) {
			res.send('Get programme ID: ' + req.params.pid);
		},
		delete: function(req, res) {
			res.send('Delete programme ID: ' + req.params.pid);
		}
	};
	var routeMap = {
		'/programmes': {
			get: programmes.list,
			'/:pid': {
				get: programmes.get,
				delete: programmes.delete
			}
		}
	};

	MapRoutes(nodeApp, routeMap);
	nodeApp.get('/', function(req, res) {
		res.send('GET /programmes For complete list.</br>GET /programmes/:pid For info about specific programme.');
	});
}

module.exports = {
	createServer: Init,
	start: Start
};

function MapRoutes(app, a, route) {
	var key;
	route = route || '';
	for (key in a) {
		switch(typeof a[key]) {
			case 'object':
				MapRoutes(app, a[key], route + key);
				break;
			case 'function':
				app[key](route, a[key]);
				break;
		}
	}
}
