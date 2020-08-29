var nodepccc = require('nodepccc');
var conn = new nodepccc;
var doneReading = false;
var doneWriting = false;

conn.initiateConnection({port: 44818, host: '192.168.1.233'  , /* routing: [0x01,0x00,0x01,0x00]*/ }, connected);

function connected(err) {
	if (typeof(err) !== "undefined") {
		// We have an error.  Maybe the PLC is not reachable.  
		console.log(err);
		process.exit();
	}
	//console.log(conn.setTranslationCB(tagLookup('TEST1')));
	//console.log(conn.findItem('B3:0/0'));
	//conn.readAllItems(valuesReady());	
	//console.log(conn.setTranslationCB('B3:0/1'));
	//conn.writeItems('N7:0', 333 , valuesWritten);
	//console.log(conn.findItem('N7:0').value
	conn.setTranslationCB(tagLookup);
	conn.addItems(['TEST1','TEST10']);
	conn.readAllItems(valuesReady);
}

function valuesReady(anythingBad, values) {
	if (anythingBad) { console.log("SOMETHING WENT WRONG READING VALUES!!!!"); }
	console.log(values);
// alternative syntax		console.log("Value is " + conn.findItem('TEST1').value + " quality is " + conn.findItem('TEST1').quality);
	doneReading = true;
	if (doneWriting) { process.exit(); }
}

function valuesWritten(anythingBad) {
	if (anythingBad) { console.log("SOMETHING WENT WRONG WRITING VALUES!!!!"); }
	console.log("Done writing.");
	doneWriting = true;
	if (doneReading) { process.exit(); }
}


function tagLookup(tag) {
	switch (tag) {
	case 'TEST1':
		return 'N7:0';				// Integer
	case 'TEST2':
		return 'B3:0/0';			// Bit
	case 'TEST3':
		return 'B3/17';				// Same as B3:1/1
	case 'TEST4':
		return 'F8:0,20';  			// Yes this is an array...  20 real numbers.  
	case 'TEST5':
		return 'F8:1';				// Single real.  
	case 'TEST6':
		return 'F8:2';				// Another single real.  
	case 'TEST7':
		return 'N7:1,2';			// A couple of integers in an array  	
	case 'TEST8':
		return 'O:5/1';				// Direct output  	
	case 'TEST9':
		return 'ST18:0';
	case 'TEST10':
		return 'I:0/0';
	default:
		return undefined;
	}
}