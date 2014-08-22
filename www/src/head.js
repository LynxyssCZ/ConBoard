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
