g.Game = function(game) {};
g.Game.prototype = {
	create: function() {
		this.add.sprite(0, 0, 'screen-bg');
		this.add.sprite(g._WIDTH-160,0, 'panel-left');

		this.ballStartPos = { x: g._WIDTH*0.5, y: g._HEIGHT*0.5 };

		this.pauseButton = this.add.button(g._WIDTH-8, 8, 'button-pause', this.managePause, this);
		this.pauseButton.anchor.set(1,0);
		this.pauseButton.input.useHandCursor = true;
		this.audioButton = this.add.button(g._WIDTH-this.pauseButton.width-8*2, 8, 'button-audio', this.manageAudio, this);
		this.audioButton.anchor.set(1,0);
		this.audioButton.input.useHandCursor = true;
		this.audioButton.animations.add('true', [0], 10, true);
		this.audioButton.animations.add('false', [1], 10, true);
		this.audioButton.animations.play(this.audioStatus);
		this.previousButton = this.add.button(g._WIDTH-(this.pauseButton.width)*2-8*2,this.pauseButton.height + 8*2, 'button-navigation', this.managePrevious, this);
		this.nextButton = this.add.button(g._WIDTH-this.pauseButton.width-8,this.pauseButton.height + 8*2, 'button-navigation', this.manageNext, this);
		this.nextButton.frame = 1;
		
		this.player = this.add.sprite(this.ballStartPos.x, this.ballStartPos.y, 'player');

		this.startLevel();
	},
	startLevel: function() {
		//Inputs.init(data[this._currentLevel-1].inputsGenerator());
		var style = { font: "20px Arial", fill: "#ff0044", align: "center",};
		var inputs = [];
		for (var i = 0 ; i < data[this._currentLevel-1].inputsGenerator().length ; i++) {
			var item = this.add.sprite(10, g._HEIGHT - 42*(i+1) + 200, 'item');
			this.add.tween(item).to( { y: '-200' }, 2000, Phaser.Easing.Linear.None, true);
			item.addChild(this.add.text(15, 2, data[this._currentLevel-1].inputsGenerator()[i].toString(), style))
			inputs.push(item);
		}
		Inputs.init(inputs);
		Outputs.init([]);
		Memory.init([]);
		Interpreter.parser("LABEL 1 INBOX OUTBOX GOTO 1");
		Interpreter.player = this.player;
	},
	managePause: function() {
		this.game.paused = true;
		var pausedText = this.add.text(g._WIDTH*0.5, 250, "Game paused,\ntap anywhere to continue.", this.fontMessage);
		pausedText.anchor.set(0.5);
		this.input.onDown.add(function(){
			pausedText.destroy();
			this.game.paused = false;
		}, this);
	},
	managePrevious: function() {

	},
	manageNext: function() {
		Interpreter.next();
	},
	manageAudio: function() {
		this.audioStatus =! this.audioStatus;
		this.audioButton.animations.play(this.audioStatus);
	},
	update: function() {
	},
	render: function() {
	}
};