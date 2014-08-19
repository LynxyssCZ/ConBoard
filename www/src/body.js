window.ConBoard = window.ConBoard || {};
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
};