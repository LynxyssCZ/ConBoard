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

ConBoard.Programme.prototype.setWidth = function(width) {
	this.el.style.width = width;
};

ConBoard.Programme.prototype.updatePosition = function(position) {
	this.el.style.left = position;
};

ConBoard.Programme.prototype.destroy = function() {
	this.el.parentNode.removeChild(this.el);
};

ConBoard.Programme.prototype.createEl = function() {
	var pEl = document.createElement('div');
	pEl.setAttribute('class', 'con-board-programme');
	pEl.setAttribute('id', 'programme-' + this.pid);
	this.el = pEl;
};

ConBoard.Programme.prototype.getEl = function() {
	return this.el;
};
