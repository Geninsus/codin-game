
function next() {
	if(line<commands.length-1 && commands.length > 1) {
		line++;
		executeCommand();
		displayCommands();
		displayInNumbers();
		displayVarsNumbers();
		displayOutNumbers();
	}
}

function previous() {
	if(line>0) {
		line--;
	}
}

function executeCommand() {
	var command = commands[line];
	if (command == "INBOX") { inbox(); }
	if (command == "OUTBOX") { outbox(); }
	if (command.substring(0, 6) == "COPYTO") {copyto(command[7,7]);}
	if (command.substring(0, 8) == "COPYFROM") {copyfrom(command[9,9]);}
	if (command.substring(0, 4) == "GOTO") {goTo(command[5,5]);}
}

function goTo(index) {
	var str = "LABEL "+index, i = 0;

	while (str != commands[i]) {
		i++
	}
	line = i;
}

function inbox() {
	vars[0] = inNumbers[0];
	inNumbers.shift();
}

function outbox() {
	if (vars[0] == undefined) {
		alert("Error outbox");
		throw new Error('This is not an error. This is just to abort javascript');
	}
	outNumbers.unshift(vars[0]);
	vars[0] = undefined;
}

function copyto(index) {
	if (vars[0] == undefined) {
		alert("Error Copyto");
		throw new Error('This is not an error. This is just to abort javascript');
	}
	vars[index] = vars[0];

}

function copyfrom(index) {
	if (vars[index] == undefined) {
		alert("Error copyfrom");
		throw new Error('This is not an error. This is just to abort javascript');
	}
	vars[0] = vars[index];
}

function parser(str) {
    var res = str.split("\n");
    return res;
}

function displayCommands() {
	window.document.getElementById("commands").innerHTML = "";
	for (i = 0 ; i < commands.length ; i++) {
		window.document.getElementById("commands").innerHTML += ((i==line ? ">" : "")+commands[i]+"<br>");
	}
}

function displayInNumbers() {
	window.document.getElementById("inNumbers").innerHTML = "<h1>IN</h1><br>";
	for (i=0 ; i < inNumbers.length ; i++) {
		window.document.getElementById("inNumbers").innerHTML += inNumbers[i] + "<br>";
	}
}

function displayVarsNumbers() {
	window.document.getElementById("onHand").rows[0].cells[0].innerHTML = vars[0];
	for(i = 1 ; i < vars.length ; i++) {
		window.document.getElementById("onFloor").rows[0].cells[i-1].innerHTML = vars[i];
	}
}

function displayOutNumbers() {
	window.document.getElementById("outNumbers").innerHTML = "<h1>OUT</h1><br>";
	for (i=0 ; i < outNumbers.length ; i++) {
		window.document.getElementById("outNumbers").innerHTML += outNumbers[i] + "<br>";
	}
}


var line = -1 , commands = parser("LABEL 1\nINBOX\nOUTBOX\nGOTO 1"), vars = [undefined,undefined,undefined,undefined], inNumbers = [5,6,9], outNumbers = [];

 window.onload = function(){
 	displayCommands();
 	displayInNumbers();
 	displayVarsNumbers();
	displayOutNumbers();
}