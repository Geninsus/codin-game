
var Player = {

	sprite : null,

	game : null,

	hand : null,

	action : null,

	spriteTween : null,

	inboxPosition : {x : 68 , y : 360 - 8*28},

	outboxPosition : {x : 285, y : 360 - 8*28},

	init: function(game) {
		this.game = game;
		this.sprite = this.game.add.sprite(100,100,'player');
		this.game.playerGroup.add(this.sprite);
		this.game.physics.arcade.enable(this.sprite);

		// Animations
		this.up = this.sprite.animations.add('up', [0,3], 10, true);
		this.left = this.sprite.animations.add('left', [4,7], 10, true);
		this.right = this.sprite.animations.add('right', [8,11], 10, true);
		this.down = this.sprite.animations.add('down', [12,15], 10, true);
	},

	moveTo: function(position, action = null, index = null) {
		//this.game.physics.arcade.moveToObject(this.sprite,Inputs.inputs[0].sprite);
		distance = Math.sqrt(Math.pow((position.x-this.sprite.x),2)+Math.pow((position.y-this.sprite.y),2));
		speed = (Interpreter.isRunning == true) ? 4:1; // Dans le futur, ce sera speed = var où var est le multiplicateur de vitesse (x2,x4,x8...)
		time = distance / (speed/10);
		if (time == 0) {
			time = 1;
		}
		this.spriteTween = this.game.add.tween(this.sprite).to( position, time, Phaser.Easing.Linear.None, true);
		this.action = action;
		this.dropIndex = index;
		this.spriteTween.onComplete.add(this.moveToCallback, this);
		if (position.x < this.sprite.x) {
			this.sprite.play('left');
		}
		else if (position.x > this.sprite.x) {
			this.sprite.play('right');
		}
		else if(position.y > this.sprite.y){
			this.sprite.play('up');
		}
		else if(position.y < this.sprite.y){
			this.sprite.play('down');
		}
	},

	moveToCallback : function() {
		this.spriteTween = null;
		this.sprite.animations.stop(null, true);
		if (this.action == "take") {
			this.take(this.hand);
			Inputs.takeItem();
	    }
      	else if (this.action == "drop") {
      		this.drop(Outputs.position(0));
      		Outputs.addItem();
      	}
      	else if (this.action == "copyto") {
      		var item = Object.create(Item);
    		item.init(this.game, this.hand.value, true,Memory.position(this.dropIndex).x,Memory.position(this.dropIndex).y);
      	}
      	else if (this.action == "copyfrom") {
      		item = this.drop();
      		if (item != null) {
      			item.kill();
      		}
      		this.take(this.hand);
      	}
	},

	take: function(item) {
		item.sprite.x = 0;
		item.sprite.y = 0;
		this.sprite.addChild(item.sprite);
	},

	drop: function(position= {x:0,y:0}) {
		item = this.sprite.removeChild(this.sprite.children[0]);
		if (item == null) {
			return null;
		}
		item.x = position.x;
		item.y = position.y;
		this.game.world.addChild(item);
		return item;
	},

	update: function() {

	}
};