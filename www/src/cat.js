window.ConBoard = window.ConBoard || {};
ConBoard.Cat = function(data) {
	this.name = data.name;
	this.id = data.id;
	this.resolution = data.resolution;
	this.interval = data.interval;

	this.progIndex = 0;
	this.tillStart;
	this.content = [];
	this.progs = [];
	this.markers = [];
	this.createEl();
};

ConBoard.Cat.prototype.getProgCount = function() {
	return this.progs.length;
};

ConBoard.Cat.prototype.fillCat = function(data) {
	this.content = data;
	this.content.sort(function(a, b) {
		return (a.startTime < b.startTime? -1 : 1);
	});
};

ConBoard.Cat.prototype.update = function(time) {
	// move pogIndex if there are some 'top' programmes out of the window
	for (var i = this.progIndex; i < this.content.length; i++) {
		if (this.content[i].endTime < time.tick) {
			this.progIndex = i+1;
		}
	}
	// Check if we are no on the end of the programme already
	if (this.progIndex >= this.content.length) {
		return;
	}

	this.updateBody(time);
	// Check if 'top' programme is not too far away
	if (this.progs.length === 0 && this.content.length && this.content[this.progIndex].startTime > time.endTick) {
		this.tillStart = ConBoard.TickDiff(time.tick, this.content[this.progIndex].startTime);
	}
},

ConBoard.Cat.prototype.updateBody = function(time) {
	// Delete old programmes
	for (var i = 0; i < this.progs.length; i++) {
		if (this.progs[i].endTime < time.tick) {
			console.log('Deleting', this.progs[i]);
			this.progs[i].destroy();
			this.progs.splice(i, 1);
			i--;
		}
		else {

		}
	};
	// Render new programmes that fit
	for (var i = this.progIndex; i < this.content.length; i++) {
		if (this.content[i].endTime > time.tick
			&& this.content[i].startTime < time.endTick
			&& !this.content[i].rendered
		) {
			this.createProgramme(this.content[i], time);
			this.content[i].rendered = true;
		}
		// If I reach programme totally out of the window, break
		if (time.endTick < this.content[i].startTime) {
			break;
		}
	}
};

ConBoard.Cat.prototype.createProgramme = function(data, time) {
	console.log('Rendering');
	console.log(data);
	var prog = new ConBoard.Programme(data);
	this.progs.push(prog);
	this.body.appendChild(prog.getEl());
	var length = ((data.endTime - data.startTime)/this.interval)*(100/this.resolution);
	var position = (time.tick-data.startTime)/(this.interval);
	if (data.startTime > time.tick && data.endTime > data.endTick) {
		// Full board events
		position = 0;
		length = 100;
	}
	else if (data.startTime > time.tick) {
		position = 0;
	}
	else if (data.endTime > time.endTick) {
		// Handle right side overwflow
	}

};

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