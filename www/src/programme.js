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
