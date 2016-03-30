
var Item = {

	sprite : null,

	style : { font: "20px Arial", fill: "#ff0044", align: "center" },

	value : null,

	init : function(game,x,y,value) {
		this.game = game;
		this.value = value;
		this.sprite = this.game.add.sprite(x, y, 'item');
		this.sprite.addChild(this.game.add.text(5, 5, this.value.toString(),this.style));
	}
}