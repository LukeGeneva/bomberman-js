"use strict";

var Bomb = function(game) {
	var self = this;
	var ticking = false;
	var fuseStartTime = 0;

	this.fuseExpired = new Phaser.Signal();

	var construct = function() {
		Phaser.Sprite.call(self, game, 0, 0, 'sprites');
		game.add.existing(self);
		game.physics.enable(self);
		self.body.setSize(16, 16);
		self.anchor.setTo(0.5, 0.5);
		self.fuseTime = 3000;
		self.explosionRadius = 1;
		self.animations.add('tick', ['bomb1', 'bomb2', 'bomb3', 'bomb2']);
	};

	this._update = function() {
		if (ticking) {
			advanceFuse();
		}
	};

	var advanceFuse = function() {
		var endTime = fuseStartTime + self.fuseTime;
		var done = Date.now() >= endTime;
		if (done) {
			ticking = false;
			self.fuseExpired.dispatch();
		}
	};

	this._startFuse = function() {
		fuseStartTime = Date.now();
		this.animations.play('tick', 3, true);
		ticking = true;
	};

	construct();
};

Bomb.prototype = Object.create(Phaser.Sprite.prototype);
Bomb.prototype.constructor = Bomb;

Bomb.prototype.update = function() {
	this._update();
};

Bomb.prototype.startFuse = function() {
	this._startFuse();
};