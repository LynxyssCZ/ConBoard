var xml2js = require('xml2js');
var xmlParser = xml2js.Parser();

function Parse(xmlSource, callback) {
	xmlParser.parseString(xmlSource, function(err, res) {
		if (!err && !!res) {
			var cleanProgramme = cleanData(res);
			callback(undefined, cleanProgramme);
		}
		else {
			callback(true, undefined);
		}
	});
}

function cleanData(JsonSource) {
	var programmes = [];
	var annotations = JsonSource.annotations.programme;

	annotations.forEach(function(element, index, array){
		cleanRecord(element);
		programmes.push(element);
	});
	return programmes;
}

function cleanRecord(record) {
	var key;

	for(key in record) {
		record[key] = record[key][0].trim();
	}
	record.annotation = record.annotation.replace(/(\r\n)+\t/g, '</br>');
	record.programLine = record['program-line'];
	record.startTime = new Date(Date.parse(record['start-time'])).getTime();
	record.endTime = new Date(Date.parse(record['end-time'])).getTime();
	delete record['program-line'];
	delete record['start-time'];
	delete record['end-time'];
}

module.exports = {
	Parse: Parse
};