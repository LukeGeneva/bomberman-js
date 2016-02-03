var game = new Phaser.Game(800, 600, Phaser.AUTO, 'Bomberman JS', { preload: preload, create: create, update: update });

function preload() {

}

var testSprite;

function create() {
	// bitmap data to represent test player
	var bmd = game.add.bitmapData(30, 30);
	bmd.ctx.beginPath();
	bmd.ctx.rect(0,0,30,30);
	bmd.ctx.fillStyle = '#ff0000';
	bmd.ctx.fill();

	testSprite = game.add.sprite(200, 200, bmd);
}

var testSpeed = 4;

function update() {
	if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
		testSprite.x -= testSpeed;
	}
	else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
		testSprite.x += testSpeed;
	}
	else if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
		testSprite.y -= testSpeed;
	}
	else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
		testSprite.y += testSpeed;
	}
}
