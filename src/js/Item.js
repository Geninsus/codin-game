
var Item = {

	sprite : null,

	value : null,

	style : { font: "15px Arial", fill: "#ff0044", align: "center" },

	init : function(game, value, visual = false, x = null, y = null) {
		this.game = game;
		this.value = value;
		if(visual) {
			this.sprite = this.game.add.sprite(x, y, 'item');
			this.sprite.addChild(this.game.add.text(5, 5, this.value.toString(),this.style));
		}
	},

	setValue: function(n) {
		this.value = n;
		this.sprite.children[0].text = n.toString();
	}
};
