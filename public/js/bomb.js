"use strict";

var Bomb = function(game, fuseTimeInMilliseconds, explosionRadius) {
	Phaser.Sprite.call(this, game, 0, 0, 'sprites');
	game.add.existing(this);
	game.physics.enable(this);
	this.body.setSize(16, 16);
	this.anchor.setTo(0.5, 0.5);

	this.fuseTime = fuseTimeInMilliseconds;
	this.explosionRadius = explosionRadius;
	this.animations.add('tick', ['bomb1', 'bomb2', 'bomb3', 'bomb2']);
};

Bomb.prototype = Object.create(Phaser.Sprite.prototype);
Bomb.prototype.constructor = Bomb;

Bomb.prototype.update = function() {
	this.body.immovable = this.body.immovable || !game.physics.arcade.overlap(this.body, bombers);

	if (this.fuseStartTime) {
		var endTime = this.fuseStartTime + this.fuseTime;
		var pctDone = (endTime - Date.now()) / parseFloat(this.fuseTime);
		if (pctDone <= 0) {
			this.destroy();
		}
	}
};

Bomb.prototype.startFuse = function() {
	this.fuseStartTime = Date.now();
	this.animations.play('tick', 3, true);
};