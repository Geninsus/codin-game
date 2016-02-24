var Memory = {
  init : function(values) {
    Memory.memory = values;
    Memory.display();
  },

  get : function(indice) {
    return Memory.memory[indice];
  },

  set : function(indice, value) {
    Memory.memory[indice] = value;
  },

  display: function() {
    document.querySelector('#memory').innerHTML = "";
    for(var el of Memory.memory) {
      document.querySelector('#memory').innerHTML += el + " ";
    }
  }
}

var Inputs = {
  inputs : [],

  init : function(inputs) {
    Inputs.inputs = inputs;
  },

  reset : function() {
    Inputs.inputs = []
  }
}

var Outputs = {
  outputs : [],

  init : function(inputs) {
    Outputs.outputs = outputs;
  },

  reset : function() {
    Outputs.outputs = []
  }
}


var interpreter = {

  codes : [],

  i : 0,

  hand : null,

  dictionary : ['INBOX', 'OUTBOX', 'COPYTO', 'COPYFROM'],

   parser : function(code) {
    return code.split(/\s+/);
  },

  run : function() {

  },

  next : function() {
    if(interpreter.dictionary.indexOf(interpreter.codes[interpreter.i]) != -1) {
      interpreter.call(interpreter.codes[interpreter.i]);
    }
    interpreter.i++;
  },

  prev : function() {

  },

  call : function(word) {
    switch (word) {
      case 'INBOX':
        interpreter.inbox();
        break;
      case 'OUTBOX':
        interpreter.outbox();
        break;
      case 'COPYTO':
        interpreter.copyto();
        break;
      case 'COPYFROM':
        interpreter.copyfrom();
        break;
      default:
        alert('Fonction non implémenté.')
    }
  },

  inbox : function() {
    interpreter.hand = Inputs.inputs.shift();
    if(!interpreter.hand) {
      alert("Inputs vide.");
    }
  },

  outbox : function() {
    if(!interpreter.hand) {
      alert("Outbox avec main vide.");
      return;
    }
    console.log(interpreter.hand);
    Outputs.outputs.push(interpreter.hand);
    document.querySelector('#outputs').innerHTML += interpreter.hand;
    interpreter.hand = null;
  },

  copyto : function() {
    interpreter.i++;
    var add = interpreter.codes[interpreter.i];
    var regCheck = /^\[([0-9]+)\]$/.exec(add);
    if(regCheck != null) {
      add = Memory.get(regCheck[1]);
    } else {
      if(!(Number.isInteger(add) && add >= 0)) {
        alert("Addresse " + add + " non valide.");
        return;
      }
    }
    Memory.set(add, interpreter.hand);
  },

  copyfrom : function() {
    interpreter.i++;
    var add = parseInt(interpreter.codes[interpreter.i]);
    var regCheck = /^\[([0-9]+)\]$/.exec(add);
    if(regCheck != null) {
      add = Memory.get(regCheck[1]);
    } else {
      if(!(Number.isInteger(add) && add >= 0)) {
        alert("Addresse " + add + " non valide.");
        return;
      }
    }
    interpreter.hand = Memory.get(add, interpreter.hand);
  },

  reset : function() {
    interpreter.hand = null;
    interpreter.codes = [];
  }

};
