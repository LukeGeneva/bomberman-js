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
			player.body.velocity.x = calculateHelperXVelocity();
			break;
		case 'south':
			player.body.velocity.y = player.speed;
			player.body.velocity.x = calculateHelperXVelocity();
			break;
		case 'east':
			player.body.velocity.x = player.speed;
			player.body.velocity.y = calculateHelperYVelocity();
			break;
		case 'west':
			player.body.velocity.x = -player.speed;
			player.body.velocity.y = calculateHelperYVelocity();
			break;
	}
}

function handleStopRequest(sender) {
	player.body.velocity.x = 0;
	player.body.velocity.y = 0;
}

function handleBombDropRequest(sender) {
	var bombX = Math.floor(player.body.center.x / map.tileWidth) * map.tileWidth + map.tileWidth / 2;
	var bombY = Math.floor(player.body.center.y / map.tileHeight) * map.tileHeight + map.tileHeight / 2;
	var bomb = player.dropBomb();
	bombs.add(bomb);
	bomb.x = bombX;
	bomb.y = bombY;
	bomb.startFuse();
}

function calculateHelperXVelocity() {
	var playerTile = map.getTileWorldXY(player.body.center.x, player.body.center.y);
	var destinationTile;
	if (player.body.blocked.up) {
		destinationTile = map.getTileAbove(map.getLayer(fixedLayer), playerTile.x, playerTile.y);
	}
	else if (player.body.blocked.down) {
		destinationTile = map.getTileBelow(map.getLayer(fixedLayer), playerTile.x, playerTile.y);
	}
	else {
		return 0;
	}

	if (destinationTile.index !== -1) return 0;

	var playerTileCenter = playerTile.left + playerTile.width / 2;
	var helperThreshold = 8;
	var offset = playerTileCenter - player.body.center.x;
	var absoluteOffset = Math.abs(offset);
	if (absoluteOffset === 0 || absoluteOffset > helperThreshold) {
		return 0;
	}
	return offset > 0 ? player.speed : -player.speed;
}

function calculateHelperYVelocity() {
	var playerTile = map.getTileWorldXY(player.body.center.x, player.body.center.y);
	var destinationTile;
	if (player.body.blocked.left) {
		destinationTile = map.getTileLeft(map.getLayer(fixedLayer), playerTile.x, playerTile.y);
	}
	else if (player.body.blocked.right) {
		destinationTile = map.getTileRight(map.getLayer(fixedLayer), playerTile.x, playerTile.y);
	}
	else {
		return 0;
	}

	if (destinationTile.index !== -1) return 0;

	var playerTileCenter = playerTile.top + playerTile.height / 2;
	var helperThreshold = 8;
	var offset = playerTileCenter - player.body.center.y;
	var absoluteOffset = Math.abs(offset);
	if (absoluteOffset === 0 || absoluteOffset > helperThreshold) {
		return 0;
	}
	return offset > 0 ? player.speed : -player.speed;
}
