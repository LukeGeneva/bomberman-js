"use strict";

var Bomb = function(game, fuseTimeInMilliseconds) {
	Phaser.Sprite.call(this, game, 0, 0, 'sprites');
	game.add.existing(this);

	this.fuseTime = fuseTimeInMilliseconds;
	this.animations.frameName = 'bomb1';
};

Bomb.prototype = Object.create(Phaser.Sprite.prototype);
Bomb.prototype.constructor = Bomb;

Bomb.prototype.update = function() {
	if (this.fuseStartTime) {
		var endTime = this.fuseStartTime + this.fuseTime;
		var pctDone = (endTime - Date.now()) / parseFloat(this.fuseTime);
		if (pctDone > 0.6) {
			this.animations.frameName = 'bomb1';
		}
		else if (pctDone > 0.3) {
			this.animations.frameName = 'bomb2';
		}
		else if (pctDone > 0) {
			this.animations.frameName = 'bomb3';
		}
		else {
			this.destroy();
		}
	}
};

Bomb.prototype.startFuse = function() {
	this.fuseStartTime = Date.now();
};