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
		initInputHandler();
	}

	function initPhysics() {
		game.physics.startSystem(Phaser.Physics.ARCADE);
	}

	function initMap() {
		game.map = game.add.tilemap('tilemap');
		game.map.addTilesetImage('tiles');
		initMapLayers();
		game.map.setCollision(1, true, 'Fixed');
		game.map.setCollision(3, true, 'Breakable');
        extendMapFunctions();
	}

	function initMapLayers() {
		game.map.baseTileLayer = game.map.createLayer('Base');
		game.map.fixedTileLayer = game.map.createLayer('Fixed');
        game.map.breakableTileLayer = game.map.createLayer('Breakable');
		game.map.fixedTileLayer.resizeWorld();
	}

    function extendMapFunctions() {
        var mapExtender = new MapExtender();
        mapExtender.extend(game);
    }

	function initGroups() {
        game.groups = {};
		game.groups.bombs = game.add.group();
        game.groups.explosions = game.add.group();
		game.groups.bombers = game.add.group();
	}

	function initPlayer() {
        var spawner = new Spawner(game);
        player = spawner.spawn();
	}

	function initInputHandler() {
        game.inputQueue = [];
		inputHandler = new InputHandler(game);
	}

	function update() {
        processInput();
		runCollisions();
	}

    function processInput() {
		inputHandler.handle();
        player.processInput();
    }

	function runCollisions() {
		game.physics.arcade.collide(game.groups.bombers, game.map.fixedTileLayer);
		game.physics.arcade.collide(game.groups.bombers, game.map.breakableTileLayer);
		game.physics.arcade.collide(game.groups.bombers, game.groups.bombs);
        game.physics.arcade.overlap(game.groups.bombers, game.groups.explosions, function(bomber) {
            bomber.die();
        });
        game.physics.arcade.overlap(game.groups.bombs, game.groups.explosions, function(bomb) {
            bomb.explode();
        });
	}

})();
