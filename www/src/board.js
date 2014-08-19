window.ConBoard = window.ConBoard || {};
ConBoard.DayEnum = ['Neděle', 'Pondělí', 'Uterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota'];

ConBoard.Board = function(boardDiv, config) {
	this.resolution = config.resolution;

	this.cats = [];
	this.container = boardDiv;
	this.container.style.width = document.body.clientWidth;

	this.createHead();
	this.createBody();
	this.getCats();
	this.startTimer();
};

ConBoard.Board.prototype.createHead = function() {
	this.head = new ConBoard.Head({

	});
	this.container.appendChild(this.head.getEl());
};

ConBoard.Board.prototype.createBody = function() {
	this.body = new ConBoard.Body({
		catKey: this.catKey
	});

	this.container.appendChild(this.body.getEl());
};

ConBoard.Board.prototype.updateHead = function(time) {
	if (time.minutes < 10) {
		time.minutes = '0' + time.minutes.toString();
	}
	this.head.update(time);
	console.log('Starting interval is', time.hours, time.startMinutes);

}

ConBoard.Board.prototype.tick = function(event) {
	var startMinutes = (event.minutes > 30) ? 30 : 00;
	event.startMinutes = startMinutes;
	this.updateHead(event);

	for (var i in this.cats) {
		this.cats[i].update(event.tick);
	}
};

ConBoard.Board.prototype.startTimer = function() {
	this.timer = new ConBoard.Timer();
	this.timer.Start();
	this.timer.on(
		this.tick,
		this
	);
};

ConBoard.Board.prototype.getCats = function() {
	var me = this;
	var request = ConBoard.Api.GetCats(function(error, response) {
		me.loadCats(response);
	});
};

ConBoard.Board.prototype.loadCats = function(cats) {
	for (var cat in cats) {
		this.body.createCat({
			name: cats[cat],
			id: cat,
			resolution: this.resolution,
			key: 'location'
		});
	};
};
