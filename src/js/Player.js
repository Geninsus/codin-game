
var Player = {

	sprite : null,

	game : null,

	hand : null,

	action : null,

	inboxPosition : {x : 68 , y : 360 - 8*28},

	outboxPosition : {x : 285, y : 360 - 8*28},

	init: function(game) {
		this.game = game;
		this.sprite = this.game.add.sprite(100,100,'player');
		this.game.physics.arcade.enable(this.sprite);

		// Animations
		this.up = this.sprite.animations.add('up', [0,3], 10, true);
		this.left = this.sprite.animations.add('left', [4,7], 10, true);
		this.right = this.sprite.animations.add('right', [8,11], 10, true);
		this.down = this.sprite.animations.add('down', [12,15], 10, true);
	},

	moveTo: function(position, action = "take") {
		//this.game.physics.arcade.moveToObject(this.sprite,Inputs.inputs[0].sprite);
		tween = this.game.add.tween(this.sprite).to( position, 1000, Phaser.Easing.Linear.None, true);
		this.action = action
		tween.onComplete.add(this.moveToCallback, this);
		if (position.x < this.sprite.x) {
			this.sprite.play('left');
		}
		else if (position.x > this.sprite.x) {
			this.sprite.play('right');
		}
	},

	moveToCallback : function() {
		this.sprite.animations.stop();
		if (this.action == "take") {
			this.take(this.hand);
			Inputs.takeItem();
	      	}
      	else if (this.action == "drop") {
      		this.drop();
      	}
	},

	take: function(item) {
		item.sprite.x = 0;
		item.sprite.y = 0;
		this.sprite.addChild(item.sprite);
		//this.sprite.play('right');
	},

	drop: function() {
		this.sprite.removeChildAt(0);
	},

	update: function() {

	}
};