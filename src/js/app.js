window.onload = function() {
  var game = new Phaser.Game(1024, 768, Phaser.AUTO, 'gameContainer');
  game.state.add('Boot', g.Boot);
  game.state.add('Preloader', g.Preloader);
  game.state.add('MainMenu', g.MainMenu);
  game.state.add('Game', g.Game);
  game.state.start('Boot');
};
