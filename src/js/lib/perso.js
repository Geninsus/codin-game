var spriteInfo = { 
	input:{
		x:0,
		y:300,
	},
	output:{
		x:300,
		y:800
	},
	memory: {
		size:{
			width:500,
			height:500
		},
		position:{
			x:100,
			y:100
		}
	},
	hutMemory:{
		size:{
			width:50,
			height:50
		}
	}
};

var Perso = function(){};
/* Constructor of perso with coordinate and the sprite of the perso */ 
function Perso(sprite){
	this.x = sprite.x;
	this.y = sprite.y;
	this.sprite = sprite;
	console.log("New perso created at x : " + this.x + " and y : " + this.y + " position.");
}
/* Return the X position of the sprite */
Perso.prototype.getX = function(){
	return this.x;
}
/* Return the Y position of the sprite */
Perso.prototype.getY = function(){
	return this.y;
}
/* Move to a specific location x and y */ 
Perso.prototype.moveTo = function(xTarget,yTarget){
	game.add.tween(this.sprite).to({ x: xTarget, y: yTarget }, this.velocity, Phaser.Easing.Linear.None, true);
}
/* Move to input location */
Perso.prototype.intput = function(){
	game.add.tween(this.sprite).to({ x: coordSpriteOf.input.x, y: coordSpriteOf.input.y }, this.velocity, Phaser.Easing.Linear.None, true);
}
/* Move to output location */
Perso.prototype.output = function(){
	game.add.tween(this.sprite).to({ x: coordSpriteOf.output.x, y: coordSpriteOf.output.y-sprite.height }, this.velocity, Phaser.Easing.Linear.None, true);
}
/* Move to a specific hut memory */
Perso.prototype.memory = function(ind){
	var coordHut = coordOfHut(ind);
	game.add.tween(this.sprite).to({ x: coordHut.x-sprite.width/2 + spriteInfo.hutMemory.width/2, y: coordHut.y - sprite.height + spriteInfo.hutMemory.height/2}, this.velocity, Phaser.Easing.Linear.None, true);
}
/* Return the velocity of the sprite */
Perso.prototype.getVelocity = function(){
	return this.velocity;
}
/* Set the velocity of ther perso */
Perso.prototype.setVelocity = function(velValue){
	if(velValue > 0){
		this.velocity = velValue;
	}else{
		console.log("Negative number of velocity");
	}
}
/* Give the coordinate for the number of memory hut given */
function coordOfHut(hutNumber){
	var coordHut = {x:spriteInfo.memory.position.x,y:spriteInfo.memory.position.y};
	var numberOfHutInWidth = spriteInfo.memory.size.width/spriteInfo.hutMemory.width;
	var numberOfHutInHeight = spriteInfo.memory.size.height/spriteInfo.hutMemory.height;
	if (hutNumber<numberOfHutInWidth) {
		coordHut.x += hutNumber*spriteInfo.hutMemory.width;
	}else{
		while(hutNumber>=numberOfHutInWidth){
			hutNumber-=numberOfHutInWidth;
			coordHut.y+=spriteInfo.hutMemory.height;
		}
		coordHut.x += hutNumber*numberOfHutInWidth;
	}
	return coordHut;
}
