var game = new Phaser.Game(800, 600, Phaser.AUTO, 'Bomberman JS', { preload: preload, create: create, update: update });

function preload() {
	game.load.atlas('sprites', '../assets/spritesheet.png', '../assets/spritesheet.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
	game.load.tilemap('tilemap', '../assets/tilemap.json', null, Phaser.Tilemap.TILED_JSON);
	game.load.image('tiles', '../assets/tiles.png');
}

var map;
var fixedLayer;
var player;
var bombers;
var bombs;

var inputMessenger;

function create() {
	inputMessenger = new InputMessenger(game);
	game.physics.startSystem(Phaser.Physics.ARCADE);

	map = game.add.tilemap('tilemap');
	map.addTilesetImage('tiles');

	map.createLayer('Base');
	fixedLayer = map.createLayer('Fixed');
	fixedLayer.resizeWorld();

	map.setCollision(1, true, 'Fixed');

	bombers = game.add.group();
	bombs = game.add.group();

	player = new Bomber(game);
	bombers.add(player);

	inputMessenger.moveBomber.add(handleMoveRequest, this);
	inputMessenger.stopBomber.add(handleStopRequest, this);
	inputMessenger.dropBomb.add(handleBombDropRequest, this);
}

function update() {
	game.physics.arcade.collide(bombers, fixedLayer);
	game.physics.arcade.collide(bombers, bombs);

	inputMessenger.dispatch();
}

function handleMoveRequest(sender, direction) {
	player.body.velocity.x = 0;
	player.body.velocity.y = 0;

	switch (direction) {
		case 'north':
			player.body.velocity.y = -player.speed;
			break;
		case 'south':
			player.body.velocity.y = player.speed;
			break;
		case 'east':
			player.body.velocity.x = player.speed;
			break;
		case 'west':
			player.body.velocity.x = -player.speed;
			break;
	}
}

function handleStopRequest(sender) {
	player.body.velocity.x = 0;
	player.body.velocity.y = 0;
}

function handleBombDropRequest(sender) {
	var bombX = Math.floor(player.body.center.x / 16) * 16 + 8;
	var bombY = Math.floor(player.body.center.y / 16) * 16 + 8;
	var bomb = player.dropBomb();
	bombs.add(bomb);
	bomb.x = bombX;
	bomb.y = bombY;
	bomb.startFuse();
}