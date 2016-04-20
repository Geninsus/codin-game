g.Game = function(game) {};
g.Game.prototype = {
	levelNumber : null,
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

		/*Initialisation Player*/
		Player.init(this);

		this.nextButton = this.add.button(g._WIDTH-(this.pauseButton.width)*2-8*2,this.pauseButton.height + 8*2, 'button-navigation', this.managePrevious, this);
		this.previousButton = this.add.button(g._WIDTH-this.pauseButton.width-8,this.pauseButton.height + 8*2, 'button-navigation', this.manageNext, this);
		this.previousButton.frame = 1;

		var style = { font: "20px Arial", fill: "#ff0044", align: "center"};
		this.currentCommand = this.add.text(40,25,"COMMANDS",style);

		this.startLevel();
	},
	startLevel: function() {
		levelNumber = this._currentLevel;
		data.levels[levelNumber-1].inputsGenerator();
		this.currentLevel = 42;
		var inputs = [];
		for (var i = 0 ; i < data.inputs.length; i++) {
			var item = Object.create(Item);
			item.init(this, data.inputs[i], true, 10, 278);
			if (i !== 0) {
				item.sprite.visible = false;
			}
			inputs.push(item);
		}
		Inputs.init(inputs);
		Outputs.init();
		Memory.init(data.levels[levelNumber-1].memory);
		Interpreter.init(true);
		Interpreter.parser("LABEL A INBOX OUTBOX JUMP A");
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
	},
	checkWin : function(i) {
		if(Outputs.outputs[i].value != data.outputs[i]) {
			alert('La sortie vaut ' + Outputs.outputs[i].value + ' alors qu\'elle devrait valoir ' + data.outputs[i]);
		} else {
			if(Outputs.outputs.length == data.outputs.length) {
				data.levels[levelNumber-1].inputsGenerator();
				var inputs = [];
				for (var i = 0 ; i < data.inputs.length; i++) {
					var item = Object.create(Item);
					item.init(this, data.inputs[i]);
					if(item.sprite != null) {
						if (i !== 0) {
							item.sprite.visible = false;
						}
					}
					inputs.push(item);
				}
				Inputs.init(inputs);
				Outputs.init();
				Memory.init([0]);
				Interpreter.init(false);
				Interpreter.parser("LABEL A INBOX OUTBOX JUMP A");
			}
		}
	}
};
