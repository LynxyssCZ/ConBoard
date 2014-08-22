window.ConBoard = window.ConBoard || {};
ConBoard.Timer = function(interval) {
	this.interval = interval || 500;
	this.listeners = [];
};

ConBoard.Timer.prototype.Start = function() {
	this.interval = window.setInterval(this.Tick.bind(this), this.interval);
	this.Tick();
};

ConBoard.Timer.prototype.Tick = function() {
	//var tick = Date.now() + 257908000 + (3*30*60*1000);
	var tick = Date.now();
	var tock = new Date(tick);
	var stamp = {
		tick: tick,
		day: tock.getDay(),
		hours: tock.getHours(),
		minutes: tock.getMinutes()
	};

	for(var i in this.listeners) {
		var fn = this.listeners[i].fn,
			sc = this.listeners[i].scope || window;
		fn.call(sc, stamp);
	}
};

ConBoard.Timer.prototype.on = function(fn, scope) {
	this.listeners.push({fn: fn, scope: scope});
};

ConBoard.Timer.prototype.off = function(fn, scope) {
	for (var i in this.listeners) {
		var listener = listeners[i];
		if (listener.fn === fn && scope === listener.scope) {
			listeners.splice(i, 1);
			return;
		}
	}
};

ConBoard.Timer.prototype.Stop = function() {
	window.clearInterval(this.interval);
};
