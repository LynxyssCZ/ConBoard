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
	this.pieces[i].innerHTML = hh + ':' + mm;
};

ConBoard.Head.prototype.update = function(time) {
	var hour = time.hours,
		startMin = (time.minutes >= 30)? '30': '00',
		pieceCount = this.pieces.length,
		minutes;

	if (time.minutes < 10) {
		minutes = '0' + time.minutes.toString();
	}
	else {
		minutes = time.minutes;
	}

	this.timeEl.innerHTML = ConBoard.DayEnum[time.day] + ' ' + hour + ':' + minutes;

	for (var i = 0; i < pieceCount; ++i) {
		this.updatePiece(i, hour, startMin);
		if (startMin == '30') {
			hour = (hour < 23)? (hour+1) : 0;
			startMin = '00';
		}
		else {
			startMin = 30;
		}
	};
};
