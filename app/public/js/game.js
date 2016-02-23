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

	var map;
	var fixedTileLayer;

	var player;
	var bomberGroup;
	var bombGroup;

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
		map = game.add.tilemap('tilemap');
		map.addTilesetImage('tiles');
		initMapLayers();
		map.setCollision(1, true, 'Fixed');
	}

	function initMapLayers() {
		map.createLayer('Base');
		fixedTileLayer = map.createLayer('Fixed');
		fixedTileLayer.resizeWorld();
	}

	function initGroups() {
		bombGroup = game.add.group();
		bomberGroup = game.add.group();
	}

	function initPlayer() {
		player = new Bomber(game);
		player.x = 24;
		player.y = 24;
		bomberGroup.add(player);
	}

	function initInputHandlers() {
		inputHandler = new InputHandler(game);
		inputHandler.moveBomber.add(handleMoveRequest);
		inputHandler.stopBomber.add(handleStopRequest);
		inputHandler.dropBomb.add(handleBombDropRequest);
	}

	function update() {
		runCollisions();

		bombGroup.forEach(function(bomb) {
			bomb.body.immovable = bomb.body.immovable || !game.physics.arcade.overlap(bomb.body, bomberGroup);
		});

		inputHandler.dispatch();
	}

	function runCollisions() {
		game.physics.arcade.collide(bomberGroup, fixedTileLayer);
		game.physics.arcade.collide(bomberGroup, bombGroup);
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
            destinationTile = map.getTileAbove(map.getLayer(fixedTileLayer), playerTile.x, playerTile.y);
        }
        else if (player.body.blocked.down) {
            destinationTile = map.getTileBelow(map.getLayer(fixedTileLayer), playerTile.x, playerTile.y);
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
            destinationTile = map.getTileLeft(map.getLayer(fixedTileLayer), playerTile.x, playerTile.y);
        }
        else if (player.body.blocked.right) {
            destinationTile = map.getTileRight(map.getLayer(fixedTileLayer), playerTile.x, playerTile.y);
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
        return map.getTileWorldXY(player.body.center.x, player.body.center.y);
    }

	function handleStopRequest() {
		player.body.velocity.x = 0;
		player.body.velocity.y = 0;
	}

	function handleBombDropRequest() {
		var bombTile = map.getTileWorldXY(player.body.center.x, player.body.center.y);
        if (getPlayerActiveBombCount() < player.bombCapacity && !tileHasBomb(bombTile)) {
            var bomb = player.createBomb();
            centerBombInTile(bomb, bombTile);
            bombGroup.add(bomb);
            bomb.startFuse();
        }
	}

    function getPlayerActiveBombCount() {
        var count = 0;
        bombGroup.forEach(function(bomb) {
            if (bomb.bomber === player) {
                ++count;
            }
        });
        return count;
    }

	function tileHasBomb(tile) {
        var bombHasTile = false;
		bombGroup.forEach(function(bomb) {
            var bombTile = map.getTileWorldXY(bomb.x, bomb.y);
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
