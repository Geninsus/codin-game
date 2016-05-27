
var Interpreter = {

  visual : false,

  codes : [],

  i : 0,

  maxIteration : 1000,

  iteration : 0,

  labels : {},

  isRunning : false,

  speed: 1,

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
    this.isRunning = true;
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
        Interpreter.copyfrom();
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

    var input = Inputs.take(input);
    if(!input) {
      error("Inputs vide.");
    }
    else {
      Player.scanTake(input,'inbox');
    }
  },

  /**
   * OUTBOX
   */
  outbox : function() {
    if(Player.drone.item == null) {
      error("Outbox avec main vide.");
      return;
    }
    Player.scanDrop();


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
    Player.copyto(add);
  },

  /**
   * COPYFROM
   */
  copyfrom : function(action = true) {
    Interpreter.i++;
    var add = Interpreter.codes[Interpreter.i];
    console.log(add);
    var item = Memory.get(add);
    if (action) {
      Player.copyfrom(item);
    }
    return item;
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

    if (Player.drone.item == null) {
      error('Impossible de faire une addition sans valeur dans le drone');
    }

    var value = Interpreter.copyfrom(false);
    Player.add(value)
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
    var item = Interpreter.copyfrom();
    item.setValue(item.value+1);
    Player.drone.item.setValue(Player.drone.item.value+1);

  },

  /**
   * DEC
   */
  dec : function() {
    var item = Interpreter.copyfrom();
    item.setValue(item.value-1);
    Player.drone.item.setValue(Player.drone.item.value-1);
  },

  reset : function() {
    Player.hand = null;
    Interpreter.codes = [];
  }

};

function error(string) {
  console.log(string);

  var style = { font: "13px Arial", fill: '#ffffff', backgroundColor: 'rgba(135,120,110,1)' }
  Interpreter.game.error = Interpreter.game.add.text(217, 330, string, style );
  Interpreter.game.error.anchor.x = 0.5;
  Interpreter.game.error.anchor.y = 1;
  Interpreter.game.manageStop();
  Interpreter.isRunning = false;
  Interpreter.i = Interpreter.codes.length;
  Interpreter.game.codeHaveChange = true;
}

function debug(string) {
  if(DEBUG){
    console.log(string);
  }
}
