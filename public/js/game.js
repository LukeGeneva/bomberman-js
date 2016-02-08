var game = new Phaser.Game(800, 600, Phaser.AUTO, 'Bomberman JS', { preload: preload, create: create, update: update });

function preload() {
	game.load.atlas('sprites', '../assets/spritesheet.png', '../assets/spritesheet.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
	game.load.tilemap('tilemap', '../assets/tilemap.json', null, Phaser.Tilemap.TILED_JSON);
	game.load.image('tiles', '../assets/tiles.png');
}

var cursors;
var map;
var layer;
var player;
var bombs;

function create() {
	game.physics.startSystem(Phaser.Physics.ARCADE);

	map = game.add.tilemap('tilemap');
	map.addTilesetImage('tiles');

	baseLayer = map.createLayer('Base');
	fixedLayer = map.createLayer('Fixed');
	fixedLayer.resizeWorld();

	map.setCollision(1, true, 'Fixed');

	player = new Bomber(game);

	bombs = game.add.group();

	cursors = game.input.keyboard.createCursorKeys();
	game.input.keyboard.addKeyCapture(Phaser.Keyboard.SPACEBAR);

	var placeBombKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
	placeBombKey.onDown.add(function(key) {
		if (player.alive) {
			var bomb = player.placeBomb();
			bombs.add(bomb);
			bomb.startFuse();
		}
	});
}

var testSpeed = 100;

function update() {
	game.physics.arcade.collide(player, fixedLayer);

	player.body.velocity.x = 0;
	player.body.velocity.y = 0;
	
	if (player.alive) {
		if (cursors.left.isDown) {
			player.body.velocity.x = -testSpeed;
		}
		else if (cursors.right.isDown) {
			player.body.velocity.x = testSpeed;
		}
		else if (cursors.up.isDown) {
			player.body.velocity.y = -testSpeed;
		}
		else if (cursors.down.isDown) {
			player.body.velocity.y = testSpeed;
		}
	}

	if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
		player.die();
	}
}
