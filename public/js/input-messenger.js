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
			self.moveBomber.dispatch('east');
			hasDirectionalInput = true;
		}
		if (cursors.left.isDown) {
			self.moveBomber.dispatch('west');
			hasDirectionalInput = true;
		}
		if (cursors.up.isDown) {
			self.moveBomber.dispatch('north');
			hasDirectionalInput = true;
		}
		if (cursors.down.isDown) {
			self.moveBomber.dispatch('south');
			hasDirectionalInput = true;
		}
		if (!hasDirectionalInput) {
			self.stopBomber.dispatch();
		}

		if (bombKey.isDown) {
			self.dropBomb.dispatch();
		}
	};
};
