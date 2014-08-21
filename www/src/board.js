window.ConBoard = window.ConBoard || {};
ConBoard.DayEnum = ['Neděle', 'Pondělí', 'Uterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota'];
ConBoard.DeltaToString = function(delta) {
	var ms = delta % 1000;
	delta = (delta - ms) / 1000;
	var sec = delta % 60;
	delta = (delta - sec) / 60;
	var min = delta % 60;
	var hrs = (delta - min) /60;
	return ((hrs > 0)? (hrs + ':'): '' ) + ((min > 0)? (((min < 10)? ('0'+min) : min) + ':') : '') + ((sec < 10)? ('0'+sec) : sec);
};

ConBoard.TickDiff = function(ts1, ts2) {
	return (ts1 > ts2)? ts1 - ts2 : ts2 - ts1;
};

ConBoard.Board = function(boardDiv, config) {
	this.resolution = config.resolution;
	this.interval = config.interval;
	this.timeDelay = config.timeDelay;
	this.notices = config.notices;

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
		resolution: this.resolution,
		interval: this.interval
	});
	this.container.appendChild(this.head.getEl());
};

ConBoard.Board.prototype.createBody = function() {
	this.body = new ConBoard.Body({
		catKey: this.catKey,
		timeDelay: this.timeDelay,
		},
		this.notices
	);

	this.container.appendChild(this.body.getEl());
};

ConBoard.Board.prototype.tick = function(event) {
	event.startTick = event.tick - (event.tick % this.interval);
	event.endTick = event.startTick + (this.resolution * this.interval);

	var startMinutes = (event.minutes > 30) ? 30 : 00;
	event.startMinutes = startMinutes;

	this.head.update(event);

	this.body.update(event);

	if(this.body.masked > 0) {
		this.head.hideLine();
	}
	else if (this.head.hidenLine && this.body.masked === 0) {
		this.head.showLine();
	}
};

ConBoard.Board.prototype.startTimer = function() {
	this.timer = new ConBoard.Timer(500);
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
