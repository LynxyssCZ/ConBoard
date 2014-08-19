window.ConBoard = window.ConBoard || {};
ConBoard.Cat = function(data) {
	this.name = data.name;
	this.id = data.id;
	this.resolution = data.resolution

	this.content = [];
	this.progs = [];
	this.markers = [];
	this.createEl();
};

// Helper method, later the data will be all suplied by board
ConBoard.Cat.prototype.fillCat = function(data) {
	this.content = data;
	this.content.sort(function(a, b) {
		return (a.startTime < b.startTime? -1 : 1);
	});
};

ConBoard.Cat.prototype.update = function(time) {

},

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
	catHead.innerHTML = this.name;
	this.head = catHead;

	var catBody = document.createElement('div');
	catBody.setAttribute('class', 'con-board-cat-body');
	this.body = catBody;

	this.el.appendChild(catHead);
	this.el.appendChild(catBody);

	for (var i = 0; i < this.resolution; i++) {
		var marker = this.createMarker();
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