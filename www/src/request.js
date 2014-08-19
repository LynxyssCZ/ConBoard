window.ConBoard = window.ConBoard || {};
ConBoard.Request = function(method, url, callback) {
	var me = this;
	this.xhr = new XMLHttpRequest();
	this.method = method;
	this.url = url;
	this.callback = callback;

	this.xhr.onreadystatechange = function() {
		me.onStateChange(me.xhr, me.callback);
	};
	this.xhr.open(this.method, this.url);
};

ConBoard.Request.prototype.send = function() {
	this.xhr.send();
};

ConBoard.Request.prototype.onStateChange = function(xhr, callback) {
	var error;
	if (xhr.readyState === 4) {
		callback(error, xhr.response);
	}
};