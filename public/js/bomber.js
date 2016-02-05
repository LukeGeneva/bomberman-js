"use strict";

var Bomber = function(game) {
	Phaser.Sprite.call(this, game, 0, 0, 'bomber');
	game.add.existing(this);

	this.animations.add('walk-north', ['n2.png', 'n1.png', 'n3.png', 'n1.png']);
	this.animations.add('walk-south', ['s2.png', 's1.png', 's3.png', 's1.png']);
	this.animations.add('walk-east', ['e2.png', 'e1.png', 'e3.png', 'e1.png']);
	this.animations.add('walk-west', ['w2.png', 'w1.png', 'w3.png', 'w1.png']);
	this.heading = "";
};

Bomber.prototype = Object.create(Phaser.Sprite.prototype);
Bomber.prototype.constructor = Bomber;

Bomber.prototype.update = function() {
	var previousHeading = this.heading;
	if (this.body.velocity.x > 0) {
		this.heading = "east";
	}
	else if (this.body.velocity.x < 0) {
		this.heading = "west";
	}
	else if (this.body.velocity.y > 0) {
		this.heading = "south";
	}
	else if (this.body.velocity.y < 0) {
		this.heading = "north";
	}
	else {
		this.animations.stop();
		if (this.heading !== "") {
			this.animations.frameName = this.heading[0] + '1.png';
		}
		this.heading = "";
	}

	if (this.heading !== previousHeading && this.heading !== "") {
		this.animations.play('walk-' + this.heading, 6, true);
	}
};