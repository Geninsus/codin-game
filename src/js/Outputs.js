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