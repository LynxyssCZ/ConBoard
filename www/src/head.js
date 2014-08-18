window.ConBoard = window.ConBoard || {};
ConBoard.Head = function(config) {
	this.resolution = config.resolution;
	this.interval = config.interval;
	this.pieces = [];
	this.createEl();
	this.lineEl.innerHTML = 'Timeline start';
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
	headEl.appendChild(timeEl);
	headEl.appendChild(lineEl);

	this.logo = logoEl;
	this.lineEl = lineEl;
	this.timeEl = timeEl;
	this.el = headEl;
};

ConBoard.Head.prototype.createPiece = function(interval) {

};

ConBoard.Head.prototype.DayEnum = ['Nedele', 'Pondeli', 'Utery', 'Streda', 'Ctvrtek', 'Patek', 'Sobota'];

ConBoard.Head.prototype.update = function(time) {
	this.timeEl.innerHTML = this.DayEnum[time.day] + ' ' + time.hours + ':' + time.minutes;
};
