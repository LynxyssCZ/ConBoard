window.ConBoard = window.ConBoard || {};
ConBoard.Cat = function(data) {
	this.name = data.name;
	this.id = data.id;
	this.resolution = data.resolution;
	this.interval = data.interval;

	this.loading = false;
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
	this.dirty = true;
};

ConBoard.Cat.prototype.update = function(time) {
	// move pogIndex if there are some 'top' programmes out of the window
	for (var i = this.progIndex; i < this.content.length; i++) {
		if (this.content[i].endTime < time.startTick) {
			this.progIndex = i+1;
		}
	}

	if (!this.dirty && time.startTick === this.startTick) {
		return;
	}
	this.dirty = false;
	this.startTick = time.startTick;

	// Check if we are no on the end of the programme already
	if (this.progIndex >= this.content.length) {
		return;
	}

	// Check if 'top' programme is not too far away
	if (this.progs.length === 0 && this.content.length && this.content[this.progIndex].startTime > time.endTick) {
		this.tillStart = ConBoard.TickDiff(time.tick, this.content[this.progIndex].startTime);
	}

	this.updateBody(time);
},

ConBoard.Cat.prototype.updateBody = function(time) {
	// Delete old programmes
	for (var i = 0; i < this.progs.length; i++) {
		if (this.progs[i].endTime <= time.startTick) {
			this.progs[i].destroy();
			this.progs.splice(i, 1);
			i--;
		}
		else {

		}
	};
	// Render new programmes that fit
	for (var i = this.progIndex; i < this.content.length; i++) {
		if (this.content[i].endTime > time.startTick
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

	for (var i = 0; i < this.progs.length; i++) {
		var prog = this.progs[i];
		var length = ((prog.endTime - prog.startTime)/this.interval)*(100/this.resolution);
		var position = (prog.startTime-time.startTick)/(this.interval)*(100/this.resolution);
		if (position <= 0 && (position+length) >= 100) {
			// Full board events
			position = 0;
			length = 100;
		}
		else if (position <= 0) {
			length = length + position;
			position = 0;
		}
		else if ((position + length) > 100) {
			length = 100 - position;
		}
		prog.updatePosition(position);
		prog.setWidth(length);
	};
};

ConBoard.Cat.prototype.createProgramme = function(data, time) {
	var prog = new ConBoard.Programme(data);

	ConBoard.Api.GetProgramme(
		data.pid,
		function(err, res) {
			if (!err && !!res) {
				prog.setDetails(res);
			}
		},
		this
	);

	this.progs.push(prog);
	this.body.appendChild(prog.getEl());
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
		marker.setAttribute('class', marker.getAttribute('class') + ' marker-'+i);
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