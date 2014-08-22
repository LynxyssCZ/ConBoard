window.ConBoard = window.ConBoard || {};
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
};
window.ConBoard = window.ConBoard || {};
ConBoard.DayEnum = ['Neděle', 'Pondělí', 'Uterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota'];
ConBoard.DeltaToString = function(delta) {
	var ms = delta % 1000;
	delta = (delta - ms) / 1000;
	var sec = delta % 60;
	delta = (delta - sec) / 60;
	var min = delta % 60;
	var hrs = (delta - min) /60;
	return ((hrs > 0)? (hrs + ':'): '' ) + ((min > 0 || hrs > 0)? (((min < 10)? ('0'+min) : min) + ':') : '') + ((sec < 10)? ('0'+sec) : sec);
};

ConBoard.TickDiff = function(ts1, ts2) {
	return (ts1 > ts2)? ts1 - ts2 : ts2 - ts1;
};

ConBoard.Board = function(boardDiv, config) {
	this.resolution = config.resolution;
	this.interval = config.interval;
	this.timeDelay = config.timeDelay;
	this.notices = config.notices;
	this.catMapper = config.catMapper;

	this.minutes;

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
		resolution: this.resolution,
		interval: this.interval
	});
	this.container.appendChild(this.head.getEl());
};

ConBoard.Board.prototype.createBody = function() {
	this.body = new ConBoard.Body({
		catKey: this.catKey,
		timeDelay: this.timeDelay
		},
		this.notices
	);

	this.container.appendChild(this.body.getEl());
};

ConBoard.Board.prototype.tick = function(event) {
	event.startTick = event.tick - (event.tick % this.interval);
	event.endTick = event.startTick + (this.resolution * this.interval);

	var startMinutes = (event.minutes > 30) ? 30 : 00;
	event.startMinutes = startMinutes;

	this.head.update(event);

	this.body.update(event);

	if(this.body.masked > 0) {
		this.head.hideLine();
	}
	else if (this.head.hidenLine && this.body.masked === 0) {
		this.head.showLine();
	}
};

ConBoard.Board.prototype.startTimer = function() {
	this.timer = new ConBoard.Timer(500);
	this.timer.on(
		this.tick,
		this
	);
	this.timer.Start();
};

ConBoard.Board.prototype.getCats = function() {
	var me = this;
	var request = ConBoard.Api.GetCats(function(error, response) {
		me.loadCats(response);
	});
};

ConBoard.Board.prototype.loadCats = function(cats) {
	cats = this.catMapper(cats);
	for (var cat in cats) {
		this.body.createCat({
			name: cats[cat],
			id: cat,
			resolution: this.resolution,
			interval: this.interval,
			key: 'location'
		});
	};
};

window.ConBoard = window.ConBoard || {};
ConBoard.Body = function(config, notices) {
	this.config = config;
	this.notices = notices;

	this.masked = 0;

	this.cats = [];

	this.createEl();
};

ConBoard.Body.prototype.update = function(time) {
	for (var i = this.cats.length - 1; i >= 0; i--) {
		this.cats[i].update(time);
	}

	if (this.notices) {
		for (var i = 0; i < this.notices.length; i++) {
			var notice = this.notices[i];
			if(notice.start < time.tick && notice.end > time.tick) {
				if (notice.rendered) {
					notice.update();
				}
				else {
					notice.create();
					this.el.appendChild(notice.getEl());
					this.masked++;
				}
			}
			else if(notice.end < time.tick && notice.rendered) {
				notice.destroy();
				this.masked--;
			}
		}
	}

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
		resolution: data.resolution,
		interval: data.interval
	});
	this.cats.push(cmp);
	this.el.appendChild(cmp.getEl());
	this.loadCat(cmp);
};

ConBoard.Body.prototype.loadCat = function(cat) {
	ConBoard.Api.GetList(cat.name, function(err, res) {
		cat.fillCat(res);
	});
};
window.ConBoard = window.ConBoard || {};
ConBoard.Cat = function(data) {
	this.name = data.name;
	this.id = data.id;
	this.resolution = data.resolution;
	this.interval = data.interval;

	this.loading = false;
	this.progIndex = 0;
	this.tillStart;
	this.content = [];
	this.progs = [];
	this.markers = [];
	this.createEl();
};

ConBoard.Cat.prototype.getProgCount = function() {
	return this.progs.length;
};



ConBoard.Cat.prototype.fillCat = function(data) {
	this.content = data;
	this.content.sort(function(a, b) {
		return (a.startTime < b.startTime? -1 : 1);
	});
	this.dirty = true;
};

ConBoard.Cat.prototype.update = function(time) {
	// move pogIndex if there are some 'top' programmes out of the window
	for (var i = this.progIndex; i < this.content.length; i++) {
		if (this.content[i].endTime < time.startTick) {
			this.progIndex = i+1;
		}
	}

	if (!this.dirty && time.startTick === this.startTick) {
		return;
	}
	this.dirty = false;
	this.startTick = time.startTick;

	// Check if we are no on the end of the programme already
	if (this.progIndex >= this.content.length) {
		return;
	}

	// Check if 'top' programme is not too far away
	if (this.progs.length === 0 && this.content.length && this.content[this.progIndex].startTime > time.endTick) {
		this.tillStart = ConBoard.TickDiff(time.tick, this.content[this.progIndex].startTime);
	}

	this.updateBody(time);
},

ConBoard.Cat.prototype.updateBody = function(time) {
	// Delete old programmes
	for (var i = 0; i < this.progs.length; i++) {
		if (this.progs[i].endTime <= time.startTick) {
			this.progs[i].destroy();
			this.progs.splice(i, 1);
			i--;
		}
		else {

		}
	};
	// Render new programmes that fit
	for (var i = this.progIndex; i < this.content.length; i++) {
		if (this.content[i].endTime > time.startTick
			&& this.content[i].startTime < time.endTick
			&& !this.content[i].rendered
		) {
			this.createProgramme(this.content[i], time);
			this.content[i].rendered = true;
		}
		// If I reach programme totally out of the window, break
		if (time.endTick < this.content[i].startTime) {
			break;
		}
	}

	for (var i = 0; i < this.progs.length; i++) {
		var prog = this.progs[i];
		var length = ((prog.endTime - prog.startTime)/this.interval)*(100/this.resolution);
		var position = (prog.startTime-time.startTick)/(this.interval)*(100/this.resolution);
		if (position <= 0 && (position+length) >= 100) {
			// Full board events
			position = 0;
			length = 100;
		}
		else if (position <= 0) {
			length = length + position;
			position = 0;
		}
		else if ((position + length) > 100) {
			length = 100 - position;
		}
		prog.updatePosition(position);
		prog.setWidth(length);
	};
};

ConBoard.Cat.prototype.createProgramme = function(data, time) {
	var prog = new ConBoard.Programme(data);

	ConBoard.Api.GetProgramme(
		data.pid,
		function(err, res) {
			if (!err && !!res) {
				prog.setDetails(res);
			}
		},
		this
	);

	this.progs.push(prog);
	this.body.appendChild(prog.getEl());
};

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
	catHead.innerHTML = '<h2>'+this.name+'</h2>';
	this.head = catHead;

	var catBody = document.createElement('div');
	catBody.setAttribute('class', 'con-board-cat-body');
	this.body = catBody;

	this.el.appendChild(catHead);
	this.el.appendChild(catBody);

	for (var i = 0; i < this.resolution; i++) {
		var marker = this.createMarker();
		marker.setAttribute('class', marker.getAttribute('class') + ' marker-'+i);
		this.markers.push(marker);
		catBody.appendChild(marker);
	};

	return catEl;
};

ConBoard.Cat.prototype.createMarker = function() {
	var markEl = document.createElement('div');
	markEl.setAttribute('class', 'con-board-cat-body-marker');
	return markEl;
};

window.ConBoard = window.ConBoard || {};
ConBoard.Head = function(config) {
	this.resolution = config.resolution;
	this.interval = config.interval;
	this.pieces = [];

	this.createEl();
	this.lineEl.innerHTML;
	for (var i = 0; i < this.resolution; i++) {
		var piece = this.createPiece(i);
		this.pieces.push(piece);
		this.lineEl.appendChild(piece);
	};
	this.hidenLine = false;
};

ConBoard.Head.prototype.hideLine = function() {
	this.lineEl.style.visibility = 'hidden';
	this.hidenLine = true;
};

ConBoard.Head.prototype.showLine = function() {
	this.lineEl.style.visibility = 'visible';
	this.hidenLine = false;
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
	var pieceEl = document.createElement('div');
	pieceEl.setAttribute('class', 'con-board-head-line-piece');

	return pieceEl;
};

ConBoard.Head.prototype.updatePiece = function(i, hh, mm) {
	this.pieces[i].innerHTML = '<h2>' + hh + ':' + mm + '</h2>';
};

ConBoard.Head.prototype.update = function(time) {
	var hour = time.hours,
		startMin,
		pieceCount = this.pieces.length,
		minutes;

	if (time.minutes === this.minutes) {
		return;
	}
	this.minutes = time.minutes;

	if (time.minutes < 10) {
		minutes = '0' + time.minutes.toString();
	}
	else {
		minutes = time.minutes;
	}

	this.timeEl.innerHTML = '<h2>'+ConBoard.DayEnum[time.day] + '</br>' + hour + ':' + minutes+'</h2>';

	if (this.startTick === time.startTick) {
		return;
	}
	this.startTick = time.startTick;

	var tock = new Date(time.startTick);

	for (var i = 0; i < pieceCount; ++i) {
		startMin = (tock.getMinutes() < 10)? '0' + tock.getMinutes().toString() : tock.getMinutes();
		hour = tock.getHours();
		this.updatePiece(i, hour, startMin);
		tock.setTime(tock.getTime() + this.interval);
	};
};

window.ConBoard = window.ConBoard || {};
ConBoard.Programme = function(data) {
	this.pid = data.pid;
	this.startTime = data.startTime;
	this.endTime = data.endTime;

	this.el = undefined;

	this.createEl();
};

ConBoard.Programme.prototype.setDetails = function(data) {
	this.title = data.title;
	this.author = data.author;
	this.location = data.location;
	this.programLine = data.programLine;
	this.type = data.type;
	this.annotation = data.annotation;
	this.updateBody();
};

ConBoard.Programme.prototype.setWidth = function(width) {
	this.width = width;
	this.el.style.width = width + '%';
};

ConBoard.Programme.prototype.updatePosition = function(position) {
	this.position = position;
	this.el.style.left = position + '%';
};

ConBoard.Programme.prototype.destroy = function() {
	this.el.parentNode.removeChild(this.el);
};

ConBoard.Programme.prototype.createEl = function() {
	var pEl = document.createElement('div');
	pEl.setAttribute('class', 'con-board-programme');
	pEl.setAttribute('id', 'programme-' + this.pid);
	this.el = pEl;
	this.detail = document.createElement('div');
	this.detail.setAttribute('class', 'con-board-programme-detail');
	this.detail.innerHTML = 'Loading...</br>' + this.pid;
	this.el.appendChild(this.detail);
};

ConBoard.Programme.prototype.updateBody = function() {
	this.detail.innerHTML = '<h2 class="con-board-programme-detail-title">' + this.title + '</h2><h3 class="con-board-programme-detail-author">' + this.author + "</h3>";
	this.detail.setAttribute('class', this.detail.getAttribute('class') + ' type-'+this.type);
};

ConBoard.Programme.prototype.getEl = function() {
	return this.el;
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
};
window.ConBoard = window.ConBoard || {};
ConBoard.Timer = function(interval) {
	this.interval = interval || 500;
	this.listeners = [];
};

ConBoard.Timer.prototype.Start = function() {
	this.interval = window.setInterval(this.Tick.bind(this), this.interval);
	this.Tick();
};

ConBoard.Timer.prototype.Tick = function() {
	//var tick = Date.now() + 257908000 + (3*30*60*1000);
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
ConBoard.Notice = function(config) {
	this.el;
	this.content;

	this.start = config.start;
	this.end = config.end;
	this.callback = config.callback;
	this.class = config.class;

	this.rendered = false;
};

ConBoard.Notice.prototype.create = function() {
	this.rendered = true;
	this.createMask();
	this.createContent();
	this.callback(this);
};

ConBoard.Notice.prototype.getEl = function() {
	return this.el;
}

ConBoard.Notice.prototype.createContent = function() {
	this.content = document.createElement('div');
	this.content.setAttribute('class', 'notice' + ((this.class)? ' '+this.class : ''));
	this.el.appendChild(this.content);
};

ConBoard.Notice.prototype.setContent = function(content) {
	this.content.innerHTML = content;
};

ConBoard.Notice.prototype.createMask = function() {
	maskEl = document.createElement('div');
	maskEl.setAttribute('class', 'con-board-body-mask' + ((this.class)? ' '+this.class : ''));
	this.el = maskEl;
};

ConBoard.Notice.prototype.destroy = function() {
	this.rendered = false;
	this.el.parentNode.removeChild(this.el);
	delete this.el;
	delete this.content;
};

ConBoard.Notice.prototype.update = function() {
	this.callback(this);
};