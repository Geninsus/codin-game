g.Preloader = function(game) {};
g.Preloader.prototype = {
	preload: function() {
		this.preloadBg = this.add.sprite((g._WIDTH-297)*0.5, (g._HEIGHT-145)*0.5, 'preloaderBg');
		this.preloadBar = this.add.sprite((g._WIDTH-158)*0.5, (g._HEIGHT-50)*0.5, 'preloaderBar');
		this.load.setPreloadSprite(this.preloadBar);

		this.load.image('starfield', 'assets/img/deep-space.jpg');
		
		this.load.image('ball', 'assets/img/ball.png');
		this.load.image('item', 'assets/img/item.png');
		this.load.image('hole', 'assets/img/hole.png');
		this.load.image('element-w', 'assets/img/element-w.png');
		this.load.image('element-h', 'assets/img/element-h.png');
		this.load.image('panel', 'assets/img/panel.png');
		this.load.image('panel-left', 'assets/img/panel-left.png');
		this.load.image('title', 'assets/img/title.png');
		this.load.image('button-pause', 'assets/img/button-pause.png');
		this.load.image('screen-bg', 'assets/img/screen-bg.png');
		this.load.image('screen-mainmenu', 'assets/img/screen-mainmenu.png');
		this.load.image('screen-howtoplay', 'assets/img/screen-howtoplay.png');
		this.load.image('border-horizontal', 'assets/img/border-horizontal.png');
		this.load.image('border-vertical', 'assets/img/border-vertical.png');
		this.load.image('add', 'assets/buttons/button-add.png');
		this.load.image('copyfrom', 'assets/buttons/button-copyfrom.png');
		this.load.image('copyto', 'assets/buttons/button-copyto.png');
		this.load.image('dec', 'assets/buttons/button-dec.png');
		this.load.image('inbox', 'assets/buttons/button-inbox.png');
		this.load.image('inc', 'assets/buttons/button-inc.png');
		this.load.image('jump', 'assets/buttons/button-jump.png');
		this.load.image('jumpn', 'assets/buttons/button-jumpn.png');
		this.load.image('jumpz', 'assets/buttons/button-jumpz.png');
		this.load.image('outbox', 'assets/buttons/button-outbox.png');
		this.load.image('sub', 'assets/buttons/button-sub.png');
		this.load.spritesheet('button-audio', 'assets/img/button-audio.png', 35, 35);
		this.load.spritesheet('button-navigation', 'assets/img/button-navigation.png', 35, 35);
		this.load.spritesheet('button-start', 'assets/img/button-start.png', 146, 51);
		this.load.spritesheet('player', 'assets/img/player.png', 32, 50);

		this.load.spritesheet('levelSelection', 'assets/img/levelSelection.png', 96, 96);
		this.load.bitmapFont('font72', 'assets/font/font72.png', 'assets/font/font72.xml');
	},
	create: function() {
		this.game.state.start('MainMenu');
	}
};