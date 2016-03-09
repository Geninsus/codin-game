var Memory = {
  init : function(game,values) {
    Memory.memory = values[0] !== "" ? values : [];
    Memory.display();
    Memory.game=game;
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


  init : function(game,inputs) {
    Inputs.inputs = inputs[0] !== "" ? inputs : [];
    Inputs.game = game;
  },

  reset : function() {
    Inputs.inputs = [];
  },

  removeItem : function() {
    this.game.itemsHand = this.game.itemsInput.shift();
    this.game.add.tween(this.game.itemsHand).to( {x: '100' }, 100, Phaser.Easing.Linear.None, true);
    for (var i = 0 ; i < this.game.itemsInput.length ; i++) {
      this.game.add.tween(this.game.itemsInput[i]).to( {y:'-75'}, 100, Phaser.Easing.Linear.None, true);
    }
  }

};

var Outputs = {
  outputs : [],

  init : function(game,outputs) {
    Outputs.outputs = outputs;
    Outputs.game = game;
  },

  reset : function() {
    Outputs.outputs = [];
  },

  addItem : function() {
    for (var i = 0 ; i < this.game.itemsOutput.length ; i++) {
      this.game.add.tween(this.game.itemsOutput[i]).to( {y:'+75'}, 100, Phaser.Easing.Linear.None, true);
    }
    this.game.itemsOutput.push(this.game.itemsHand);
    this.game.add.tween(this.game.itemsHand).to( {y: 150, x: this.game.world.width-200 }, 100, Phaser.Easing.Linear.None, true);
    this.game.itemsHand = null;
  }
};


var Interpreter = {

  codes : [],

  i : 0,

  maxIteration : 1000,

  iteration : 0,

  hand : null,

  labels : {},

  dictionary : ['INBOX', 'OUTBOX', 'COPYTO', 'COPYFROM', 'LABEL', 'ADD', 'SUB', 'INC', 'DEC', 'JUMP', 'JUMPZ', 'JUMPN'],

  moveTo: function(x,y) {
    var tween = this.game.add.tween(this.game.player).to( {x : x }, 1000, Phaser.Easing.Linear.None, true);
    if (x > this.game.player) {
      this.game.player.play('left');
    }
    else {
      this.game.player.play('right');
    }
  },

  parser : function(code) {
    var codes = code.trim().split(/\s+/);
    if(codes[0] === "") codes = [];
    return codes;
  },

  init : function(game) {
    Interpreter.iteration = 0;
    Interpreter.labels = {};
    Interpreter.i = 0;
    Interpreter.game = game;
  },

  run : function() {
    while(Interpreter.i < Interpreter.codes.length) {
      Interpreter.next();
    }
  },

  next : function() {
    Interpreter.moveTo(500,500);
    Interpreter.iteration ++;
    debug(Interpreter.iteration);
    if(Interpreter.iteration > Interpreter.maxIteration) {
      error('Le nombre maximal d\'itération (' + Interpreter.maxIteration + ') a été atteint');
    }
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
      case 'JUMPZ':
        Interpreter.jumpz();
        break;
      case 'JUMPN':
        Interpreter.jumpn();
        break;
      case 'ADD':
        Interpreter.add();
        break;
      case 'SUB':
        Interpreter.sub();
        break;
      case 'INC':
        Interpreter.inc();
        break;
      case 'DEC':
        Interpreter.dec();
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
    Inputs.removeItem();
  },

  /**
   * OUTBOX
   */
  outbox : function() {
    if(!Interpreter.hand) {
      error("Outbox avec main vide.");
      return;
    }
    Outputs.addItem();
    Outputs.outputs.push(Interpreter.hand);
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
   * JUMPZ
   */
  jumpz : function() {
    if(Interpreter.hand === 0) {
      Interpreter.jump();
    } else {
      Interpreter.i ++;
    }
  },

  /**
   * JUMPN
   */
  jumpn : function() {
    if(Interpreter.hand < 0) {
      Interpreter.jump();
    } else {
      Interpreter.i ++;
    }
  },

  /**
   * ADD
   */
  add : function() {
    var addValue = parseInt(Interpreter.copyfrom());
    if(isNaN(addValue)) {
      error('La valeur ' + addValue + ' ne peut pas être additionné avec la main');
    }
    var hand = parseInt(Interpreter.hand);
    if(isNaN(hand)) {
      error('Impossible de faire une addition avec ' + hand);
    }
    Interpreter.hand +=  addValue;
  },

  /**
   * SUB
   */
  sub : function() {
    var subValue = parseInt(Interpreter.copyfrom());
    if(isNaN(subValue)) {
      error('La valeur ' + subValue + ' ne peut pas être soustraite avec la main');
    }
    var hand = parseInt(Interpreter.hand);
    if(isNaN(hand)) {
      error('Impossible de faire une addition avec ' + hand);
    }
    Interpreter.hand -=  subValue;
  },

  /**
   * INC
   */
  inc : function() {
    var value = parseInt(Interpreter.copyfrom());
    if(isNaN(value)) {
      error('La valeur ' + value + ' ne peut pas être incrémenté');
    }
    value++;
    Interpreter.hand = value;
    Interpreter.i --;
    Interpreter.copyto(value);
  },

  /**
   * DEC
   */
  dec : function() {
    var value = parseInt(Interpreter.copyfrom());
    if(isNaN(value)) {
      error('La valeur ' + value + ' ne peut pas être décrémenté');
    }
    value--;
    Interpreter.hand = value;
    Interpreter.i --;
    Interpreter.copyto(value);
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
