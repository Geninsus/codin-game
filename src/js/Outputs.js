var Outputs = {
  outputs : [],
  init    : function(game) {
    this.game = game;
    this.outputs = [];
    this.outputMask = this.game.add.graphics(0, 0);
    this.outputMask.beginFill(0xffffff);
    this.outputMask.alpha=0;
    this.outputMask.drawRect(361, 170, 32, 157);
  },
  push    : function(elt) {
    this.outputs.push(elt);
  },
  replace : function() {
    for (var i = 0 ; i < Outputs.outputs.length ; i++) {
      Outputs.game.add.tween(Outputs.outputs[i].text).to(Outputs.position(Outputs.outputs.length-i),500,Phaser.Easing.Linear.None,true);
    }
  },
  position : function (index) {
    if (index<0) {
      return "Error";
    }
    return new Phaser.Point(376,189+32*index);
  },
  drop:function(item) {
    var newItem = Object.create(Item);
    newItem.init(item.game,item.value,true,Outputs.position(0).x,Outputs.position(0).y);
    newItem.tween.onComplete.add(Outputs.replace);
    newItem.text.mask = Outputs.outputMask; 
    Outputs.outputs.push(newItem);
  }
};