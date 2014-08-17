var indexStore = {};
var itemIndex;

var cats = [];
var catField;

var recordFields;

function Init(settings, data) {
	itemIndex = settings.recordIndex;
	recordFields = settings.recordFields;
	catField = settings.recordCatField;

	for (var i = data.length - 1; i >= 0; i--) {
		Push(data[i]);
	}
}

function cmp(a, b) {
	return (a[itemIndex] < b[itemIndex]? -1 : 1);
}

function Push(record) {
	indexStore[record[itemIndex]] = record;

	if (cats.indexOf(record[catField]) === -1) {
		cats.push(record[catField]);
	}
}

function getBy(key, value) {
	var itemSet = [];
	for (var index in indexStore) {
		if (indexStore[index][key] === value) {
			var item = {};
			for (var field in recordFields) {
				item[recordFields[field]] = indexStore[index][recordFields[field]];
			}
			itemSet.push(item);
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
	return cats;
}

function findIndex(record, array) {

}

module.exports = {
	Init: Init,
	Push: Push,
	getAll: getAll,
	getAtKey: getAtKey,
	getBy: getBy,
	getCategoryList: getCategoryList
};