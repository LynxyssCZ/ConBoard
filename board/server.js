var http = require('http');
var express = require('express');

var printer = require('./printer');

var nodeApp = express();
var settings = null;
var collection;
var api = [];

function Start() {
	nodeApp.listen(settings.port);
	printer.PrintOk('Server started on port: ' + settings.port);
}

function Stop() {

}

function Init(dataCollection, config) {
	settings = config;
	collection = dataCollection;
	registerParams();
	MapRoutes(nodeApp, initRoutes());
	nodeApp.get('/api/', function(req, res) {
		res.send(api);
	});
	nodeApp.use('/', express.static(__dirname + '../www'));
	
}

module.exports = {
	createServer: Init,
	start: Start
};

function registerParams() {
	nodeApp.param('key', function(req, res, next, raw) {
		var pure = decodeURIComponent(raw.replace(/\+/g, ' '));
		req.loc = pure;
		next();
	});
	nodeApp.param('value', function(req, res, next, raw) {
		var pure = decodeURIComponent(raw.replace(/\+/g, ' '));
		req.loc = pure;
		next();
	});
	nodeApp.param('pid', function(req, res, next, pId) {
		var id;
		if (pId >= 0) {
			id = pId
		}
		req.pid = id;
		next();
	});
}

function initRoutes() {
	var programmes = {
		list: function(req, res) {
			res.send(collection.getAll());
		},
		getById: function(req, res) {
			res.send(collection.getAtKey(req.params.pid));
		},
		update: function(req, res) {
			res.send('Update programme ID: ' + req.pid);
		},
		delete: function(req, res) {
			res.send('Delete programme ID: ' + req.pid);
		},
		getByParam: function(req, res) {
			res.send(collection.getBy(req.params.key, req.loc));
		}
	};

	var routeMap = {
		'/programmes': {
			get: programmes.list,
			'/:pid': {
				get: programmes.getById,
				post: programmes.update,
				delete: programmes.delete
			},
			'/:key' : {
				'/:value': {
					get: programmes.getByParam
				}
			}
		}
	};
	return routeMap;
}

function MapRoutes(app, a, route) {
	var key;
	route = route || '';
	for (key in a) {
		switch(typeof a[key]) {
			case 'object':
				MapRoutes(app, a[key], route + key);
				break;
			case 'function':
				api.push(route);
				app[key](route, a[key]);
				break;
		}
	}
}
