var store = [];
var indexStore = {};
var itemIndex;

var catMap = {};
var keyMap = {};
var mapFields;

function Init(settings, data) {
	itemIndex = settings.recordIndex;

	if (data.length > 0) {
		for(key in data[0]) {
			keyMap[key] = {};
		}
	}

	for (var i = data.length - 1; i >= 0; i--) {
		Push(data[i]);
	}
}

function cmp(a, b) {
	return (a[itemIndex] < b[itemIndex]? -1 : 1);
}

function Push(record) {
	indexStore[record[itemIndex]] = record;
	for(key in record) {

//		keyMap[key][record[itemIndex]] = ;
	}
}

function getBy(key, value) {
	var itemSet = {};
	for (index in indexStore) {
		if (indexStore[index][key] === value) {
			itemSet[index] = indexStore[index];
		}
	}
	return itemSet;
}

function getAtKey(key) {
	if (indexStore[key]) {
		return indexStore[key];
	}
	else {
		return {};
	}
}

function getAll() {
	return indexStore;
}

function getCategoryList() {

}

function findIndex(record, array) {

}

module.exports = {
	Init: Init,
	Push: Push,
	getAll: getAll,
	getAtKey: getAtKey,
	getBy: getBy,
	getList: getCategoryList
};