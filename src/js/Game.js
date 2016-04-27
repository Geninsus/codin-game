g.Game = function(game) {};
g.Game.prototype = {
	levelNumber : null,
	verfifNumber : null
	create: function() {
		this.add.sprite(0, 0, 'screen-bg');
		this.add.sprite(g._WIDTH-160,0, 'panel-left');


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

		this.nextButton = this.add.button(g._WIDTH-(this.pauseButton.width)*2-8*2,this.pauseButton.height + 8*2, 'button-navigation', this.manageRun, this);
		this.previousButton = this.add.button(g._WIDTH-this.pauseButton.width-8,this.pauseButton.height + 8*2, 'button-navigation', this.manageNext, this);
		this.previousButton.frame = 1;

		var style = { font: "20px Arial", fill: "#ff0044", align: "center"};
		this.currentCommand = this.add.text(40,25,"Command : ",style);

		this.startLevel();

		this.add.sprite(680-180-100, 90, 'inc');
		this.add.sprite(680-180-100, 115, 'dec');
		this.add.sprite(680-180-100, 140, 'jump');
		this.add.sprite(680-180-110, 165, 'jumpz');

	},
	startLevel: function() {
		levelNumber = this._currentLevel;
		verfifNumber = 100;
		data.levels[levelNumber-1].inputsGenerator();
		var inputs = [];
		for (var i = 0 ; i < data.inputs.length; i++) {
			var item = Object.create(Item);
			item.init(this, data.inputs[i], true);
			inputs.push(item);
		}
		Interpreter.init(true, this);
		Inputs.init(inputs);
		Outputs.init();
		Memory.init(data.levels[levelNumber-1].memory);
		Interpreter.parser("LABEL A INBOX COPYTO 0 COPYTO 10 OUTBOX JUMP A");
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
		if (Player.spriteTween == null) {
			Interpreter.next();
		}
	},
	manageRun: function() {
		while(Interpreter.i < Interpreter.codes.length) {
      Interpreter.next();
    }
	},
	manageAudio: function() {
		this.audioStatus =! this.audioStatus;
		this.audioButton.animations.play(this.audioStatus);
	},
	update: function() {
		Player.update();
	},
	render: function() {
	},
	checkWin : function(i) {
		if(Outputs.outputs[i].value != data.outputs[i]) {
			alert('La sortie vaut ' + Outputs.outputs[i].value + ' alors qu\'elle devrait valoir ' + data.outputs[i]);
		} else {
			if(Outputs.outputs.length == data.outputs.length) {
				alert('fini');
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
				Interpreter.init(false,this);
				Inputs.init(inputs);
				Outputs.init();
				Memory.init(data.levels[levelNumber-1].memory);
				Interpreter.parser("LABEL A INBOX OUTBOX JUMP A");
				this.manageRun();
			}
		}
	}
};
