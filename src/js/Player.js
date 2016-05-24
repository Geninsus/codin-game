
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
		this.sprite.anchor = {x: 0.5, y :1};
		this.game.physics.arcade.enable(this.sprite);
		this.tween = null;
		this.action = null;
		
		// Drone Initialisation
		this.drone = {item : null, sprite : this.game.add.sprite(+20,-130,'drone')};
		this.sprite.addChild(this.drone.sprite);
		this.drone.tweenRight = this.game.add.tween(this.drone.sprite).to({x : "+5"}, 2000,"Quart.easeOut");
		this.drone.tweenLeft = this.game.add.tween(this.drone.sprite).to({x : "-5"}, 2000,"Quart.easeOut");
		this.drone.tweenLeft.chain(this.drone.tweenRight);
		this.drone.tweenRight.chain(this.drone.tweenLeft);
		this.drone.tweenRight.start();
		// Animations
		this.idleLeft = this.sprite.animations.add('idleLeft', this.range(0,8) , 4, true);
		this.idleRight = this.sprite.animations.add('idleRight', this.range(9,17), 4, true);
		this.walkLeft = this.sprite.animations.add('walkLeft', this.range(18,26), 4, true);
		this.walkRight = this.sprite.animations.add('walkRight', this.range(27,35), 4, true);
		this.scanning = this.sprite.animations.add('scanning', this.range(36,48), 4, true);
		this.scanning.onLoop.add(function(){this.sprite.play('idleLeft');},this);
		this.sprite.play('idleLeft');
	},
	setItem: function(item) {
		if (this.drone.item != null) this.drone.item.destroy();
		this.drone.item = item;
		this.drone.sprite.addChild(item.text);
	},
	removeItem: function() {
		if (this.drone.item != null) this.drone.item.destroy();
	},
	scanTake: function(item) {
		this.moveTo({x:item.text.x+32, y:item.text.y});
		this.tween.onComplete.add(function(){
			this.sprite.play('scanning');
			var newItem = Object.create(Item);
			newItem.init(this.game,item.value,true,15,15);
			this.setItem(newItem);
		},this);

	},
	scanDrop: function() {
		this.moveTo(new Phaser.Point(Outputs.position(0).x-32,Outputs.position(0).y));
		this.tween.onComplete.add(function(){
			this.sprite.play('scanning');
			this.removeItem();
		},this);
	},
	moveTo: function(position) {
		this.tween = this.game.add.tween(this.sprite).to( position, 500, Phaser.Easing.Linear.None, true);
		this.tween.onComplete.add(function(){
			this.tween = null;
			this.sprite.animations.stop();
			this.sprite.play('idleLeft');
		},this,1);
		this.sprite.play('walkLeft');
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
	},
	range: function(start,end) {
		return Array(end-start+1).fill().map((i, idx) => start+idx)
	},
	copyto: function(index) {
		this.moveTo( new Phaser.Point(Memory.position(index).x+40,Memory.position(index).y));
		this.tween.onComplete.add(function(){
			this.sprite.play('scanning');
			var newItem = Object.create(Item);
			newItem.init(this.game,this.drone.item.value,true,Memory.position(index).x,Memory.position(index).y);
			Memory.set(index,newItem);
		},this);
	},
	copyfrom : function (item) {
		this.scanTake(item);

	},
	add : function(item) {
		var newItem = Object.create(Item);
		newItem.init(this.game,item.value+this.drone.item.value,true,15,15);
		this.moveTo(new Phaser.Point(item.text.x+40,item.text.y));
		this.tween.onComplete.add(function(){
			this.setItem(newItem);
		},this);
	}

};
