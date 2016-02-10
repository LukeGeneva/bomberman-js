'use strict';

var InputMessenger = function(game) {
	var self = this;

	this.moveBomber = new Phaser.Signal();
	this.stopBomber = new Phaser.Signal();
	this.dropBomb = new Phaser.Signal();

	var cursors = game.input.keyboard.createCursorKeys();
	var bombKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

	this.dispatch = function() {
		var hasDirectionalInput = false;
		if (cursors.right.isDown) {
			self.moveBomber.dispatch(this, 'east');
			hasDirectionalInput = true;
		}
		if (cursors.left.isDown) {
			self.moveBomber.dispatch(this, 'west');
			hasDirectionalInput = true;
		}
		if (cursors.up.isDown) {
			self.moveBomber.dispatch(this, 'north');
			hasDirectionalInput = true;
		}
		if (cursors.down.isDown) {
			self.moveBomber.dispatch(this, 'south');
			hasDirectionalInput = true;
		}
		if (!hasDirectionalInput) {
			self.stopBomber.dispatch(this);
		}

		if (bombKey.isDown) {
			self.dropBomb.dispatch(this);
		}
	};
};
