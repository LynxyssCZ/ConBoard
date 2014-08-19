window.ConBoard = window.ConBoard || {};
window.ConBoard.Api = {};
ConBoard.Api.GetCats = function(callback, scope) {
	var request = new ConBoard.Request(
		'GET',
		'/categories/',
		function(err, res) {
			ConBoard.Api._return(err, res, callback, scope)
	});
	request.send();
	return request;
};

ConBoard.Api.GetList = function(catName, callback, scope) {
	var request = new ConBoard.Request(
		'GET',
		'/programmes/location/' + catName + '/',
		function(err, res) {
			ConBoard.Api._return(err, res, callback, scope)
	});
	request.send();
	return request;
};

ConBoard.Api.GetProgramme = function(id, callback, scope) {
	var request = new ConBoard.Request(
		'GET',
		'/programmes/' + id + '/',
		function(err, res) {
			ConBoard.Api._return(err, res, callback, scope)
	});
	request.send();
	return request;
};

ConBoard.Api.GetAllProgrammes = function(callback, scope) {
	var request = new ConBoard.Request(
		'GET',
		'/programmes/',
		function(err, res) {
			ConBoard.Api._return(err, res, callback, scope)
	});
	request.send();
	return request;
};

ConBoard.Api._return = function(error, response, callback, scope) {
	var res, err;
	scope = scope || window;
	if (!error && !!response) {
		try {
			res = JSON.parse(response);
		}
		catch (e) {
			err = e;
		}
		callback.call(scope, err, res);
	}
	else {
		callback.call(scope ,error, undefined);
	}
};