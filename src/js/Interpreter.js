
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
    Interpreter.isRunning = false;
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
    Player.scanTake(input);
  },

  /**
   * OUTBOX
   */
  outbox : function() {
    if(!Player.drone.item) {
      error("Outbox avec main vide.");
      return;
    }
    Outputs.drop(Player.drone.item);
    Player.scanDrop();
    if(this.visual) {
      g.Game.prototype.checkWin(Outputs.outputs.length - 1, this.game);
    } else {
      g.Game.prototype.checkWinExpress(Outputs.outputs.length - 1, this.game);
    }

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
    /*value.visible = false;
    var addValue = parseInt(value.children[0].text);
    if(isNaN(addValue)) {
      error('La valeur ' + addValue + ' ne peut pas être additionné avec la main');
    }
    var hand = parseInt(Player.hand.children[0].text);
    if(isNaN(hand)) {
      error('Impossible de faire une addition avec ' + hand);
    }
    Player.hand.children[0].text = parseInt(Player.hand.children[0].text)+addValue;
    */
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
  var style = { font: "13px Arial", fill: '#ffffff', backgroundColor: 'rgba(135,120,110,1)' }
  Interpreter.game.error = Interpreter.game.add.text(217, 330, string, style );
  Interpreter.game.error.anchor.x = 0.5;
  Interpreter.game.error.anchor.y = 1;

  Interpreter.i = Interpreter.codes.length;
}

function debug(string) {
  if(DEBUG){
    console.log(string);
  }
}
