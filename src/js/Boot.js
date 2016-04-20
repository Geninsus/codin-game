var g = {
    _WIDTH: 640,
    _HEIGHT: 360
};
g.Boot = function(game) {};
g.Boot.prototype = {
    preload: function() {
        this.load.image('preloaderBg', 'assets/img/loading-bg.png');
        this.load.image('preloaderBar', 'assets/img/loading-bar.png');
    },
    create: function() {
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
        this.game.state.start('Preloader');
    }
};