
BasicGame.Game = function (game) {

	//	When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:
	/*
    this.game;		    //	a reference to the currently running game
    this.add;		    //	used to add sprites, text, groups, etc
    this.camera;	    //	a reference to the game camera
    this.cache;		    //	the game cache
    this.input;		    //	the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load;		    //	for preloading assets
    this.math;		    //	lots of useful common math operations
    this.sound;		    //	the sound manager - add a sound, play one, set-up markers, etc
    this.stage;		    //	the game stage
    this.time;		    //	the clock
    this.tweens;        //  the tween manager
    this.state;	        //	the state manager
    this.world;		    //	the game world
    this.particles;	    //	the particle manager
    this.physics;	    //	the physics manager
    this.rnd;		    //	the repeatable random number generator
    */
    //	You can use any of these from any function within this State.
    //	But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.

};

var DEBUG = 0;

BasicGame.Game.prototype = {
	create: function () {
		var style = { font: "30px Arial", fill: "#ffffff", align: "center" };
		this.game.add.text(20, 20, "Inputs", style);
		this.game.add.text(150, 20, "Hand", style);
		this.game.add.text(this.game.width-200,20,"Outputs", style);
		this.game.add.text(this.game.world.centerX, 20, "Memory", style);
		Interpreter.init(this);
		Inputs.init(this,"5 6 7".split(/\s+/));
		Outputs.init(this,[]);
		Interpreter.codes = ["INBOX","OUTBOX","INBOX","OUTBOX","INBOX","OUTBOX"];
		
		this.player = this.game.add.sprite(200, 200, 'player', 18);
		this.player.animations.add('up',[0,1,2,3,4,5,6,7,8], 5, true);
		this.player.animations.add('left',[9,10,11,12,13,14,15,16,17], 5, true);
		this.player.animations.add('down',[18,19,20,21,22,23,24,25,26], 5, true);
		this.player.animations.add('right',[27,28,29,30,31,32,33,34,35], 5, true);
		this.game.physics.enable(this.player, Phaser.Physics.ARCADE);

		this.itemsInput = [];
		this.itemsOutput = [];
		this.itemsHand = null;
		this.itemsMemory = [];
		this.add.button(this.game.width-100,this.game.height-100,'nextButton', Interpreter.next);

		for (var i = 0 ; i < Inputs.inputs.length ; i++) {
			this.itemsInput.push(this.game.add.sprite(20, (i+1)*75, 'item'));
			text = this.game.add.text(0, 0, Inputs.inputs[i].toString(), style);
			this.itemsInput[i].addChild(text);
		}
	},

	update: function () {
		//	Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
		//this.items[0].anchor.x += 0.001;
	},

	quitGame: function (pointer) {

		//	Here you should destroy anything you no longer need.
		//	Stop music, delete sprites, purge caches, free resources, all that good stuff.

		//	Then let's go back to the main menu.
	}

};
