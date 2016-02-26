var Memory = {
  init : function(values) {
    Memory.memory = values;
    Memory.display();
  },

  get : function(indice) {
    if(Memory.memory[indice] === undefined) {
      error("L'indice " + indice + " n'existe pas en mémoire.");
    }
    return Memory.memory[indice];
  },

  set : function(indice, value) {
    if(Memory.memory[indice] === undefined) {
      error("L'indice " + indice + " n'existe pas en mémoire.");
    }
    Memory.memory[indice] = value;
  },

  display: function() {
    document.querySelector('#memory').innerHTML = "";
    for(var el in Memory.memory) {
      document.querySelector('#memory').innerHTML += el + " ";
    }
  }
};

var Inputs = {
  inputs : [],

  init : function(inputs) {
    Inputs.inputs = inputs;
  },

  reset : function() {
    Inputs.inputs = [];
  }
};

var Outputs = {
  outputs : [],

  init : function(outputs) {
    Outputs.outputs = outputs;
  },

  reset : function() {
    Outputs.outputs = [];
  }
};


var interpreter = {

  codes : [],

  i : 0,

  hand : null,

  labels : [],

  dictionary : ['INBOX', 'OUTBOX', 'COPYTO', 'COPYFROM', 'LABEL'],

   parser : function(code) {
    return code.split(/\s+/);
  },

  run : function() {
    while(interpreter.i < interpreter.codes.length) {
      interpreter.next();
    }
  },

  next : function() {
    if(interpreter.i >= interpreter.codes.length) return;
    if(interpreter.dictionary.indexOf(interpreter.codes[interpreter.i]) != -1) {
      interpreter.call(interpreter.codes[interpreter.i]);
    } else {
      error('Commande ' + interpreter.codes[interpreter.i] + ' inconnue.');
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
        error('Fonction non implémenté.');
    }
  },

  /**
   * INBOX
   */
  inbox : function() {
    interpreter.hand = Inputs.inputs.shift();
    if(!interpreter.hand) {
      error("Inputs vide.");
    }
  },

  /**
   * OUTBOX
   */
  outbox : function() {
    if(!interpreter.hand) {
      error("Outbox avec main vide.");
      return;
    }
    console.log(interpreter.hand);
    Outputs.outputs.push(interpreter.hand);
    document.querySelector('#outputs').innerHTML += interpreter.hand + '<br>';
    interpreter.hand = null;
  },

  /**
   * COPYTO
   */
  copyto : function() {
    interpreter.i++;
    var add = interpreter.codes[interpreter.i];
    var regCheck = /^\[([0-9]+)\]$/.exec(add);
    if(regCheck !== null) {
      add = Memory.get(regCheck[1]);
    } else {
      if(!(Number.isInteger(add) && add >= 0)) {
        error("Addresse " + add + " non valide.");
        return;
      }
    }
    Memory.set(add, interpreter.hand);
  },

  /**
   * COPYFROM
   */
  copyfrom : function() {
    interpreter.i++;
    var add = parseInt(interpreter.codes[interpreter.i]);
    var regCheck = /^\[([0-9]+)\]$/.exec(add);
    if(regCheck !== null) {
      add = Memory.get(regCheck[1]);
    } else {
      if(!(Number.isInteger(add) && add >= 0)) {
        error("Addresse " + add + " non valide.");
        return;
      }
    }
    interpreter.hand = Memory.get(add, interpreter.hand);
  },

  /**
   * LABEL
   */
  label : function() {
    interpreter.i++;
    interpreter.labels.push(interpreter.codes[interpreter.i]);
  },

  reset : function() {
    interpreter.hand = null;
    interpreter.codes = [];
  }

};

function error(string) {
  document.querySelector('.errors').textContent = string;
  var commands = document.querySelectorAll('.command--btn');
  for (var i = 0; i < commands.length; i++) {
    commands[i].className = "btn command--btn btn__disabled";
    commands[i].disabled = true;
  }
  interpreter.i = interpreter.codes.length;
}

function debug(string) {
  if(DEBUG){
    console.log(string);
  }
}
