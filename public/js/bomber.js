"use strict";

var Bomber = function(game) {
	Phaser.Sprite.call(this, game, 0, 0, 'bomber');
	game.add.existing(this);

	this.animations.add('walk-north', ['n2', 'n1', 'n3', 'n1']);
	this.animations.add('walk-south', ['s2', 's1', 's3', 's1']);
	this.animations.add('walk-east', ['e2', 'e1', 'e3', 'e1']);
	this.animations.add('walk-west', ['w2', 'w1', 'w3', 'w1']);
	this.animations.add('die', ['die1', 'die2', 'die3', 'die4', 'die5', 'die6', 'die7', 'die8']);
	this.animations.frameName = 's1';

	this.heading = "";
	this.alive = true;
};

Bomber.prototype = Object.create(Phaser.Sprite.prototype);
Bomber.prototype.constructor = Bomber;

Bomber.prototype.update = function() {
	if (!this.alive) return;

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
			this.animations.frameName = this.heading[0] + '1';
		}
		this.heading = "";
	}

	if (this.heading !== previousHeading && this.heading !== "") {
		this.animations.play('walk-' + this.heading, 6, true);
	}
};

Bomber.prototype.die = function() {
	if (this.alive) {
		this.alive = false;
		this.animations.play('die', 10, false, true);
	}
};
