
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
		console.log(this._currentLevel)
		// INITIALIZE INTERPRETER //
		Interpreter.init();
		Interpreter.codes = ["INBOX","OUTBOX","INBOX","OUTBOX","INBOX","OUTBOX"];
		Memory.init(this.game,[undefined,undefined,undefined]);
		Inputs.init(this.game,[5,6,9,7]);
		Outputs.init(this.game,[undefined,undefined,undefined,undefined]);


		// INITIALIZE PLAYER //
		this.player = this.game.add.sprite(0, 0, 'player', 18);
		//this.player.scale.setTo((this.game.height/12)/this.player.width,(this.game.height/12)/this.player.width);
		this.player.animations.add('up',[0,1,2,3,4,5,6,7,8], 5, true);
		this.player.animations.add('left',[9,10,11,12,13,14,15,16,17], 5, true);
		this.player.animations.add('down',[18,19,20,21,22,23,24,25,26], 5, true);
		this.player.animations.add('right',[27,28,29,30,31,32,33,34,35], 5, true);


	},

	update: function () {
		//	Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!

	},

	quitGame: function (pointer) {

		//	Here you should destroy anything you no longer need.
		//	Stop music, delete sprites, purge caches, free resources, all that good stuff.

		//	Then let's go back to the main menu.
	},

};
