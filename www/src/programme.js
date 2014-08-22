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
