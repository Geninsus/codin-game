
var Player = {

	sprite : null,

	game : null,

	init: function(game) {
		this.game = game;
		this.sprite = this.game.add.sprite(20,20,'player');
	},

	moveTo: function(x,y) {
		this.game.add.tween(this.sprite).to( { x: x , y: y }, 200, Phaser.Easing.Linear.None, true);
	},

	take: function(item) {
		
	}
};