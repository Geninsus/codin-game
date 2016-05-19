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
		this.add.sprite(g._WIDTH-134-7,7, 'panel-left');
		this.add.sprite(g._WIDTH-134-7-96,95,'panel-box');
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
		this.stopButton = this.add.button(g._WIDTH/2-200,g._HEIGHT-24 -5, 'button-stop',this.manageStop,this,2,1,3);
		this.pauseButton = this.add.button(g._WIDTH/2-200+48+5, g._HEIGHT-24 -5, 'button-pause', this.managePause, this, 1, 0 ,2);
		this.nextStepButton = this.add.button(g._WIDTH/2-200+2*24+10, g._HEIGHT-24 -5, 'button-nextStep', this.manageNext, this, 2, 1, 3);
		this.playButton = this.add.button(g._WIDTH/2-200+3*24+15, g._HEIGHT-24 -5, 'button-play-speed', this.manageSpeed, this, 1, 0, 2);
		this.speedx2 = this.add.button(g._WIDTH/2-200+4*24+20, g._HEIGHT-24 -5, 'button-play-speed', this.manageSpeedx2, this, 4, 3, 5);
		this.speedx4 = this.add.button(g._WIDTH/2-200+5*24+25, g._HEIGHT-24 -5, 'button-play-speed', this.manageSpeedx4, this, 7, 6, 8);
		this.pauseButton.anchor.set(1,0);
		this.pauseButton.input.useHandCursor = true;
	},
	settingUpRules:function() {
		var style = { font: "10px Arial", fill: "#000000", align: "left"};

		this.rulesMask = this.add.graphics(0, 0);
		this.rulesMask.inputEnabled = true;
		this.rulesMask.beginFill(0xffffff);
		this.rulesMask.drawRect(g._WIDTH-134, 30, 120, 50);
		this.rulesText = this.add.text(g._WIDTH-134,30,data.levels[this._currentLevel-1].wording,style);
		this.rulesText.mask = this.rulesMask;
		this.rulesText.wordWrapWidth = 120;
		this.rulesText.wordWrap = true;
	},
	settingUpCommands: function() {
		this.commandsMask = this.add.graphics(0, 0);
		this.commandsMask.inputEnabled = true;
		this.commandsMask.beginFill(0xffffff);
		this.commandsMask.alpha=0;
		this.commandsMask.drawRect(g._WIDTH-134-7, 90, 134, 260);
		this.commands = data.levels[this._currentLevel-1].commands;

		/*Blocks*/
		this.scroolBar = 0;
		this.commandsSprite = [];
		for (var i = 0 ; i < this.commands.length ; i++) {
			var box = this.add.sprite(g._WIDTH-134-96,i*25+110,this.commands[i]);
			box.inputEnabled = true;
			box.input.enableDrag();
			box.events.onDragStart.add(this.onDragStart, this,0);
			box.events.onDragStop.add(this.onDragStop, this,0);
		}
	},
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
				this.add.tween(this.commandsSprite[i]).to({y:'+25'}, 500, "Back.easeOut", true);
			}
			box.events.onDragStart.removeAll();
			box.events.onDragStop.removeAll();

			box.events.onDragStart.add(this.onDragStartRight, this,0);
			box.events.onDragStop.add(this.onDragStopRight, this,0);
			box.mask = this.commandsMask;
			this.add.tween(box).to({x:g._WIDTH-134,y:(this.commandsSprite.length>1)?this.commandsSprite[index-1].y+25:100}, 500, "Back.easeOut", true);
		}
		else {
			box.destroy();
		}
	},
	startLevel: function() {
		levelNumber = this._currentLevel;
		verfifNumber = 1000;
		data.levels[levelNumber-1].inputsGenerator();
		var inputs = [];
		for (var i = 0 ; i < data.inputs.length; i++) {
			var item = Object.create(Item);
			item.init(this, data.inputs[i], true);
			inputs.push(item);
		}
		Interpreter.init(true, this);
		Inputs.init(inputs,this);
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
		Inputs.update();
		Player.update();
		if (Interpreter.isRunning === true) {
			this.manageNext();
		}

		if (this.input.mouse.wheelDelta != 0 && this.rulesMask.input.checkPointerOver(this.input.mousePointer) == true) {
			this.rulesWheel(this.input.mouse.wheelDelta);
		}
		if (this.input.mouse.wheelDelta != 0 && this.commandsMask.input.checkPointerOver(this.input.mousePointer) == true) {
			this.commandsWheel(this.input.mouse.wheelDelta);
		}

		this.input.mouse.wheelDelta = 0;
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
		if (this.commandsSprite.length > 0) {		
			
			if(direction == -1 && this.commandsSprite[this.commandsSprite.length-1].y > 325) {
				this.commandsSprite.forEach(function(elt){elt.y-=20;});
				this.scroolBar -= 20; 
			}
			
			if(direction == 1 && this.commandsSprite[0].y < 90) {
				this.commandsSprite.forEach(function(elt){elt.y+=20;});
				this.scroolBar += 20;
			}

			for (var i = 0 ; i < this.commandsSprite.length ; i++) {
				this.add.tween(this.commandsSprite[i]).to({y : i*25+90+this.scroolBar}, 500, "Back.easeOut", true)
			}
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
