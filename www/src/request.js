window.ConBoard = window.ConBoard || {};

ConBoard.Request = function(method, url, callback) {
	this.xhr = new XMLHttpRequest();
	this.method = method;
	this.url = url;
	this.callback = callback;

	var me = this;
	this.xhr.onreadystatechange = function() {
		me.onStateChange(me.xhr, me.callback);
	};
	this.xhr.open(this.method, this.url);
};

ConBoard.Request.prototype.send = function() {
	this.xhr.send();
};

ConBoard.Request.prototype.onStateChange = function(xhr, callback) {
	if (xhr.readyState === 4) {
		callback(xhr.response);
	}
};
