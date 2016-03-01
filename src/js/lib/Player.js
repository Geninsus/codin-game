
Player = function (game) {

    //  We call the Phaser.Sprite passing in the game reference
    //  We're giving it a random X/Y position here, just for the sake of this demo - you could also pass the x/y in the constructor
    Phaser.Sprite.call(this, game, game.world.randomX, game.world.randomY, 'player',18);
    this.animations.add('up', [0,1,2,3,4,5,6,7,8], 5, true);
    this.animations.add('down', [18,19,20,21,22,23,24,25,26], 5, true);
    this.animations.add('left', [9,10,11,12,13,14,15,16,17], 5, true);
    this.animations.add('right', [27,28,29,30,31,32,33,34,35], 5, true);
    game.physics.enable(this, Phaser.Physics.ARCADE);
    game.add.existing(this);

    
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {

	this.body.velocity.set(0);
	
    if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
    {
        this.play('left');
        this.body.velocity.x = -100;
    }
    else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
    {
        this.play('right');
        this.body.velocity.x = +100;
    }
    else if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP))
    {
        this.play('up');
        this.body.velocity.y = -100;
    }
    else if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
    {
        this.play('down');
        this.body.velocity.y = +100;
    }
    else {
    	this.animations.stop(null,true);
    }

};

Player.prototype.moveTo = function(xTarget,yTarget) {
	this.game.add.tween(this).to({ x: xTarget, y: yTarget }, this.velocity, Phaser.Easing.Linear.None, true);
}