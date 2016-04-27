var Memory = {
  memory : [],

  init : function(values) {
    this.memory = values;
  },

  get : function(indice) {
    if(this.memory[indice] === undefined) {
      error("L'indice " + indice + " n'existe pas en mémoire.");
    }
    return this.memory[indice];
  },

  set : function(indice, value) {
    if(this.memory[indice] === undefined) {
      error("L'indice " + indice + " n'existe pas en mémoire.");
    }
    this.memory[indice] = value;
  },

  display: function() {
    document.querySelector('#memory').innerHTML = "";
    for(var el in this.memory) {
      document.querySelector('#memory').innerHTML += el + " ";
    }
  },

  position: function(index) {
    if (index<0 || index>19) {
      return "Error";
    }
    return {x:120 + 28*(index%5),y:154 + 28*(Math.floor(index/5))};
  }
};

var Inputs = {
  inputs : [],
  init   : function(inputs) {
    this.inputs = [];
    this.inputs = inputs;
    if(Interpreter.visual) {
      for (var i = 0 ; i < this.inputs.length ; i++) {
          this.inputs[i].sprite.x = 40;
          this.inputs[i].sprite.y = 360 + 28 * i;
          this.inputs[i].sprite.game.add.tween(this.inputs[i].sprite).to( Inputs.position(i), 300, Phaser.Easing.Linear.None, true);
      }
    }
  },
  push : function(elt) {
    this.inputs.push(elt);
  },

  position : function (index) {
    if (index<0) {
      return "Error";
    }
    return {x:40,y:360 - 10 + 28*index - 28*7};
  },

  takeItem : function () {
    for (var i = 0 ; i < this.inputs.length ; i++) {
        this.inputs[i].sprite.game.add.tween(this.inputs[i].sprite).to( Inputs.position(i), 300, Phaser.Easing.Linear.None, true);
    }
  }
};

var Outputs = {
  outputs : [],
  init    : function() {
    this.outputs = [];
  },
  push    : function(elt) {
    this.outputs.push(elt);
  },
  addItem : function() {
    for (var i = 0 ; i < this.outputs.length ; i++) {
        this.outputs[i].sprite.game.add.tween(this.outputs[i].sprite).to( {y :"+28"}, 300, Phaser.Easing.Linear.None, true);
    }
  },
  position : function (index) {
    if (index<0) {
      return "Error";
    }
    return {x:316,y:154 + 28*index};
  },
};


var Interpreter = {

  visual : false,

  codes : [],

  i : 0,

  maxIteration : 1000,

  iteration : 0,

  labels : {},

  dictionary : ['INBOX', 'OUTBOX', 'COPYTO', 'COPYFROM', 'LABEL', 'ADD', 'SUB', 'INC', 'DEC', 'JUMP', 'JUMPZ', 'JUMPN'],

  parser : function(code) {
    var codes = code.trim().split(/\s+/);
    Interpreter.codes = codes;
    if(codes[0] === "") codes = [];
    return codes;
  },

  init : function(visual=true,game) {
    Interpreter.iteration = 0;
    Interpreter.labels = {};
    Interpreter.i = 0;
    this.visual = visual;
    this.game = game;
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
      this.game.currentCommand.setText("Command : "+Interpreter.codes[Interpreter.i]);
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
        Player.hand = Interpreter.copyfrom();
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
    Player.hand = input;
    if(this.visual) {
      Player.moveTo(Player.inboxPosition,"take");
    }
  },

  /**
   * OUTBOX
   */
  outbox : function() {
    if(!Player.hand) {
      error("Outbox avec main vide.");
      return;
    }
    Outputs.push(Player.hand);
    if(this.visual) {
      Player.moveTo(Player.outboxPosition,"drop");
    }
    g.Game.prototype.checkWin(Outputs.outputs.length - 1);
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
    Memory.set(add, Player.hand);
    position = Memory.position(add);
    position.x += -35;
    position.y += -20;
    Player.moveTo(position,"copyto",add);
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
    if(Player.hand === 0) {
      Interpreter.jump();
    } else {
      Interpreter.i ++;
    }
  },

  /**
   * JUMPN
   */
  jumpn : function() {
    if(Player.hand < 0) {
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
    var hand = parseInt(Player.hand.children[0].text);
    if(isNaN(hand)) {
      error('Impossible de faire une addition avec ' + hand);
    }
    Player.hand.children[0].text = parseInt(Player.hand.children[0].text)+addValue;
  },

  /**
   * SUB
   */
  sub : function() {
    var subValue = parseInt(Interpreter.copyfrom());
    if(isNaN(subValue)) {
      error('La valeur ' + subValue + ' ne peut pas être soustraite avec la main');
    }
    var hand = parseInt(Player.hand);
    if(isNaN(hand)) {
      error('Impossible de faire une addition avec ' + hand);
    }
    Player.hand -=  subValue;
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
    Player.hand = value;
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
    Player.hand = value;
    Interpreter.i --;
    Interpreter.copyto(value);
  },

  reset : function() {
    Player.hand = null;
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
