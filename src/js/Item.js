
var Item = {

	sprite : null,

	value : null,

	style : { font: "15px Arial", fill: "#ff0044", align: "center" },

	init : function(game, value, visual = false, x = null, y = null) {
		this.game = game;
		this.value = value;
		this.tween = null;
		if(visual) {
			this.text = this.game.add.text(5, 5, this.value.toString(),this.style)
			this.text.alpha = 0;
			this.text.anchor.x += 0.5;
			this.text.anchor.y += 0.5;
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
		if (this.text.alpha < 1) {
			this.text.alpha+=0.005;
		}
	}
};
