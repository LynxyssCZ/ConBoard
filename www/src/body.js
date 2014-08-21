window.ConBoard = window.ConBoard || {};
ConBoard.Body = function(config, notices) {
	this.config = config;
	this.notices = notices;

	this.masked = 0;

	this.cats = [];

	this.createEl();
};

ConBoard.Body.prototype.update = function(time) {
	for (var i = this.cats.length - 1; i >= 0; i--) {
		this.cats[i].update(time);
	}

	if (this.notices) {
		for (var i = 0; i < this.notices.length; i++) {
			var notice = this.notices[i];
			if(notice.start < time.tick && notice.end > time.tick) {
				if (notice.rendered) {
					notice.update();
				}
				else {
					notice.create();
					this.el.appendChild(notice.getEl());
				}
				this.masked++;
			}
			else if(notice.end < time.tick && notice.rendered) {
				notice.destroy();
				this.masked--;
			}
		}
	}

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
		resolution: data.resolution,
		interval: data.interval
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