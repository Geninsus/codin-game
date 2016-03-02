
ItemGroup = function (game, inputs) {

    //  We call the Phaser.Sprite passing in the game reference
    //  We're giving it a random X/Y position here, just for the sake of this demo - you could also pass the x/y in the constructor
	Phaser.Group.call(this, game);

	for (var i = 0 ; i < inputs.length ; i++) {
		var sprite = this.create(game.world.randomX, game.world.randomY, 'item');
	}
    
};


ItemGroup.prototype = Object.create(Phaser.Sprite.prototype);
ItemGroup.prototype.constructor = ItemGroup;

ItemGroup.prototype.update = function() {

}