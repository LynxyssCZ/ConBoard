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