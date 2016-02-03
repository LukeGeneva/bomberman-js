var game = new Phaser.Game(800, 600, Phaser.AUTO, 'Bomberman JS', { preload: preload, create: create, update: update });

function preload() {
	game.load.atlas('test', '../assets/spritesheet.png', '../assets/spritesheet.json',
		Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
}

var cursors;
var player;

function create() {
	player = game.add.sprite(300, 200, 'test');
	player.animations.add('walk-north', ['n1.png', 'n2.png', 'n1.png', 'n3.png']);
	player.animations.add('walk-south', ['s1.png', 's2.png', 's1.png', 's3.png']);
	player.animations.add('walk-east', ['e1.png', 'e2.png', 'e1.png', 'e3.png']);
	player.animations.add('walk-west', ['w1.png', 'w2.png', 'w1.png', 'w3.png']);

	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.physics.enable(player, Phaser.Physics.ARCADE);

	cursors = game.input.keyboard.createCursorKeys();
}

var testSpeed = 100;

function update() {
	player.body.velocity.x = 0;
	player.body.velocity.y = 0;
	
	if (cursors.left.isDown) {
		player.body.velocity.x = -testSpeed;
		player.animations.play('walk-west', 6, true);
	}
	else if (cursors.right.isDown) {
		player.body.velocity.x = testSpeed;
		player.animations.play('walk-east', 6, true);
	}
	else if (cursors.up.isDown) {
		player.body.velocity.y = -testSpeed;
		player.animations.play('walk-north', 6, true);
	}
	else if (cursors.down.isDown) {
		player.body.velocity.y = testSpeed;
		player.animations.play('walk-south', 6, true);
	}
	else {
		player.animations.stop();
	}
}
