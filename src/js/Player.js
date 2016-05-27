
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
		this.sprite = this.game.add.sprite(100,250,'player');
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
		this.drone.sprite.animations.add('opening',this.range(0,18),true);
		this.drone.sprite.animations.add('closing',this.range(19,37),true);

		// Animations
		this.idleLeft = this.sprite.animations.add('idleLeft', this.range(42,42) , 4, true);
		this.idleRight = this.sprite.animations.add('idleRight', this.range(28,28), 4, true);
		this.walkLeft = this.sprite.animations.add('walkLeft', this.range(42,50), 8, true);
		this.walkRight = this.sprite.animations.add('walkRight', this.range(28,36), 8, true);
		this.scanning = this.sprite.animations.add('scanning', this.range(0,13), 8, true);
		this.scanningLeft = this.sprite.animations.add('scanningLeft', this.range(14,27), 8, true);
		this.scanningRight = this.sprite.animations.add('scanningRight', this.range(0,13), 8, true);
		this.scanningLeft.onLoop.add(function(){this.sprite.play('idleLeft');},this);
		this.scanningRight.onLoop.add(function(){this.sprite.play('idleRight');},this);
		this.walkRight.onComplete.add(function(){this.sprite.play('idleRight');},this);
		this.walkLeft.onComplete.add(function(){this.sprite.play('idleLeft');},this);
		this.sprite.play('idleLeft',10,true);
	},
	setItem: function(params) {
		var newItem = Object.create(Item);	
		if (this.drone.item == null) {
			this.drone.sprite.play('opening',18);
			this.drone.sprite.animations.currentAnim.onComplete.addOnce(function() {
				newItem.init(params[0],params[1],params[2],params[3],params[4]);
				this.drone.sprite.addChild(newItem.text);


			},this);

		}
		else{
			this.drone.item.destroy();	
			newItem.init(params[0],params[1],params[2],params[3],params[4]);
			this.drone.sprite.addChild(newItem.text);
		}		
		this.drone.item = newItem;
	},
	removeItem: function() {
		if (this.drone.item != null) {
			this.drone.item.destroy();
			this.drone.sprite.play('closing',18);
		}
		this.drone.item = null;
	},
	scanTake: function(item, action = null) {

		this.moveTo({x:item.text.x+32, y:item.text.y+35});

		this.tween.onComplete.add(function(){
			console.log(this.sprite.animations.currentAnim.name);

			if (this.sprite.animations.currentAnim.name =="idleLeft" || this.sprite.animations.currentAnim.name =="walkLeft") this.sprite.play('scanningLeft');
			else this.sprite.play('scanningRight');
			this.setItem([this.game,item.value,true,15,25]);
			if (action == 'inbox') {
			    item.destroy(true);
				item.tween.onComplete.add(Inputs.replace);
			}
		},this);

	},
	scanDrop: function() {
		this.moveTo(new Phaser.Point(Outputs.position(0).x-32,Outputs.position(0).y+35));
		this.tween.onComplete.add(function(){
			console.log(this.sprite.animations.currentAnim.name);
			if (this.sprite.animations.currentAnim.name =="idleLeft" || this.sprite.animations.currentAnim.name =="walkLeft") this.sprite.play('scanningLeft');
			else this.sprite.play('scanningRight');
    		Outputs.drop(Player.drone.item);
			this.removeItem();
    		this.game.checkWin(Outputs.outputs.length - 1, this.game);

		},this);
	},
	moveTo: function(position) {
		this.tween = this.game.add.tween(this.sprite).to( position, 1000, Phaser.Easing.Linear.None, true);
		this.tween.onComplete.add(function(){
			this.tween = null;
			this.sprite.animations.stop();
			/*if (position.x > this.sprite.x) {
				this.sprite.play('idleRight');
			}
			else {
				this.sprite.play('idleLeft');
			}*/

		},this,1);
		if (position.x > this.sprite.x) {
			this.sprite.play('walkRight');
		}
		else {
			this.sprite.play('walkLeft');
		}
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
			if (this.sprite.animations.currentAnim.name =="idleLeft" || this.sprite.animations.currentAnim.name =="walkLeft") this.sprite.play('scanningLeft');
			else this.sprite.play('scanningRight');
			var newItem = Object.create(Item);
			newItem.init(this.game,this.drone.item.value,true,Memory.position(index).x,Memory.position(index).y);
			Memory.set(index,newItem);
		},this);
	},
	copyfrom : function (item) {
		this.scanTake(item);
	},
	add : function(item) {
		this.moveTo(new Phaser.Point(item.text.x+40,item.text.y));
		this.tween.onComplete.add(function(){
			if (this.sprite.animations.currentAnim.name =="idleLeft" || this.sprite.animations.currentAnim.name =="walkLeft") this.sprite.play('scanningLeft');
			else this.sprite.play('scanningRight');
			this.setItem([this.game,item.value+this.drone.item.value,true,15,25]);
			//this.sprite.play('idleLeft');
		},this);
	},
	restart: function() {
		if (this.drone.item != null) this.drone.item.destroy();
		this.sprite.destroy();
		this.init(this.game);
	},
	inc : function() {
		
	}

};
