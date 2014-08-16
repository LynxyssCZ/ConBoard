exports.port= 8085;
exports.wwwPath= './www';
// Data path settings
exports.sourcePath= './data/source.xml';
exports.dataPath= './data/data.json';
// Fields by which records get categorised
exports.recordCategories = ['location'];
// Fields that make up short records
exports.recordFields= ['pid', 'startTime', 'endTime'];
// Main record index
exports.recordIndex= 'pid';
// Minimal local time. If local time is lower, the application wont launch server and print an error in the console
exports.minTime= 1262304000000;