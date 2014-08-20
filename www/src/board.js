window.ConBoard = window.ConBoard || {};
ConBoard.DayEnum = ['Neděle', 'Pondělí', 'Uterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota'];
ConBoard.DeltaToString = function(delta) {
	var ms = delta % 1000;
	delta = (delta - ms) / 1000;
	var sec = delta % 60;
	delta = (delta - sec) / 60;
	var min = delta % 60;
	var hrs = (delta - min) /60;
	return hrs + ':' + min + ':' + ((sec < 10)? ('0'+sec) : sec);
};

ConBoard.TickDiff = function(ts1, ts2) {
	return (ts1 > ts2)? ts1 - ts2 : ts2 - ts1;
};

ConBoard.Board = function(boardDiv, config) {
	this.resolution = config.resolution;
	this.interval = config.interval;

	this.minutes;

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
		resolution: this.resolution
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
	this.head.update(time);
}

ConBoard.Board.prototype.tick = function(event) {
	console.log('tick');
	if (this.minutes === event.minutes) {
		console.log('nop');
		//return;
	}
	this.minutes = event.minutes;
	var startMinutes = (event.minutes > 30) ? 30 : 00;
	event.startMinutes = startMinutes;

	event.endTick = event.tick + (this.resolution * this.interval);
	this.head.update(event);
	this.body.update(event);
};

ConBoard.Board.prototype.startTimer = function() {
	this.timer = new ConBoard.Timer(15000);
	this.timer.on(
		this.tick,
		this
	);
	this.timer.Start();
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
			interval: this.interval,
			key: 'location'
		});
	};
};
