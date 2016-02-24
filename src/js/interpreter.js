function Memory() {
  var memory = [];
}

Memory.prototype.get = function(indice) {
  return this.memory[indice];
}

Memory.prototype.set = function(indice, value) {
  this.memory[indice] = value;
}


var Inputs = {
  inputs : [],

  init : function(inputs) {
    Inputs.inputs = inputs;
  }
}


var interpreter = {

  codes : [],

  i : 0,

  outputs : [],

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
    console.log("la " + word);
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
  },

  outbox : function() {
    if(interpreter.hand == null) {
      alert("Outbox avec main vide.");
      return;
    }
    console.log("Ici " + interpreter.hand);
    interpreter.outputs.push(interpreter.hand);
    document.querySelector('#outputs').innerHTML += interpreter.hand;
    interpreter.hand = null;
  },

  copyto : function() {
    interpreter.i++;
    var add = interpreter.codes[interpreter.i];
    var reg = /^\[([0-9]+)\]$/;
    //var test = reg.exec(add);
    alert(test[1]);

    //Memory.set(add, interpreter.hand);
  },

  copyfrom : function() {
  },

};
