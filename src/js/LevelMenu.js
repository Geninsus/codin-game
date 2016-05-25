var PLAYER_DATA = null; // just declare as global variable for now

var ICON_BY_LINE = 4;

g.LevelMenu = function(game){
	// define needed variables for mygame.LevelSelect
	this.game = game;
	this.holdicons = [];
};

g.LevelMenu.prototype = {

	preload: function() {
		this.initProgressData();
	},

	create: function() {
    this.bg = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'starfield');
    this.timer = 0;
		this.createLevelIcons();
		this.animateLevelIcons();
		this.rect = this.add.graphics(0,0);
		this.rect.beginFill(0x828282);
		this.rect.drawRect(359,179,1,1)
	},

	update: function() {
		this.timer++;
		if(this.timer%20 >= 010){
			this.rect.visible = false;
		}else{
			this.rect.visible = true;
		}
	},

	render: function() {
		// display some debug info..?
	},

	initProgressData: function() {

		// array might be undefined at first time start up
		if (!PLAYER_DATA) {
			// retrieve from local storage (to view in Chrome, Ctrl+Shift+J -> Resources -> Local Storage)
			var str = window.localStorage.getItem('mygame_progress');

			// error checking, localstorage might not exist yet at first time start up
			try {
				PLAYER_DATA = JSON.parse(str);
			} catch(e){
				PLAYER_DATA = []; //error in the above string(in this case,yes)!
			}
			// error checking just to be sure, if localstorage contains something else then a JSON array (hackers?)
			if (Object.prototype.toString.call( PLAYER_DATA ) !== '[object Array]' ) {
				PLAYER_DATA = [];
			}
		}
	},

	createLevelIcons: function() {
		var levelnr = 0;
		var inconNb = data.levels.length;
		var i = 0;
		mask = this.add.graphics(0,0);
		mask.beginFill(0xffffff);
		mask.drawRect(451,24,127,160);
		for (var y=0; y < Math.ceil(inconNb/ICON_BY_LINE) ; y++) {
			for (var x=0; x < ICON_BY_LINE; x++) {
				if(i>=inconNb) break;
				i++;
				// next level
				levelnr = levelnr + 1;

				// check if array not yet initialised
				if (typeof PLAYER_DATA[levelnr-1] !== 'number') {
					// value is null or undefined, i.e. array not defined or too short between app upgrades with more levels
					if (levelnr == 1) {
						PLAYER_DATA[levelnr-1] = 0; // level 1 should never be locked
					} else {
						PLAYER_DATA[levelnr-1] = -1;
					}
				}

				// player progress info for this level
				var playdata = PLAYER_DATA[levelnr-1];

				// decide which icon
				var isLocked = true; // locked
				var stars = 0; // no stars

				// check if level is unlocked
				if (playdata > -1) {
					isLocked = false; // unlocked
					if (playdata < 4) {stars = playdata;} // 0..3 stars
				}

				// calculate position on screen
				var xpos = 453 + (x*31);
				var ypos = 50 + (y*31);

				// create icon
				this.holdicons[levelnr-1] = this.createLevelIcon(xpos, ypos, levelnr, isLocked, stars, mask);
				var backicon = this.holdicons[levelnr-1].getAt(0);

				// keep level nr, used in onclick method
				backicon.health = levelnr;

				// input handler
				backicon.inputEnabled = true;
				backicon.events.onInputDown.add(this.onSpriteDown, this);
			}
		}
	},

	// -------------------------------------
	// Add level icon buttons
	// -------------------------------------
	createLevelIcon: function(xpos, ypos, levelnr, isLocked, stars, mask) {

		// create new group
		var IconGroup = this.game.add.group();
		IconGroup.x = xpos;
		IconGroup.y = ypos;

		// keep original position, for restoring after certain tweens
		IconGroup.xOrg = xpos;
		IconGroup.yOrg = ypos;

		// determine background frame
		var frame = 0;
		if (isLocked === false) {frame = 1;}

		// add background
		var icon1 = this.game.add.sprite(0, 0, 'levelSelection', frame);
		icon1.mask = mask;
		IconGroup.add(icon1);
		var style = { font: "21px Arial", fill: "#ffffff", align: "center"};

		// add stars, if needed
		if (isLocked === false) {
			var txt = this.game.add.text(9, 4,''+levelnr, style);
			txt.mask = mask;
			//var icon2 = this.game.add.sprite(0, 0, 'levelSelection', (2+stars));

			IconGroup.add(txt);
			//IconGroup.add(icon2);
		}

		return IconGroup;
	},

	onSpriteDown: function(sprite, pointer) {

		// retrieve the iconlevel
		var levelnr = sprite.health;

		if (PLAYER_DATA[levelnr-1] < 0) {
			// indicate it's locked by shaking left/right
			var IconGroup = this.holdicons[levelnr-1];
			var xpos = IconGroup.xOrg;

			var tween = this.game.add.tween(IconGroup)
				.to({ x: xpos+6 }, 20, Phaser.Easing.Linear.None)
				.to({ x: xpos-5 }, 20, Phaser.Easing.Linear.None)
				.to({ x: xpos+4 }, 20, Phaser.Easing.Linear.None)
				.to({ x: xpos-3 }, 20, Phaser.Easing.Linear.None)
				.to({ x: xpos+2 }, 20, Phaser.Easing.Linear.None)
				.to({ x: xpos }, 20, Phaser.Easing.Linear.None)
				.start();
		} else {
			// simulate button press animation to indicate selection
			var IconGroup = this.holdicons[levelnr-1];
			var tween = this.game.add.tween(IconGroup.scale)
				.to({ x: 0.9, y: 0.9}, 100, Phaser.Easing.Linear.None)
				.to({ x: 1.0, y: 1.0}, 100, Phaser.Easing.Linear.None)
				.start();

			// it's a little tricky to pass selected levelnr to callback function, but this works:
			tween.onComplete.add(function(){this.onLevelSelected(sprite.health);}, this);
			//this.onLevelSelected(1);


		}
	},

	animateLevelIcons: function() {

		// slide all icons into screen
		for (var i=0; i < this.holdicons.length; i++) {
			// get variables
			var IconGroup = this.holdicons[i];
			IconGroup.y = IconGroup.y + 400;
			var y = IconGroup.y;

			// tween animation
			this.game.add.tween(IconGroup).to( {y: y-417}, 500, Phaser.Easing.Linear.None, true, (i*40));
		}
	},

	onLevelSelected: function(levelnr) {
		// pass levelnr variable to 'Game' state

		this.game.state.states._levelNumber = levelnr;
		this.game.state.states.Game._currentLevel = levelnr;
		this.state.start('Game');

	}
};
