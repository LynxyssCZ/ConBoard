var store = [];
var catMap = {};
var itemIndex;
var itemCategory;

function Init(settings, data) {
	itemIndex = settings.index;
	itemCategory = settings.segmentation;
	for (var i = data.length - 1; i >= 0; i--) {
		Push(data[i]);
	};
	store.sort(cmp);
}

function cmp(a, b) {
	return (a[itemIndex] < b[itemIndex]? -1 : 1);
}

function Push(record) {
	store.push(record);

}

function getBy(key, value) {
	var itemSet = [];
	for (var i = 0; i < store.length; i++) {
		if (store[i][key] === value) {
			itemSet.push(store[i]);
		}
	};
	return itemSet;
}

function getAtKey(key) {
	for (var i = store.length - 1; i >= 0; i--) {
		if (store[i].pid === key) {
			return store[i];
		}
		if (store[i].pid < key) {
			return {};
		}
	};
}

function getAll() {
	return store;
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