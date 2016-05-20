g.MainMenu = function(game) {};
g.MainMenu.prototype = {
	create: function() {
		this.time = 0;
		this.add.sprite(0, 0, 'sky-mainmenu');
		this.clouds = this.add.sprite(-100,10,'clouds-mainmenu');
		this.add.sprite(0,0,'building-mainmenu');
		this.plane = this.add.sprite(641,10,'plane');
		this.gameTitle = this.add.sprite(320,93, 'title');
		this.gameTitle.anchor.set(0.5,0);
		this.begin = this.add.text(g._WIDTH*0.5-100, 250, "Click anywhere to start !", this.fontMessage);
		// button to "read the article"
	},
	update:    function(){
		if(this.plane.x <=-400){
			this.plane.x = 641;
		}
		this.plane.x--;
		if (this.clouds.x>=641) {
			this.clouds.x=-641;
		}
		this.time++;
		if(this.time%5 == 0){
			this.clouds.x++;
		}
		if(this.time%60 >= 30){
			this.begin.visible = false;
		}else{
			this.begin.visible = true;
		}
		this.input.onDown.add(this.startGame,this);
	},
	startGame: function() {
		this.game.state.start('LevelMenu');
	},
};