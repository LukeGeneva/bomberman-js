"use strict";

var Bomber = function(game) {
	Phaser.Sprite.call(this, game, 0, 0, 'bomber');
	game.add.existing(this);

	this.animations.add('walk-north', ['n2.png', 'n1.png', 'n3.png', 'n1.png']);
	this.animations.add('walk-south', ['s2.png', 's1.png', 's3.png', 's1.png']);
	this.animations.add('walk-east', ['e2.png', 'e1.png', 'e3.png', 'e1.png']);
	this.animations.add('walk-west', ['w2.png', 'w1.png', 'w3.png', 'w1.png']);
};

Bomber.prototype = Object.create(Phaser.Sprite.prototype);
Bomber.prototype.constructor = Bomber;