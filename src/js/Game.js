g.Game = function(game) {};
g.Game.prototype = {
	levelNumber : null,
	simulationNumber : 100,
	localSimulationNumber : 0,
	create: function() {

		/*Setting Up*/
		this.settingUpScene();
		this.settingUpAudio();
		this.settingUpControl();
		this.settingUpRules();
		this.settingUpCommands();

		/*Initialisation Player*/
		Player.init(this);

		this.startLevel();

	},
	settingUpScene: function() {
		this.add.sprite(0, 0, 'screen-bg');
		this.add.sprite(g._WIDTH-115-7,7, 'panel-left');
		this.add.sprite(g._WIDTH-115-7-114,95,'panel-box');
	},
	settingUpAudio: function() {
		// No Sound for Now
		/*
		this.audioButton = this.add.button(0, 0, 'button-audio', this.manageAudio, this);
		this.audioButton.input.useHandCursor = true;
		this.audioButton.animations.add('true', [0], 10, true);
		this.audioButton.animations.add('false', [1], 10, true);
		this.audioButton.animations.play(this.audioStatus);
		*/
	},
	settingUpControl: function() {
		this.stopButton = this.add.button(g._WIDTH/2-150,g._HEIGHT-26, 'button-stop',this.manageStop,this,2,1,3);
		this.pauseButton = this.add.button(g._WIDTH/2-150+48+5, g._HEIGHT-26, 'button-pause', this.managePause, this, 1, 0 ,2);
		this.homeButton = this.add.button(g._WIDTH/2-200-73,g._HEIGHT-29,'button-home',this.manageHome,this,0,0,1);
		this.nextStepButton = this.add.button(g._WIDTH/2-150+2*24+10, g._HEIGHT-26, 'button-nextStep', this.manageNext, this, 2, 1, 3);
		this.playButton = this.add.button(g._WIDTH/2-150+3*24+15, g._HEIGHT-26, 'button-play-speed', this.manageSpeed, this, 1, 0, 2);
		//this.speedx2 = this.add.button(g._WIDTH/2-200+4*24+20, g._HEIGHT-26, 'button-play-speed', this.manageSpeedx2, this, 4, 3, 5);
		//this.speedx4 = this.add.button(g._WIDTH/2-200+5*24+25, g._HEIGHT-26, 'button-play-speed', this.manageSpeedx4, this, 7, 6, 8);
		this.pauseButton.anchor.set(1,0);
		this.pauseButton.input.useHandCursor = true;
	},
	settingUpRules:function() {
		var style = { font: "10px Arial", fill: "#000000", align: "left"};

		this.rulesMask = this.add.graphics(0, 0);
		this.rulesMask.inputEnabled = true;
		this.rulesMask.beginFill(0xffffff);
		this.rulesMask.drawRect(g._WIDTH-116, 28, 104, 56);
		this.rulesText = this.add.text(g._WIDTH-116,30,data.levels[this._currentLevel-1].wording,style);
		this.rulesText.lineSpacing = - 8; 
		this.rulesText.mask = this.rulesMask;
		this.rulesText.wordWrapWidth = 105;
		this.rulesText.wordWrap = true;
	},
	settingUpCommands: function() {

		this.codeHaveChange = false;
		this.input.onDown.add(function(){if (this.error) this.error.destroy();},this);
		this.commandsMask = this.add.graphics(0, 0);
		this.commandsMask.inputEnabled = true;
		this.commandsMask.beginFill(0xffffff);
		this.commandsMask.alpha=0;
		this.commandsMask.drawRect(g._WIDTH-115-7, 90, 115, 260);
		this.commandsAvailable = data.levels[this._currentLevel-1].commands;
		this.commandsMark = this.add.sprite(g._WIDTH-115,0,'mark');
		this.commandsMark.mask = this.commandsMask;

		/*Blocks*/
		this.scroolBar = 0;
		this.previousCommands = "";
		this.commands = [];
		this.nbLoop = 0;
		for (var i = 0 ; i < this.commandsAvailable.length ; i++) {
			var command = Object.create(Command);
			command.init(this,this.commandsAvailable[i], new Phaser.Point(g._WIDTH-115-115-2,i*24+100));
		}
	},
	startLevel: function() {
		levelNumber = this._currentLevel;
		verfifNumber = 1000;
		data.levels[levelNumber-1].inputsGenerator();

		/*Initialisation Memory Sprites*/
		for (var i = 0 ; i < data.levels[levelNumber-1].memory.length; i ++) {
			var mySprite = this.add.sprite(Memory.position(i).x-16,Memory.position(i).y-16,'item');
			var style = { font: "8px Arial"};
			var num = this.add.text(24,1,i.toString(),style);
			mySprite.addChild(num);
		}

		var inputs = [];
		for (var i = 0 ; i < data.inputs.length; i++) {
			var item = Object.create(Item);
			item.init(this, data.inputs[i], true);
			inputs.push(item);
		}

		/*Interpreter Init*/
		Interpreter.init(true, this);
		this.setParser();

		/* Inputs & Outputs & Memort Init*/
		Inputs.init(inputs,this);
		Outputs.init(this);
		Memory.init(data.levels[levelNumber-1].memory);

	},
	setParser: function() {
		var codes = ""
		for (var i = 0 ; i < this.commands.length ; i++) {
			codes += this.commands[i].key.toUpperCase()+" ";
		}
		Interpreter.parser(codes);
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
		if ((Player.sprite.animations.currentAnim.name == 'idleLeft' || Player.sprite.animations.currentAnim.name == 'idleRight') &&
		 	(Player.drone.sprite.animations.frame == 0 || Player.drone.sprite.animations.frame == 18 || Player.drone.sprite.animations.frame == 19 || Player.drone.sprite.animations.frame == 37) &&
		 	(Player.drone.item == null || Player.drone.item.game != undefined)) {
			if (this.codeHaveChange) {
				this.manageStop();
				this.setParser();
				this.codeHaveChange = false;
			}
			Interpreter.next();

			/*
			var codes = ""
			for (var i = 0 ; i < this.commands.length ; i++) {
				codes += this.commands[i].key.toUpperCase()+" ";
			}
			Interpreter.parser(codes);

			if (this.previousCommands != codes) {
				Interpreter.init(true, this);
				Interpreter.parser(codes);
			}
			Interpreter.next();
			this.previousCommands = codes;
			console.log(Interpreter.codes);
			*/
		}
	},
	manageRun: function() {
		Interpreter.run();
	},
	manageStop: function(){
		this.codeHaveChange = false;

		Inputs.restart();
		Outputs.restart();
		this.startLevel();
		Player.restart();
	},
	manageHome: function(){
		this.game.state.start('LevelMenu');
	},
	manageSpeed: function() {
		if (Player.spriteTween == null) {
				Interpreter.run();
		}
		Interpreter.speed = 1;
	},
	manageSpeedx2: function() {
		if (Player.spriteTween == null) {
				Interpreter.run();
		}
		Interpreter.speed = 3;
	},
	manageSpeedx4: function() {
		if (Player.spriteTween == null) {
				Interpreter.run();
		}
		Interpreter.speed = 4;
	},
	manageAudio: function() {
		this.audioStatus =! this.audioStatus;
		this.audioButton.animations.play(this.audioStatus);
	},
	manageHome: function() {
		this.state.start('LevelMenu');
	},
	update: function() {
		Inputs.update();
		Player.update();
		this.commands.forEach(function(elt) {elt.update()});
		if (Interpreter.isRunning) {
			this.manageNext();
		}

		if (this.input.mouse.wheelDelta != 0 && this.rulesMask.input.checkPointerOver(this.input.mousePointer) == true) {
			this.rulesWheel(this.input.mouse.wheelDelta);
		}
		if (this.input.mouse.wheelDelta != 0 && this.commandsMask.input.checkPointerOver(this.input.mousePointer) == true) {
			this.commandsWheel(this.input.mouse.wheelDelta);
		}
		this.input.mouse.wheelDelta = 0;
			console.log(Player.sprite.animations.currentAnim.name);

	},
	rulesWheel:function(direction) {
		if(direction == -1 && this.rulesText.y > 30 - this.rulesText.height + 50) {
			this.rulesText.y -= 10;
		}
		if(direction == 1 && this.rulesText.y != 30) {
			this.rulesText.y += 10;
		}
	},
	commandsWheel:function(direction) {
		if (this.commands.length > 0) {

			if(direction == -1 && this.commands[this.commands.length-1].sprite.y > 325) {
				this.commands.forEach(function(elt){elt.sprite.y-=20;});
				this.scroolBar -= 20;
			}

			if(direction == 1 && this.commands[0].sprite.y < 90) {
				this.commands.forEach(function(elt){elt.sprite.y+=20; console.log(elt.key);});
				this.scroolBar += 20;
			}

			for (var i = 0 ; i < this.commands.length ; i++) {
				this.add.tween(this.commands[i].sprite).to({y : i*25+90+this.scroolBar}, 500, "Back.easeOut", true)
			}
		}
	},
	render: function() {
	},
	winWindow: function(game) {
		game.add.text(g._WIDTH*0.5-100, 250, "Win !");
		game.input.onDown.add(game.manageHome,game);
		PLAYER_DATA[levelNumber-1] = 3;
		if(PLAYER_DATA[levelNumber] == -1) PLAYER_DATA[levelNumber] = 0;
		window.localStorage.setItem('mygame_progress', JSON.stringify(PLAYER_DATA));
	},
	checkWin : function(i, that) {
		if(Outputs.outputs[i].value != data.outputs[i]) {
			error('La sortie vaut ' + Outputs.outputs[i].value + ' alors qu\'elle devrait valoir ' + data.outputs[i]);
		} else {
			if(Outputs.outputs.length == data.outputs.length) {
				//console.log('C\'est bon ! Passons aux simulations.');
				//this.simulate(that);
				//Pas de simu
				this.winWindow(that);
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
