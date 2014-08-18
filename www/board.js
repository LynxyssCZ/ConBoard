window.ConBoard = window.ConBoard || {};
ConBoard.Board = function(boardDiv) {
	this.cats = [];
	this.container = boardDiv;
	this.container.style.width = document.body.clientWidth;

	this.createHead();
	this.createBody();
	this.getCats();
	this.startTimer();
};

ConBoard.Board.prototype.DayEnum = ['Nedele', 'Pondeli', 'Utery', 'Streda', 'Ctvrtek', 'Patek', 'Sobota'];

ConBoard.Board.prototype.createHead = function() {
	this.head = document.createElement('div');
	this.head.setAttribute('class', 'con-board-head');
	this.container.appendChild(this.head);
};

ConBoard.Board.prototype.createBody = function() {
	this.body = document.createElement('div');
	this.body.setAttribute('class', 'con-board-body');
	this.container.appendChild(this.body);
};

ConBoard.Board.prototype.updateHead = function(time) {
	this.head.innerHTML = this.DayEnum[time.day] + ' ' + time.hours + ':' + time.minutes;
}

ConBoard.Board.prototype.tick = function(event) {
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
	var request = new ConBoard.Request('GET', '/categories', function(response) {
		var res = JSON.parse(response);
		me.loadCats(res);
	});
	request.send();
};

ConBoard.Board.prototype.loadCats = function(cats) {
	var catSize = Math.floor(100 / cats.length);
	for (var cat in cats) {
		var cmp = new ConBoard.Cat({
			name: cats[cat],
			height: catSize + '%',
			width: this.body.clientwidth,
			id: cat,
			key: 'location'
		});
		this.cats.push(cmp);
		this.body.appendChild(cmp.getEl());
	};
};


window.ConBoard = window.ConBoard || {};
ConBoard.Cat = function(config) {
	this.config = config;
	this.progs = [];
	this.createEl();
	this.fillCat();
};

ConBoard.Cat.prototype.update = function(time) {
	this.body.innerHTML = '';
	// Remove the one which floated out
	if (this.progs.length > 0 && this.progs[0].endTime > time) {
		this.progs[0].destroy();
		this.progs.splice(0, 1);
	}

	for (var i in this.content) {
		if (time < this.content[i].startTime && this.content[i]) {

			if (this.content[i].startTime > time + 7200000) {
				console.log('Some programme is out of timeline');
				break;
			}
		}
	}
},
// Helper method, later the data will be all suplied by board
ConBoard.Cat.prototype.fillCat = function() {
	var me = this;
	var request = new ConBoard.Request('GET',
		'/programmes/' + this.config.key + '/' +this.config.name,
		function(res) {
			function cmp(a, b) {
				return (a.startTime < b.startTime? -1 : 1);
			}
			me.content = JSON.parse(res);
			me.content.sort(cmp);
		});
	request.send();
};

ConBoard.Cat.prototype.getEl = function() {
	return this.el;
};

ConBoard.Cat.prototype.createEl = function() {
	var catEl = document.createElement('div');
	catEl.setAttribute('class', 'con-board-cat');
	catEl.setAttribute('id', 'con-board-cat-'+this.config.id);
	catEl.style.height = this.config.height;
	catEl.style.width = this.config.width;
	this.el = catEl;

	var catHead = document.createElement('div');
	catHead.setAttribute('class', 'con-board-cat-head');
	catHead.innerHTML = this.config.name;
	this.head = catHead;

	var catBody = document.createElement('div');
	catBody.setAttribute('class', 'con-board-cat-body');
	this.body = catBody;

	this.el.appendChild(catHead);
	this.el.appendChild(catBody);

	return catEl;
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
	if (xhr.readyState === 4) {
		callback(xhr.response);
	}
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

