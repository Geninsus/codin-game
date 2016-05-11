g.Game = function(game) {};
g.Game.prototype = {
	levelNumber : null,
	simulationNumber : 100,
	localSimulationNumber : 0,
	create: function() {
		this.add.sprite(0, 0, 'screen-bg');
		this.add.sprite(g._WIDTH-160,0, 'panel-left');
		this.stopButton = this.add.button(g._WIDTH/2-200,g._HEIGHT-24 -5, 'button-stop',this.manageStop,this,2,1,3);
		this.pauseButton = this.add.button(g._WIDTH/2-200+48+5, g._HEIGHT-24 -5, 'button-pause', this.managePause, this, 1, 0 ,2);
		this.nextStepButton = this.add.button(g._WIDTH/2-200+2*24+10, g._HEIGHT-24 -5, 'button-nextStep', this.manageNext, this, 2, 1, 3);
		this.playButton = this.add.button(g._WIDTH/2-200+3*24+15, g._HEIGHT-24 -5, 'button-play-speed', this.manageSpeed, this, 1, 0, 2);
		this.speedx2 = this.add.button(g._WIDTH/2-200+4*24+20, g._HEIGHT-24 -5, 'button-play-speed', this.manageSpeedx2, this, 4, 3, 5);
		this.speedx4 = this.add.button(g._WIDTH/2-200+5*24+25, g._HEIGHT-24 -5, 'button-play-speed', this.manageSpeedx4, this, 7, 6, 8);
		this.pauseButton.anchor.set(1,0);
		this.pauseButton.input.useHandCursor = true;
		this.audioButton = this.add.button(g._WIDTH-this.pauseButton.width-8*2, 8, 'button-audio', this.manageAudio, this);
		this.audioButton.anchor.set(1,0);
		this.audioButton.input.useHandCursor = true;
		this.audioButton.animations.add('true', [0], 10, true);
		this.audioButton.animations.add('false', [1], 10, true);
		this.audioButton.animations.play(this.audioStatus);

		this.rulesMask = this.add.graphics(0, 0);
		this.rulesMask.inputEnabled = true;
		this.rulesMask.beginFill(0xffffff);
		this.rulesMask.drawRect(g._WIDTH-320, 0, 160, 100);


		/*Groups initialisation*/
		this.itemsGroup = this.add.group();
		this.playerGroup = this.add.group();

		/*Initialisation Player*/
		Player.init(this);

		var style = { font: "20px Arial", fill: "#ff0044", align: "center"};
		this.currentCommand = this.add.text(40,25,"Command : ",style);

		this.startLevel();

		for(var i = 0; i < data.levels[this._currentLevel-1].commands.length; i++) {
			this.add.sprite(680-180-115, 104+21*i, data.levels[this._currentLevel-1].commands[i]);
		}


	},
	startLevel: function() {
		levelNumber = this._currentLevel;
		var style = { font: "16px Arial", fill: "#ff0044", align: "center"};
		this.rulesText = this.add.text(g._WIDTH-320+10,10,data.levels[levelNumber-1].wording,style);
		this.rulesText.mask = this.rulesMask;
		this.rulesText.align = "left";
		this.rulesText.wordWrapWidth = 140;
		this.rulesText.wordWrap = true;
		verfifNumber = 1000;
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
		if (Player.spriteTween === null) {
			Interpreter.next();
		}
	},
	manageRun: function() {
		if (Player.spriteTween === null) {
				Interpreter.run();
				this.manageSpeed(1);
		}
	},
	manageStop: function(){

	},
	manageSpeed: function() {
		if (Player.spriteTween == null) {
				Interpreter.run();
		}
		var currentFrame = Math.trunc(this.playButton.frame/3);
		this.playSpeedButton.setFrames((currentFrame+1)*3,(currentFrame+1)*3+1,(currentFrame+1)*3+2);
		Interpreter.speed = speed
	},
	manageSpeedx2: function() {
		if (Player.spriteTween == null) {
				Interpreter.run();
		}
		var currentFrame = Math.trunc(this.playButton.frame/3);
		this.playSpeedButton.setFrames((currentFrame+1)*3,(currentFrame+1)*3+1,(currentFrame+1)*3+2);
		Interpreter.speed = speed
	},
	manageSpeedx4: function() {
		if (Player.spriteTween == null) {
				Interpreter.run();
		}
		var currentFrame = Math.trunc(this.playButton.frame/3);
		this.playSpeedButton.setFrames((currentFrame+1)*3,(currentFrame+1)*3+1,(currentFrame+1)*3+2);
		Interpreter.speed = speed
	},
	manageAudio: function() {
		this.audioStatus =! this.audioStatus;
		this.audioButton.animations.play(this.audioStatus);
	},
	update: function() {
		if (Interpreter.isRunning === true) {
			this.manageNext();
		}
		/*Temporaire*/
		if (Player.sprite.children.length > 1) {
			alert("STOP");
		}

		if (this.input.mouse.wheelDelta != 0 && this.rulesMask.input.checkPointerOver(this.input.mousePointer) == true) {
			this.rulesWheel(this.input.mouse.wheelDelta);
		}
		this.input.mouse.wheelDelta = 0;
	},
	rulesWheel:function(direction) {
		if(direction == -1 && this.rulesText.y != 10) {
			this.rulesText.y += 10;
		}
		if(direction == 1 && this.rulesText.y > 10 - this.rulesText.height + 100 ) {
			this.rulesText.y -= 10;
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
				this.simulate(that);
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
				if(item.sprite !== null) {
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
					PLAYER_DATA[levelNumber-1] = 3;
					if(PLAYER_DATA[levelNumber] == -1) PLAYER_DATA[levelNumber] = 0;
					window.localStorage.setItem('mygame_progress', JSON.stringify(PLAYER_DATA));
				} else {
					this.simulate(game);
				}
			}
		}
	}
};
