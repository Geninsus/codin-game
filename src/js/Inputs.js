var Inputs = {
  inputs : [],
  init   : function(inputs,game) {
    this.game = game;
    this.inputs = [];
    this.inputs = inputs;
    this.inputMask = this.game.add.graphics(0, 0);
    this.inputMask.beginFill(0xffffff);
    this.inputMask.alpha=0;
    this.inputMask.drawRect(49, 170, 32, 157);
    if(Interpreter.visual) {
      for (var i = 0 ; i < this.inputs.length ; i++) {
        this.inputs[i].setPosition(this.position(i));
        this.inputs[i].text.mask = this.inputMask;
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
    return new Phaser.Point(64.5,189+32*index);
  },

  replace : function () {
    for (var i = 0 ; i < Inputs.inputs.length ; i++) {
      Inputs.game.add.tween(Inputs.inputs[i].text).to(Inputs.position(i),500,Phaser.Easing.Linear.None,true);
    }
  },

  update : function() {
    for (var i = 0 ; i < this.inputs.length ; i++) {
      this.inputs[i].update();
    }
  },

  take: function() {
    var item = Inputs.inputs.shift();
    item.destroy(true);
    item.tween.onComplete.add(Inputs.replace);
    return item;
  },
  restart: function() {
    this.inputs.forEach(function(elt) {
      elt.destroy();
    });
  }
};