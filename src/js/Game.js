g.Game = function(game) {};
g.Game.prototype = {
	levelNumber : null,
	simulationNumber : 100,
	localSimulationNumber : 0,
	create: function() {
		this.add.sprite(0, 0, 'screen-bg');
		this.add.sprite(g._WIDTH-160,0, 'panel-left');

		this.playSpeedButton = this.add.button(g._WIDTH/2-200+2*24+10, g._HEIGHT-24 -5, 'button-play-speed', this.manageSpeed, this, 1, 0, 2);
		this.nextStepButton = this.add.button(g._WIDTH/2-200+24+5, g._HEIGHT-24 -5, 'button-nextStep', this.manageNext, this, 2, 1, 3);
		this.stopButton = this.add.button(g._WIDTH/2 -200,g._HEIGHT-24 -5, 'button-stop',this.manageStop,this,2,1,3);
		this.pauseButton = this.add.button(g._WIDTH-8, 8, 'button-pause', this.managePause, this);
		this.pauseButton.anchor.set(1,0);
		this.pauseButton.input.useHandCursor = true;
		this.audioButton = this.add.button(g._WIDTH-this.pauseButton.width-8*2, 8, 'button-audio', this.manageAudio, this);
		this.audioButton.anchor.set(1,0);
		this.audioButton.input.useHandCursor = true;
		this.audioButton.animations.add('true', [0], 10, true);
		this.audioButton.animations.add('false', [1], 10, true);
		this.audioButton.animations.play(this.audioStatus);




		/*Groups initialisation*/
		this.itemsGroup = this.add.group();
		this.playerGroup = this.add.group();

		/*Initialisation Player*/
		Player.init(this);

		this.nextButton = this.add.button(g._WIDTH-(this.pauseButton.width)*2-8*2,this.pauseButton.height + 8*2, 'button-navigation', this.manageRun, this);
		this.previousButton = this.add.button(g._WIDTH-this.pauseButton.width-8,this.pauseButton.height + 8*2, 'button-navigation', this.manageNext, this);
		this.previousButton.frame = 1;

		var style = { font: "20px Arial", fill: "#ff0044", align: "center"};
		this.currentCommand = this.add.text(40,25,"Command : ",style);

		this.startLevel();
		this.add.sprite(680-180-115, 62, 'inc');
		this.add.sprite(680-180-115, 62+21, 'dec');
		this.add.sprite(680-180-115, 62+2*21, 'sub');
		this.add.sprite(680-180-115, 62+3*21, 'add');
		this.add.sprite(680-180-115, 62+4*21, 'jump');
		this.add.sprite(680-180-115, 62+5*21, 'jumpz');
		this.add.sprite(680-180-115, 62+6*21, 'jumpn');
		this.add.sprite(680-180-115, 62+7*21, 'outbox');
		this.add.sprite(680-180-115, 62+8*21, 'inbox');
		this.add.sprite(680-180-115, 62+9*21, 'copyto');
		this.add.sprite(680-180-115, 62+10*21, 'copyfrom');


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
		if (Player.spriteTween == null) {
			Interpreter.next();
		}
	},
	manageRun: function() {
		if (Player.spriteTween == null) {
				Interpreter.run();
				this.manageSpeed;
		}
	},
	manageStop: function(){

	},
	manageSpeed: function() {
		if (Player.spriteTween == null) {
				Interpreter.run();
		}
		var currentFrame = Math.trunc(this.playSpeedButton.frame/3);
		this.playSpeedButton.setFrames((currentFrame+1)*3,(currentFrame+1)*3+1,(currentFrame+1)*3+2);
		Interpreter.speed = Math.pow(2,currentFrame+1)%15;
		console.log(Interpreter.speed);
	},
	manageAudio: function() {
		this.audioStatus =! this.audioStatus;
		this.audioButton.animations.play(this.audioStatus);
	},
	update: function() {
		if (Interpreter.isRunning == true) {
			this.manageNext();
		}
		/*Temporaire*/
		if (Player.sprite.children.length > 1) {
			alert("STOP");
		}
	},
	render: function() {
	},
	checkWin : function(i, that) {
		if(Outputs.outputs[i].value != data.outputs[i]) {
			alert('La sortie vaut ' + Outputs.outputs[i].value + ' alors qu\'elle devrait valoir ' + data.outputs[i]);
		} else {
			if(Outputs.outputs.length == data.outputs.length) {
				console.log('C\'est bon ! Passons aux simulations.');
				this.simulate(that)
			}
		}
	},
	simulate : function(that) {
		//var numSimulation = 100;
		//for(var simulationNum = 0; simulationNum < numSimulation; simulationNum++) {
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
			Interpreter.init(false,that);
			Inputs.init(inputs);
			Outputs.init();
			Memory.init(data.levels[levelNumber-1].memory);
			Interpreter.parser("LABEL A INBOX OUTBOX JUMP A");

			while(Interpreter.i < Interpreter.codes.length) {
	  		Interpreter.next();
			}
			//console.log('Simulation numéro ' + (simulationNum + 1));
	//	}
	},
	checkWinExpress : function(i, game) {
		if(Outputs.outputs[i].value != data.outputs[i]) {
			alert('Erreur lors de la simulation ' + i + '.');
		} else {
			if(Outputs.outputs.length == data.outputs.length) {
				this.localSimulationNumber++;
				if(this.localSimulationNumber > this.simulationNumber) {
					alert('GAGNE!');
					game.state.start('LevelMenu');
					PLAYER_DATA[this._levelNumber] = 3;
					window.localStorage.setItem('mygame_progress', JSON.stringify(PLAYER_DATA));
				} else {
					console.log('Simulation numéro ' + (this.localSimulationNumber));
					this.simulate(game);
				}
			}
		}
	}
};
