
var Player = {

	sprite : null,

	game : null,

	hand : null,

	inboxPosition : {x : 68 , y : 360 - 8*28},

	init: function(game) {
		this.game = game;
		this.sprite = this.game.add.sprite(100,100,'player');
	},

	moveTo: function(position) {
		tween = this.game.add.tween(this.sprite).to( position, 200, Phaser.Easing.Linear.None, true);
	},

	take: function(item) {
		item.sprite.x = 0;
		item.sprite.y = 0;
		this.sprite.addChild(item.sprite);
	},

	drop: function() {
		this.sprite.removeChildAt(0);
	}
};