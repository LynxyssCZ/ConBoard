var http = require('http');
var express = require('express');

var printer = require('./printer');
shelljs = require('shelljs/global');
var nodeApp = express();
var settings = null;
var collection;
var api = [];

function Start() {
	nodeApp.listen(settings.port);
	printer.PrintOk('Server started on port: ' + settings.port);
	exec('midori -e Fullscreen -a 127.0.0.1:' + settings.port + ' -e Reload');
}

function Stop() {

}

function Init(dataCollection, config) {
	settings = config;
	collection = dataCollection;
	registerParams();
	nodeApp.use(express.static(settings.staticPath));
	nodeApp.use('/data', express.static(settings.dataPath + '/www'));
	nodeApp.use('/img', express.static(settings.dataPath + '/img'));

	MapRoutes(nodeApp, initRoutes());
	nodeApp.get('/api', function(req, res) {
		res.send(api);
	});
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
		},
		getCats: function(req, res) {
			res.send(collection.getCategoryList());
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
			'/:key/:value': {
				get: programmes.getByParam
			}
		},
		'/categories': {
			get: programmes.getCats
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
				api.push(key + ' ' + route);
				app[key](route, a[key]);
				break;
		}
	}
}
