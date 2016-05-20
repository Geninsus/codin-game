g.MainMenu = function(game) {};
g.MainMenu.prototype = {
	create: function() {
		this.add.sprite(0, 0, 'screen-mainmenu');
		this.gameTitle = this.add.sprite(-250,153, 'title');
		this.gameTitle.anchor.set(0.5,0);
		this.plane = this.add.sprite(641,10,'plane');
		tween1 = this.add.tween(this.plane).to( { x:-500}, 7000, Phaser.Easing.Linear.None, true);
		tween = this.add.tween(this.gameTitle).to( { x:320,y: 93 }, 2500, Phaser.Easing.Linear.None, true);
		this.startButton = this.add.button(g._WIDTH*0.5, 200, 'button-start', this.startGame, this, 2, 0, 1);
		this.startButton.input.useHandCursor = true;

		// button to "read the article"
	},
	startGame: function() {
		this.game.state.start('LevelMenu');
	},
};