/*globals Bomber, InputHandler */

(function() {
	'use strict';

	var game = new Phaser.Game(
		240, 208,
		Phaser.AUTO,
		'game',
        { preload: preload, create: create, update: update });

	function preload() {
		game.load.atlas(
			'sprites',
			'../assets/spritesheet.png',
			'../assets/spritesheet.json',
			Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);

		game.load.tilemap(
			'tilemap',
			'../assets/tilemap.json',
			null,
			Phaser.Tilemap.TILED_JSON);

		game.load.image('tiles', '../assets/tiles.png');
        game.stage.smoothed = false;
        game.scale.setMinMax(480, 416);
        game.scale.refresh();
	}

	var player;

	var inputHandler;

	function create() {
		initPhysics();
		initMap();
		initGroups();
		initPlayer();
		initInputHandlers();
	}

	function initPhysics() {
		game.physics.startSystem(Phaser.Physics.ARCADE);
	}

	function initMap() {
		game.map = game.add.tilemap('tilemap');
		game.map.addTilesetImage('tiles');
		initMapLayers();
		game.map.setCollision(1, true, 'Fixed');
	}

	function initMapLayers() {
		game.map.createLayer('Base');
		game.map.fixedTileLayer = game.map.createLayer('Fixed');
		game.map.fixedTileLayer.resizeWorld();
	}

	function initGroups() {
        game.groups = {};
		game.groups.bombs = game.add.group();
        game.groups.explosions = game.add.group();
		game.groups.bombers = game.add.group();
	}

	function initPlayer() {
		player = new Bomber(game);
		player.x = 24;
		player.y = 24;
		game.groups.bombers.add(player);
	}

	function initInputHandlers() {
		inputHandler = new InputHandler(game);
		inputHandler.moveBomber.add(handleMoveRequest);
		inputHandler.stopBomber.add(handleStopRequest);
		inputHandler.dropBomb.add(handleBombDropRequest);
	}

	function update() {
		runCollisions();

		game.groups.bombs.forEach(function(bomb) {
			bomb.body.immovable = bomb.body.immovable || !game.physics.arcade.overlap(bomb.body, game.groups.bombers);
		});

		inputHandler.dispatch();
	}

	function runCollisions() {
		game.physics.arcade.collide(game.groups.bombers, game.map.fixedTileLayer);
		game.physics.arcade.collide(game.groups.bombers, game.groups.bombs);
        game.physics.arcade.overlap(game.groups.bombers, game.groups.explosions, function(bomber) {
            bomber.die();
        });
	}

	function handleMoveRequest(direction) {
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

    function calculateHelperXVelocity() {
        var playerTile = getPlayerTile();
        var destinationTile;
        if (player.body.blocked.up) {
            destinationTile = game.map.getTileAbove(game.map.getLayer(game.map.fixedTileLayer), playerTile.x, playerTile.y);
        }
        else if (player.body.blocked.down) {
            destinationTile = game.map.getTileBelow(game.map.getLayer(game.map.fixedTileLayer), playerTile.x, playerTile.y);
        }
        else {
            return 0;
        }

        if (destinationTile.index !== -1) {
            return 0;
        }

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
        var playerTile = getPlayerTile();
        var destinationTile;
        if (player.body.blocked.left) {
            destinationTile = game.map.getTileLeft(game.map.getLayer(game.map.fixedTileLayer), playerTile.x, playerTile.y);
        }
        else if (player.body.blocked.right) {
            destinationTile = game.map.getTileRight(game.map.getLayer(game.map.fixedTileLayer), playerTile.x, playerTile.y);
        }
        else {
            return 0;
        }

        if (destinationTile.index !== -1) {
            return 0;
        }

        var playerTileCenter = playerTile.top + playerTile.height / 2;
        var helperThreshold = 8;
        var offset = playerTileCenter - player.body.center.y;
        var absoluteOffset = Math.abs(offset);
        if (absoluteOffset === 0 || absoluteOffset > helperThreshold) {
            return 0;
        }
        return offset > 0 ? player.speed : -player.speed;
    }

    function getPlayerTile() {
        return game.map.getTileWorldXY(player.body.center.x, player.body.center.y);
    }

	function handleStopRequest() {
		player.body.velocity.x = 0;
		player.body.velocity.y = 0;
	}

	function handleBombDropRequest() {
		var bombTile = game.map.getTileWorldXY(player.body.center.x, player.body.center.y);
        if (getPlayerActiveBombCount() < player.bombCapacity && !tileHasBomb(bombTile)) {
            var bomb = player.dropBomb();
            centerBombInTile(bomb, bombTile);
            game.groups.bombs.add(bomb);
            bomb.startFuse();
        }
	}

    function getPlayerActiveBombCount() {
        var count = 0;
        game.groups.bombs.forEach(function(bomb) {
            if (bomb.bomber === player) {
                ++count;
            }
        });
        return count;
    }

	function tileHasBomb(tile) {
        var bombHasTile = false;
		game.groups.bombs.forEach(function(bomb) {
            var bombTile = game.map.getTileWorldXY(bomb.x, bomb.y);
            if (bombTile.x === tile.x && bombTile.y === tile.y) {
                bombHasTile = true;
            }
		});
		return bombHasTile;
	}

	function centerBombInTile(bomb, tile) {
        var center = getTileWorldCenter(tile);
		bomb.x = center.x;
		bomb.y = center.y;
	}

    function getTileWorldCenter(tile) {
        var x = tile.worldX + tile.centerX;
        var y = tile.worldY + tile.centerY;
        return new Phaser.Point(x, y);
    }

})();
