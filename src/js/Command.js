

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
		if(this.game.input.x > g._WIDTH-134-7 && this.game.input.y > 95) {
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

					this.arrow = this.game.add.graphics(this.sprite.x+this.sprite.width,this.sprite.y+this.sprite.height/2);
				    this.arrow.lineStyle(2, 0xFF0000, 0.8);
				    this.arrow.lineTo(20*this.game.nbCommandsGoTo, 0);
				    this.arrow.lineTo(20*this.game.nbCommandsGoTo, (newLabel.sprite.y+newLabel.sprite.height/2)-(this.sprite.y+this.sprite.height/2));
				    this.arrow.lineTo(0,(newLabel.sprite.y+newLabel.sprite.height/2)-(this.sprite.y+this.sprite.height/2));
				    this.linkedLabel = newLabel;
				    newLabel.linkedJump = this;
					// END BEZIER

				},this);
			}
		}
		else {
			if (this.linkedLabel) {
				for (var i = 0 ; i < this.game.commands.length ; i++) {
					if (this.game.commands[i] === this.linkedLabel) {
						break;
					}
				}
				this.game.commands.splice(i,1);
				this.linkedLabel.destroy();
			}
			if (this.linkedJump) {
				for (var i = 0 ; i < this.game.commands.length ; i++) {
					if (this.game.commands[i] === this.linkedJump) {
						break;
					}
				}
				this.game.commands.splice(i,1);
				this.linkedJump.destroy();
			}
			this.destroy();
		}
		console.log(this.game.commands);
	},

	update: function() {
		if (this.arrow) {
			this.arrow.clear();
			this.arrow = this.game.add.graphics(this.sprite.x+this.sprite.width,this.sprite.y+this.sprite.height/2);
		    this.arrow.lineStyle(2, 0xFF0000, 0.8);
		    this.arrow.lineTo(20*this.game.nbCommandsGoTo, 0);
		    this.arrow.lineTo(20*this.game.nbCommandsGoTo, (this.linkedLabel.sprite.y+this.linkedLabel.sprite.height/2)-(this.sprite.y+this.sprite.height/2));
		    this.arrow.lineTo(0,(this.linkedLabel.sprite.y+this.linkedLabel.sprite.height/2)-(this.sprite.y+this.sprite.height/2));
		}
	},
	
	destroy: function() {
		this.sprite.destroy();
		if (this.arrow != undefined) {
			this.arrow.destroy();
			this.arrow = undefined;
		}
	}

};