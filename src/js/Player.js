
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
		this.scann = this.game.add.sprite(0,0,'scanning');
		this.scann.anchor = {x: 0.5, y :1};
		this.scann.alpha = 0;
		this.sprite.addChild(this.scann);

		this.sprite.anchor = {x: 0.5, y :1};
		this.game.physics.arcade.enable(this.sprite);
		this.tween = null;
		this.action = null;
		
		// Drone Initialisation
		this.drone = {item : null, sprite : this.game.add.sprite(+20,-70,'drone')};
		this.sprite.addChild(this.drone.sprite);
		this.drone.tweenRight = this.game.add.tween(this.drone.sprite).to({x : "+5"}, 2000,"Quart.easeOut");
		this.drone.tweenLeft = this.game.add.tween(this.drone.sprite).to({x : "-5"}, 2000,"Quart.easeOut");
		this.drone.tweenLeft.chain(this.drone.tweenRight);
		this.drone.tweenRight.chain(this.drone.tweenLeft);
		this.drone.tweenRight.start();
		// Animations
		this.up = this.sprite.animations.add('up', [0,3], 10, true);
		this.left = this.sprite.animations.add('left', [4,7], 10, true);
		this.right = this.sprite.animations.add('right', [8,11], 10, true);
		this.down = this.sprite.animations.add('down', [12,15], 10, true);
		this.scanning = this.scann.animations.add('scanning',null,2);
		this.scanning.onStart.add(function(){this.scann.alpha = 1;},this);
		this.scanning.onComplete.add(function(){this.scann.alpha = 0;},this);
	},
	scan: function(item) {
		this.moveTo({x:item.text.x+32, y:item.text.y});
		this.tween.onComplete.add(function(){
			this.scann.play('scanning');
			this.scanning.onComplete.add(function(){Input.replace();},this);
			item.destroy();
		},this);

	},
	moveTo: function(position) {
		this.tween = this.game.add.tween(this.sprite).to( position, 500, Phaser.Easing.Linear.None, true);
		this.tween.onComplete.add(function(){this.tween = null;},this,1);
	},
	update: function() {
		if(this.tween != null) {
			this.drone.tweenRight.pause();
			this.drone.tweenLeft.pause();
		}
		else {
			this.drone.tweenRight.resume();
			this.drone.tweenLeft.resume();
		}
	}
};
