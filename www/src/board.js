window.ConBoard = window.ConBoard || {};
ConBoard.Board = function(boardDiv) {
	this.cats = [];
	this.container = boardDiv;
	this.container.style.width = document.body.clientWidth;

	this.createHead();
	this.createBody();
	this.getCats();
	this.startTimer();
};

ConBoard.Board.prototype.DayEnum = ['Nedele', 'Pondeli', 'Utery', 'Streda', 'Ctvrtek', 'Patek', 'Sobota'];

ConBoard.Board.prototype.createHead = function() {
	this.head = new ConBoard.Head({

	});
	this.container.appendChild(this.head.getEl());
};

ConBoard.Board.prototype.createBody = function() {
	this.body = document.createElement('div');
	this.body.setAttribute('class', 'con-board-body');
	this.container.appendChild(this.body);
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
	var request = new ConBoard.Request('GET', '/categories', function(response) {
		var res = JSON.parse(response);
		me.loadCats(res);
	});
	request.send();
};

ConBoard.Board.prototype.loadCats = function(cats) {
	var catSize = Math.floor(100 / cats.length);
	for (var cat in cats) {
		var cmp = new ConBoard.Cat({
			name: cats[cat],
			id: cat,
			key: 'location'
		});
		this.cats.push(cmp);
		this.body.appendChild(cmp.getEl());
	};
};
