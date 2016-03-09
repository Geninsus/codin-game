
BasicGame.Preloader = function (game) {

	this.background = null;
	this.preloadBar = null;

	this.ready = false;

};

BasicGame.Preloader.prototype = {

	preload: function () {

		//	These are the assets we loaded in Boot.js
		//	A nice sparkly background and a loading progress bar

		this.background = this.add.sprite(0, 0, 'preloaderBackground');
		this.preloadBar = this.add.sprite(300, 400, 'preloaderBar');

		//	This sets the preloadBar sprite as a loader sprite.
		//	What that does is automatically crop the sprite from 0 to full-width
		//	as the files below are loaded in.

		this.load.setPreloadSprite(this.preloadBar);

		//	Here we load the rest of the assets our game needs.
		//	You can find all of these assets in the Phaser Examples repository

	    this.load.image('tetris1', 'assets/img/tetrisblock1.png');
	    this.load.image('tetris2', 'assets/img/tetrisblock2.png');
	    this.load.image('tetris3', 'assets/img/tetrisblock3.png');
	    this.load.image('hotdog', 'assets/img/hotdog.png');
	    this.load.image('starfield', 'assets/img/deep-space.jpg');
	    this.load.image('startButton', 'assets/img/start_button.png');
			this.load.image('nextButton', 'assets/img/next_button.png');

	    this.load.spritesheet('player', 'assets/img/playerSheet.png', 64, 64);

			this.load.spritesheet('levelSelection', 'assets/img/levelSelection.png', 96, 96);
			this.load.bitmapFont('font72', 'assets/font/font72.png', 'assets/font/font72.xml');

	},

	create: function () {

		this.state.start('MainMenu');

	}

};
