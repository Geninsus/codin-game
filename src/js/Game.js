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

		this.player = this.add.sprite(20,20,'player');
		this.nextButton = this.add.button(g._WIDTH-(this.pauseButton.width)*2-8*2,this.pauseButton.height + 8*2, 'button-navigation', this.manageNext, this);
		this.previousButton = this.add.button(g._WIDTH-this.pauseButton.width-8,this.pauseButton.height + 8*2, 'button-navigation', this.managePrevious, this);
		this.previousButton.frame = 1;



		this.startLevel(this._currentLevel-1);
	},
	startLevel: function() {
		Inputs.init(data[this._currentLevel-1].inputsGenerator());
		Inputs.inputs = []
		var style = { font: "20px Arial", fill: "#ff0044", align: "center",};
		for (var i = 0 ; i < data[this._currentLevel-1].inputs.length; i++) {
			var item = this.add.sprite(10, 278, 'item');
			if (i != 0) {
				item.visible = false;
			}
			item.addChild(this.add.text(5, 5, data[this._currentLevel-1].inputs[i].toString(), style));
			Inputs.inputs.push(item);
		}
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
