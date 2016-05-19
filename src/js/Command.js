

var Command = {

	init: function(game,key,position,side = 'left',letter = null) {
		this.game = game;
		this.sprite = this.game.add.sprite(position.x,position.y,key);
		this.key = key;
		if(letter != null) this.key += " "+ letter;
		this.side = side;
		this.sprite.inputEnabled = true;
		this.sprite.input.enableDrag();
		this.sprite.events.onDragStart.add(this.onDragStart, this,0);
		this.sprite.events.onDragStop.add(this.onDragStop, this,0);
	},

	onDragStart: function() {
		if(this.side == 'left') {
			var newCommand = Object.create(Command);
			newCommand.init(this.game,this.key,new Phaser.Point(this.sprite.x,this.sprite.y),this.side);
		}
		else if(this.side == 'right') {
			for (var i = 0 ; i < this.game.commands.length ; i++) {
				if (this.game.commands[i] === this) {
					break;
				}
			}
			var index = i;
			this.game.commands.splice(i,1);
			for (var i = index ; i < this.game.commands.length ; i++) {
				this.game.add.tween(this.game.commands[i].sprite).to({y:'-25'}, 500, "Back.easeOut", true);
			}

		}
	},
	onDragStop: function() {
		if(this.game.input.x > g._WIDTH-134-7) {
			this.sprite.mask = this.game.commandsMask;
			this.side = 'right';
			for (var i = 0 ; i < this.game.commands.length ; i++) {
				if (this.game.commands[i].sprite.y > this.game.input.y) {
					break;
				}
			}
			var index = i;
			this.game.commands.splice(index,0,this);
			for (var i = index+1 ; i < this.game.commands.length ; i++) {
				this.game.add.tween(this.game.commands[i].sprite).to({y:(this.key == 'jump')?'+50':'+25'}, 500, "Back.easeOut", true);
			}
			var myTween = this.game.add.tween(this.sprite).to({x:g._WIDTH-134,y:(this.game.commands.length>1)?this.game.commands[index-1].sprite.y+25:100}, 500, "Back.easeOut", true);
			if(this.key == 'jump') {
				this.key = "jump "+ String.fromCharCode(65+this.game.nbCommandsGoTo);
				myTween.onComplete.add(function(){
					var newLabel = Object.create(Command);
					newLabel.init(this.game,'label',new Phaser.Point(this.sprite.x,this.sprite.y+25),this.side,String.fromCharCode(65+this.game.nbCommandsGoTo));
					this.game.nbCommandsGoTo++;
					for (var i = 0 ; i < this.game.commands.length ; i++) {
						if (this.game.commands[i] === this) {
							break;
						}
					}
					this.game.commands.splice(i+1,0,newLabel);

					/* BEZIER */


					// END BEZIER

				},this);
			}
		}
		else {
			this.sprite.destroy();
		}

		console.log(this.game.commands);
	}

};

/*

onDragStartRight: function(box) {
		for (var i = 0 ; i < this.commandsSprite.length ; i++) {
			if (this.commandsSprite[i] === box) {
				break;
			}
		}
		var index = i;
		this.commandsSprite.splice(i,1);
		for (var i = index ; i < this.commandsSprite.length ; i++) {
			this.add.tween(this.commandsSprite[i]).to({y:'-25'}, 500, "Back.easeOut", true);
		}
	},
	onDragStopRight: function(box) {
		for (var i = 0 ; i < this.commandsSprite.length ; i++) {
			if (this.commandsSprite[i].y > this.input.y) {
				break;
			}
		}
		var index = i;
		if(this.input.x > g._WIDTH-134-7) {
			this.commandsSprite.splice(index,0,box);
			for (var i = index+1 ; i < this.commandsSprite.length ; i++) {
				this.add.tween(this.commandsSprite[i]).to({y:'+25'}, 500, "Back.easeOut", true);
			}
			box.mask = this.commandsMask;
			this.add.tween(box).to({x:g._WIDTH-134,y:(this.commandsSprite.length>1)?this.commandsSprite[index-1].y+25:100}, 500, "Back.easeOut", true);
		}
		else {
			box.destroy();
		}
	},
	onDragStart: function(box) {
		newBox = this.add.sprite(box.x,box.y,box.key);
		box.z += 100; 
		newBox.inputEnabled = true;
		newBox.input.enableDrag();
		newBox.events.onDragStart.add(this.onDragStart, this,0);
		newBox.events.onDragStop.add(this.onDragStop, this,0);
	},

	onDragStop: function(box) {
		for (var i = 0 ; i < this.commandsSprite.length ; i++) {
			if (this.commandsSprite[i].y > this.input.y) {
				break;
			}
		}
		var index = i;
		if(this.input.x > g._WIDTH-134-7) {
			this.commandsSprite.splice(index,0,box);
			for (var i = index+1 ; i < this.commandsSprite.length ; i++) {
				this.add.tween(this.commandsSprite[i]).to({y:(this.commands[i] != "jump")?'+25':'50'}, 500, "Back.easeOut", true);
			}
			box.events.onDragStart.removeAll();
			box.events.onDragStop.removeAll();
			if(this.commands[i] == "jump") {
				box.events.onDragStop.add(this.onDragStopJump, this,-1);
			}

			box.events.onDragStart.add(this.onDragStartRight, this,0);
			box.events.onDragStop.add(this.onDragStopRight, this,0);
			box.mask = this.commandsMask;
			var myTween = this.add.tween(box).to({x:g._WIDTH-134,y:(this.commandsSprite.length>1)?this.commandsSprite[index-1].y+25:100}, 500, "Back.easeOut", true);
			if (box.key == "jump" ){
				myTween.onComplete.add(function(tween){
					console.log(tween);
					this.add.sprite(tween.x,tween.y + 25,'label');
				},this);
			}
		}
		else {
			box.destroy();
		}
	},
	*/