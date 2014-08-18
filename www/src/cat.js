window.ConBoard = window.ConBoard || {};
ConBoard.Cat = function(config) {
	this.config = config;
	this.progs = [];
	this.createEl();
	this.fillCat();
};

// Helper method, later the data will be all suplied by board
ConBoard.Cat.prototype.fillCat = function() {
	var me = this;
	var request = new ConBoard.Request('GET',
		'/programmes/' + this.config.key + '/' +this.config.name,
		function(res) {
			function cmp(a, b) {
				return (a.startTime < b.startTime? -1 : 1);
			}
			me.content = JSON.parse(res);
			me.content.sort(cmp);
		});
	request.send();
};

ConBoard.Cat.prototype.update = function(time) {
	this.body.innerHTML = '';
	// Remove the one which floated out
	if (this.progs.length > 0 && this.progs[0].endTime > time) {
		this.progs[0].destroy();
		this.progs.splice(0, 1);
	}

	for (var i in this.content) {
		if (time < this.content[i].startTime && this.content[i]) {

			if (this.content[i].startTime > time + 7200000) {
				console.log('Some programme is out of timeline');
				break;
			}
		}
	}
},

ConBoard.Cat.prototype.getEl = function() {
	return this.el;
};

ConBoard.Cat.prototype.createEl = function() {
	var catEl = document.createElement('div');
	catEl.setAttribute('class', 'con-board-cat');
	catEl.setAttribute('id', 'con-board-cat-'+this.config.id);
	catEl.style.height = this.config.height;
	catEl.style.width = this.config.width;
	this.el = catEl;

	var catHead = document.createElement('div');
	catHead.setAttribute('class', 'con-board-cat-head');
	catHead.innerHTML = this.config.name;
	this.head = catHead;

	var catBody = document.createElement('div');
	catBody.setAttribute('class', 'con-board-cat-body');
	this.body = catBody;

	this.el.appendChild(catHead);
	this.el.appendChild(catBody);

	return catEl;
};