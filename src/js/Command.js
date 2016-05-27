

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
		this.game.codeHaveChange = true;
		Interpreter.isRunning = false;
		if(this.game.input.x > g._WIDTH-113-7 && this.game.input.y > 95) {

			if ( this.key == "copyfrom" || this.key == "copyto" || this.key == "add" || this.key == 'inc' || this.key == 'dec' ) {
				var style = { font: "15px Arial", fill: "#ffffff", align: "center" };
				var indexCommand = this.game.add.text(this.sprite.width-17,1,this.game.lastKey.text,style);
				this.sprite.addChild(indexCommand);
			}
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

			var myTween = this.game.add.tween(this.sprite).to({x:g._WIDTH-119,y:(this.game.commands.length>1)?this.game.commands[index-1].sprite.y+25:100}, 500, "Back.easeOut", true);
			if (this.key == 'copyto' || this.key == 'copyfrom' || this.key == 'add' || this.key == 'inc' || this.key == 'dec') {
				this.key += " " + this.sprite.getChildAt(0).text;
			}
			if(this.key == 'jump') {
				this.key = "jump "+ String.fromCharCode(65+this.game.nbLoop);
				myTween.onComplete.add(function(){
					var newLabel = Object.create(Command);
					newLabel.init(this.game,'label',new Phaser.Point(this.sprite.x,this.sprite.y+25),this.side,String.fromCharCode(65+this.game.nbLoop));
					newLabel.sprite.mask = this.game.commandsMask;
					this.game.nbLoop++;
					for (var i = 0 ; i < this.game.commands.length ; i++) {
						if (this.game.commands[i] === this) {
							break;
						}
					}
					this.game.commands.splice(i+1,0,newLabel);

					/* BEZIER */

					this.arrow = this.game.add.graphics(this.sprite.x+this.sprite.width,this.sprite.y+this.sprite.height/2);
				    this.loop = this.game.nbLoop;
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
				this.game.nbLoop--;
			}
			if (this.linkedJump) {
				for (var i = 0 ; i < this.game.commands.length ; i++) {
					if (this.game.commands[i] === this.linkedJump) {
						break;
					}
				}
				this.game.commands.splice(i,1);
				this.linkedJump.destroy();
				this.game.nbLoop--;
				this.game.commands.forEach(function(elt) {elt.loop--;});
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
		    this.arrow.lineTo(20+5*(this.loop-1), 0);
		    this.arrow.lineTo(20+5*(this.loop-1), (this.linkedLabel.sprite.y+this.linkedLabel.sprite.height/2)-(this.sprite.y+this.sprite.height/2));
		    this.arrow.lineTo(0,(this.linkedLabel.sprite.y+this.linkedLabel.sprite.height/2)-(this.sprite.y+this.sprite.height/2));
			var myShape = new PIXI.Polygon(5,-5+(this.linkedLabel.sprite.y+this.linkedLabel.sprite.height/2)-(this.sprite.y+this.sprite.height/2),5,5+(this.linkedLabel.sprite.y+this.linkedLabel.sprite.height/2)-(this.sprite.y+this.sprite.height/2),0,(this.linkedLabel.sprite.y+this.linkedLabel.sprite.height/2)-(this.sprite.y+this.sprite.height/2),5,-5+(this.linkedLabel.sprite.y+this.linkedLabel.sprite.height/2)-(this.sprite.y+this.sprite.height/2));
			this.arrow.beginFill(0xFF0000,0.8);
			this.arrow.drawShape(myShape);
			this.arrow.endFill();
		    this.arrow.mask = this.game.commandsMask;
		}
	},
	
	destroy: function() {
		this.sprite.destroy();
		if (this.arrow != undefined) {
			this.arrow.destroy();
			delete this.arrow;
		}
	}

};