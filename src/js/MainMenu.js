g.MainMenu = function(game) {};
g.MainMenu.prototype = {
	create: function() {
		this.time = 0;
		this.add.sprite(0, 0, 'sky-mainmenu');
		//this.clouds = this.add.sprite(-360,10,'clouds-mainmenu');
		this.clouds1 = this.add.sprite(-360,10,'clouds-1');
		this.clouds2 = this.add.sprite(-360+300,10,'clouds-2');
		this.clouds3 = this.add.sprite(-360+300*2,10,'clouds-3');
		this.clouds4 = this.add.sprite(-360+300*3,10,'clouds-4');

		this.add.sprite(0,0,'building-mainmenu');
		this.plane = this.add.sprite(641,10,'plane');
		this.gameTitle = this.add.sprite(320,93, 'title');
		this.gameTitle.anchor.set(0.5,0);
		this.begin = this.add.text(g._WIDTH*0.5-140, 250, "Click anywhere to start !", {font: "30px Arial", fill: "#ffffff"});
		// button to "read the article"
	},
	update:    function(){
		if(this.plane.x <=-700){
			this.plane.x = 641;
		}
		this.plane.x--;
		if (this.clouds1.x>=641) {
			this.clouds1.x=-250;
		}
		if (this.clouds2.x>=641) {
			this.clouds2.x=-250;
		}
		if (this.clouds3.x>=641) {
			this.clouds3.x=-250;
		}
		if (this.clouds4.x>=641) {
			this.clouds4.x=-250;
		}
		this.time++;
		if(this.time>1000){
			this.time = 0;
		}
		if(this.time%5 == 0){
			this.clouds1.x++;
			this.clouds2.x++;
			this.clouds3.x++;
			this.clouds4.x++;

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