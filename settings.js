exports.port = 8085;
exports.wwwPath = './www';
// Data path settings
exports.dataPath = './data';
exports.sourceName = 'source.xml';
// Fields that make up short records
exports.recordFields = ['pid', 'startTime', 'endTime'];
// Main record index
exports.recordIndex = 'pid';
// Record categorisator
exports.recordCatField = 'location';
// Minimal local time. If local time is lower, the application wont launch server and print an error in the console
exports.minTime = 1262304000000;
// Ignored cats not returned by /categories api request
exports.ignoredCats = ["DDR místnost", "Konzolová místnost", "Deskovkárna"];