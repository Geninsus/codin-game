var Memory = {
  init : function(values) {
    Memory.memory = values;
  },

  get : function(indice) {
    if(Memory.memory[indice] === undefined) {
      error("L'indice " + indice + " n'existe pas en mémoire.");
    }
    var tmpSprite = Memory.memory[indice].game.add.sprite(Memory.memory[indice].x, Memory.memory[indice].y, 'item');
    var style = { font: "20px Arial", fill: "#ff0044", align: "center"};
    tmpSprite.addChild(tmpSprite.game.add.text(5, 5, Memory.memory[indice].children[0].text.toString(), style));
    tmpSprite.game.add.tween(tmpSprite).to( { x:52, y:278 }, 20, Phaser.Easing.Linear.None, true);
    return tmpSprite;
  },

  set : function(indice, value) {
    if(Memory.memory[indice] === undefined) {
      error("L'indice " + indice + " n'existe pas en mémoire.");
    }
    Memory.memory[indice] = value.game.add.sprite(value.x, value.y, 'item');
    var style = { font: "20px Arial", fill: "#ff0044", align: "center"};
    Memory.memory[indice].addChild(Memory.memory[indice].game.add.text(5, 5, value.children[0].text.toString(), style));
    Memory.memory[indice].game.add.tween(Memory.memory[indice]).to( { x:90+indice*42, y:194 }, 20, Phaser.Easing.Linear.None, true);
  },

  display: function() {
    document.querySelector('#memory').innerHTML = "";
    for(var el in Memory.memory) {
      document.querySelector('#memory').innerHTML += el + " ";
    }
  }
};

var Inputs = {

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

  maxIteration : 1000,

  iteration : 0,

  hand : null,

  labels : {},

  dictionary : ['INBOX', 'OUTBOX', 'COPYTO', 'COPYFROM', 'LABEL', 'ADD', 'SUB', 'INC', 'DEC', 'JUMP', 'JUMPZ', 'JUMPN'],

  parser : function(code) {
    var codes = code.trim().split(/\s+/);
    Interpreter.codes = codes;
    if(codes[0] === "") codes = [];
    return codes;
  },

  init : function() {
    Interpreter.iteration = 0;
    Interpreter.labels = {};
    Interpreter.i = 0;
  },

  run : function() {
    while(Interpreter.i < Interpreter.codes.length) {
      Interpreter.next();
    }
  },

  next : function() {
    Interpreter.iteration ++;
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
    Interpreter.hand = input;
    Interpreter.hand.game.add.tween(Interpreter.hand).to( { x: 52 }, 20, Phaser.Easing.Linear.None, true);
    Inputs.inputs[0].visible = true;
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
    Interpreter.hand.game.add.tween(Interpreter.hand).to( { x:278 , y:278}, 20, Phaser.Easing.Linear.None, true);
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
    return Memory.get(add);
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
    var value = Interpreter.copyfrom();
    value.visible = false;
    var addValue = parseInt(value.children[0].text);
    if(isNaN(addValue)) {
      error('La valeur ' + addValue + ' ne peut pas être additionné avec la main');
    }
    var hand = parseInt(Interpreter.hand.children[0].text);
    if(isNaN(hand)) {
      error('Impossible de faire une addition avec ' + hand);
    }
    Interpreter.hand.children[0].text = parseInt(Interpreter.hand.children[0].text)+addValue;
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
  alert(string);
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
