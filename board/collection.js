var store = [];
var catMap;
var itemIndex;
var itemCategory;

function Init(settings, data) {
	itemIndex = settings.index;
	itemCategory = settings.segmentation;
	for (var i = data.length - 1; i >= 0; i--) {
		Push(data[i]);
	};
}

function Push(record) {
	store.push(record);
}

function getAtKey(key) {

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
	GetAll: getAll,
	getAtKey: getAtKey,
	getList: getCategoryList
};