window.ConBoard = window.ConBoard || {};
ConBoard.Cat = function(data) {
	this.name = data.name;
	this.id = data.id;
	this.resolution = data.resolution

	this.content = [];
	this.progs = [];
	this.markers = [];
	this.createEl();
};

// Helper method, later the data will be all suplied by board
ConBoard.Cat.prototype.fillCat = function(data) {
	this.content = data;
	this.content.sort(function(a, b) {
		return (a.startTime < b.startTime? -1 : 1);
	});
};

ConBoard.Cat.prototype.update = function(time) {

},

ConBoard.Cat.prototype.getEl = function() {
	return this.el;
};

ConBoard.Cat.prototype.createEl = function() {
	var catEl = document.createElement('div');
	catEl.setAttribute('class', 'con-board-cat');
	catEl.setAttribute('id', 'con-board-cat-'+this.id);
	this.el = catEl;

	var catHead = document.createElement('div');
	catHead.setAttribute('class', 'con-board-cat-head');
	catHead.innerHTML = this.name;
	this.head = catHead;

	var catBody = document.createElement('div');
	catBody.setAttribute('class', 'con-board-cat-body');
	this.body = catBody;

	this.el.appendChild(catHead);
	this.el.appendChild(catBody);

	for (var i = 0; i < this.resolution; i++) {
		var marker = this.createMarker();
		this.markers.push(marker);
		catBody.appendChild(marker);
	};

	return catEl;
};

ConBoard.Cat.prototype.createMarker = function() {
	var markEl = document.createElement('div');
	markEl.setAttribute('class', 'con-board-cat-body-marker');
	return markEl;
};window.ConBoard = window.ConBoard || {};
window.ConBoard.Api = {};
ConBoard.Api.GetCats = function(callback, scope) {
	var request = new ConBoard.Request(
		'GET',
		'/categories/',
		function(err, res) {
			ConBoard.Api._return(err, res, callback, scope)
	});
	request.send();
	return request;
};

ConBoard.Api.GetList = function(catName, callback, scope) {
	var request = new ConBoard.Request(
		'GET',
		'/programmes/location/' + catName + '/',
		function(err, res) {
			ConBoard.Api._return(err, res, callback, scope)
	});
	request.send();
	return request;
};

ConBoard.Api.GetProgramme = function(id, callback, scope) {
	var request = new ConBoard.Request(
		'GET',
		'/programmes/' + id + '/',
		function(err, res) {
			ConBoard.Api._return(err, res, callback, scope)
	});
	request.send();
	return request;
};

ConBoard.Api.GetAllProgrammes = function(callback, scope) {
	var request = new ConBoard.Request(
		'GET',
		'/programmes/',
		function(err, res) {
			ConBoard.Api._return(err, res, callback, scope)
	});
	request.send();
	return request;
};

ConBoard.Api._return = function(error, response, callback, scope) {
	var res, err;
	scope = scope || window;
	if (!error && !!response) {
		try {
			res = JSON.parse(response);
		}
		catch (e) {
			err = e;
		}
		callback.call(scope, err, res);
	}
	else {
		callback.call(scope ,error, undefined);
	}
};window.ConBoard = window.ConBoard || {};
ConBoard.Body = function(config) {
	this.config = config;

	this.cats = [];

	this.createEl();
};

ConBoard.Body.prototype.getEl = function() {
	return this.el;
};

ConBoard.Body.prototype.createEl = function() {
	this.el = document.createElement('div');
	this.el.setAttribute('class', 'con-board-body');
};

ConBoard.Body.prototype.getCat = function(index) {
	return this.cats[i] || {};
};

ConBoard.Body.prototype.getCatCount = function() {
	return this.cats.length;
};

ConBoard.Body.prototype.createCat = function(data) {
	var cmp = new ConBoard.Cat({
		name: data.name,
		id: this.cats.length,
		resolution: data.resolution
	});
	this.cats.push(cmp);
	this.el.appendChild(cmp.getEl());
	this.loadCat(cmp);
};

ConBoard.Body.prototype.loadCat = function(cat) {
	ConBoard.Api.GetList(cat.name, function(err, res) {
		cat.fillCat(res);
	});
};window.ConBoard = window.ConBoard || {};
ConBoard.DayEnum = ['Neděle', 'Pondělí', 'Uterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota'];

ConBoard.Board = function(boardDiv, config) {
	this.resolution = config.resolution;

	this.cats = [];
	this.container = boardDiv;
	this.container.style.width = document.body.clientWidth;

	this.createHead();
	this.createBody();
	this.getCats();
	this.startTimer();
};

ConBoard.Board.prototype.createHead = function() {
	this.head = new ConBoard.Head({

	});
	this.container.appendChild(this.head.getEl());
};

ConBoard.Board.prototype.createBody = function() {
	this.body = new ConBoard.Body({
		catKey: this.catKey
	});

	this.container.appendChild(this.body.getEl());
};

ConBoard.Board.prototype.updateHead = function(time) {
	if (time.minutes < 10) {
		time.minutes = '0' + time.minutes.toString();
	}
	this.head.update(time);
	console.log('Starting interval is', time.hours, time.startMinutes);

}

ConBoard.Board.prototype.tick = function(event) {
	var startMinutes = (event.minutes > 30) ? 30 : 00;
	event.startMinutes = startMinutes;
	this.updateHead(event);

	for (var i in this.cats) {
		this.cats[i].update(event.tick);
	}
};

ConBoard.Board.prototype.startTimer = function() {
	this.timer = new ConBoard.Timer();
	this.timer.Start();
	this.timer.on(
		this.tick,
		this
	);
};

ConBoard.Board.prototype.getCats = function() {
	var me = this;
	var request = ConBoard.Api.GetCats(function(error, response) {
		me.loadCats(response);
	});
};

ConBoard.Board.prototype.loadCats = function(cats) {
	for (var cat in cats) {
		this.body.createCat({
			name: cats[cat],
			id: cat,
			resolution: this.resolution,
			key: 'location'
		});
	};
};
window.ConBoard = window.ConBoard || {};
ConBoard.Request = function(method, url, callback) {
	var me = this;
	this.xhr = new XMLHttpRequest();
	this.method = method;
	this.url = url;
	this.callback = callback;

	this.xhr.onreadystatechange = function() {
		me.onStateChange(me.xhr, me.callback);
	};
	this.xhr.open(this.method, this.url);
};

ConBoard.Request.prototype.send = function() {
	this.xhr.send();
};

ConBoard.Request.prototype.onStateChange = function(xhr, callback) {
	var error;
	if (xhr.readyState === 4) {
		callback(error, xhr.response);
	}
};window.ConBoard = window.ConBoard || {};
ConBoard.Head = function(config) {
	this.resolution = config.resolution;
	this.interval = config.interval;
	this.pieces = [];
	this.createEl();
	this.lineEl.innerHTML;
	for (var i = 0; i < this.resolution; i++) {
		this.createPiece(i);
	};
};

ConBoard.Head.prototype.getEl = function() {
	return this.el;
};

ConBoard.Head.prototype.createEl = function() {
	var headEl = document.createElement('div'),
		timeEl = document.createElement('div'),
		lineEl = document.createElement('div'),
		logoEl = document.createElement('div');

	headEl.setAttribute('class', 'con-board-head');
	lineEl.setAttribute('class', 'con-board-head-line');
	timeEl.setAttribute('class', 'con-board-head-time');
	logoEl.setAttribute('class', 'con-board-head-logo');

	headEl.appendChild(logoEl);
	headEl.appendChild(lineEl);
	headEl.appendChild(timeEl);

	this.logo = logoEl;
	this.lineEl = lineEl;
	this.timeEl = timeEl;
	this.el = headEl;
};

ConBoard.Head.prototype.createPiece = function(interval) {
	var pieceEl = document.createEl('div');
};

ConBoard.Head.prototype.update = function(time) {
	this.timeEl.innerHTML = ConBoard.DayEnum[time.day] + ' ' + time.hours + ':' + time.minutes;
};
window.ConBoard = window.ConBoard || {};
ConBoard.Programme = function(data) {
	this.pid = data.pid;
	this.title = data.title;
	this.startTime = data.startTime;
	this.endTime = data.endTime;
	this.author = data.author;
	this.location = data.location;
	this.programLine = data.programLine;
	this.type = data.type;
	this.annotation = data.annotation;

	this.el = undefined;

	this.createEl();
};
// Helper method, later, data will be loaded from outside
ConBoard.Programme.prototype.load = function(id) {

};

ConBoard.Programme.prototype.destroy = function() {
	this.el.parentnode.removeChild(this.el);
}

ConBoard.Programme.prototype.createEl = function() {
	var pEl = document.createEl('div');
}

ConBoard.Programme.prototype.getEl = function() {
	return this.el;
};
window.ConBoard = window.ConBoard || {};
ConBoard.Timer = function() {
	this.interval = 500;
	this.listeners = [];
};

ConBoard.Timer.prototype.Start = function() {
	this.interval = window.setInterval(this.Tick.bind(this), this.interval);
};

ConBoard.Timer.prototype.Tick = function() {
	var tick = Date.now();
	var tock = new Date(tick);
	var stamp = {
		tick: tick,
		day: tock.getDay(),
		hours: tock.getHours(),
		minutes: tock.getMinutes()
	};

	for(var i in this.listeners) {
		var fn = this.listeners[i].fn,
			sc = this.listeners[i].scope || window;
		fn.call(sc, stamp);
	}
};

ConBoard.Timer.prototype.on = function(fn, scope) {
	this.listeners.push({fn: fn, scope: scope});
};

ConBoard.Timer.prototype.off = function(fn, scope) {
	for (var i in this.listeners) {
		var listener = listeners[i];
		if (listener.fn === fn && scope === listener.scope) {
			listeners.splice(i, 1);
			return;
		}
	}
};

ConBoard.Timer.prototype.Stop = function() {
	window.clearInterval(this.interval);
};