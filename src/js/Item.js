
var Item = {

	sprite : null,

	value : null,

	style : { font: "15px Arial", fill: "#ff0044", align: "center" },

	init : function(game, value, visual = false, x = 0, y = 0) {
		this.game = game;
		this.value = value;
		this.tween = null;
		if(visual) {
			this.text = this.game.add.text(x, y, this.value.toString(),this.style)
			this.text.alpha = 0;
			this.text.anchor.x += 0.5;
			this.text.anchor.y += 0.5;
			this.tween = this.game.add.tween(this.text).to({alpha:1},3000,Phaser.Easing.Linear.None,true);
		}
	},

	setValue: function(n) {
		this.value = n;
		this.text.text = n.toString();
	},
    setPosition(position){
    	this.text.x = position.x;
    	this.text.y = position.y;
    },
	update: function() {
	},
	destroy: function() {
		this.tween = this.game.add.tween(this.text).to({alpha:0},3000,Phaser.Easing.Linear.None,true);
		this.tween.onComplete.add(function() {this.text.destroy();},this);
	}
};
