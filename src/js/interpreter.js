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


var Interpreter = {

  codes : [],

  i : 0,

  hand : null,

  labels : {},

  dictionary : ['INBOX', 'OUTBOX', 'COPYTO', 'COPYFROM', 'LABEL', 'ADD', 'JUMP', 'JUMPN'],

  parser : function(code) {
    return code.trim().split(/\s+/);
  },

  run : function() {
    while(Interpreter.i < Interpreter.codes.length) {
      Interpreter.next();
    }
  },

  next : function() {
    if(Interpreter.i >= Interpreter.codes.length) return;
    if(Interpreter.dictionary.indexOf(Interpreter.codes[Interpreter.i]) != -1) {
      Interpreter.call(Interpreter.codes[Interpreter.i]);
    } else {
      error('Commande ' + Interpreter.codes[Interpreter.i] + ' inconnue.');
    }
    Interpreter.i++;
  },

  prev : function() {

  },

  call : function(word) {
    switch (word) {
      case 'INBOX':
        Interpreter.inbox();
        break;
      case 'OUTBOX':
        Interpreter.outbox();
        break;
      case 'COPYTO':
        Interpreter.copyto();
        break;
      case 'COPYFROM':
        Interpreter.hand = Interpreter.copyfrom();
        break;
      case 'LABEL':
        Interpreter.label();
        break;
      case 'JUMP':
        Interpreter.jump();
        break;
      case 'ADD':
        Interpreter.add();
        break;
      default:
        error('Erreur du code: Fonction ' + word + ' non implémenté.');
    }
  },

  /**
   * INBOX
   */
  inbox : function() {
    var input = Inputs.inputs.shift();
    if(!input) {
      error("Inputs vide.");
    }
    Interpreter.hand = parseInt(input) || input;
  },

  /**
   * OUTBOX
   */
  outbox : function() {
    if(!Interpreter.hand) {
      error("Outbox avec main vide.");
      return;
    }
    Outputs.outputs.push(Interpreter.hand);
    document.querySelector('#outputs').innerHTML += Interpreter.hand + '<br>';
    Interpreter.hand = null;
  },

  /**
   * COPYTO
   */
  copyto : function() {
    Interpreter.i++;
    var add = Interpreter.codes[Interpreter.i];
    var regCheck = /^\[([0-9]+)\]$/.exec(add);
    if(regCheck !== null) {
      add = Memory.get(regCheck[1]);
    } else {
      add = parseInt(add);
      if(!(Number.isInteger(add) && add >= 0)) {
        error("Addresse " + add + " non valide.");
        return;
      }
    }
    Memory.set(add, Interpreter.hand);
    document.querySelector('#memoryElt' + add).innerHTML = Interpreter.hand;
  },

  /**
   * COPYFROM
   */
  copyfrom : function() {
    Interpreter.i++;
    var add = parseInt(Interpreter.codes[Interpreter.i]);
    var regCheck = /^\[([0-9]+)\]$/.exec(add);
    if(regCheck !== null) {
      add = Memory.get(regCheck[1]);
    } else {
      add = parseInt(add);
      if(!(Number.isInteger(add) && add >= 0)) {
        error("Addresse " + add + " non valide.");
        return;
      }
    }
    return parseInt(Memory.get(add)) || Memory.get(add);
  },

  /**
   * LABEL
   */
  label : function() {
    Interpreter.i++;
    Interpreter.labels[Interpreter.codes[Interpreter.i]] = Interpreter.i;
  },

  /**
   * JUMP
   */
  jump : function() {
    Interpreter.i++;
    var label = Interpreter.codes[Interpreter.i];
    if(Interpreter.labels.hasOwnProperty(label)) {
      Interpreter.i = Interpreter.labels[label];
    } else {
      for (var i = Interpreter.i ; i < Interpreter.codes.length ; i++) {
        if (Interpreter.codes[i] == 'LABEL') {
          i ++;
          Interpreter.labels[Interpreter.codes[i]] = i;
          if(Interpreter.codes[i] == label) {
            Interpreter.i = i;
            break;
          }
        }
      }
    }
  },

  /**
   * ADD
   */
  add : function() {
    var addValue = parseInt(Interpreter.copyfrom());
    if(!addValue) {
      error('La valeur ' + addValue + ' ne peut pas être additionné avec la main');
    }
    var hand = parseInt(Interpreter.hand);
    if(!hand) {
      error('Impossible de faire une addition avec ' + hand);
    }
    Interpreter.hand +=  addValue;
  },

  reset : function() {
    Interpreter.hand = null;
    Interpreter.codes = [];
  }

};

function error(string) {
  document.querySelector('.errors').textContent = string;
  var commands = document.querySelectorAll('.command--btn');
  for (var i = 0; i < commands.length; i++) {
    commands[i].className = "btn command--btn btn__disabled";
    commands[i].disabled = true;
  }
  Interpreter.i = Interpreter.codes.length;
}

function debug(string) {
  if(DEBUG){
    console.log(string);
  }
}
