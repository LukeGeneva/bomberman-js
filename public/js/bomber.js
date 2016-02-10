'use strict';

var Bomber = function(game) {
	Phaser.Sprite.call(this, game, 32, 32, 'sprites');
	game.add.existing(this);
	game.physics.enable(this);
	this.anchor.setTo(0.5, 0.5);
	this.body.collideWorldBounds = true;
	this.body.setSize(13, 10, 0, 8);

	this.animations.add('walk-north', ['n2', 'n1', 'n3', 'n1']);
	this.animations.add('walk-south', ['s2', 's1', 's3', 's1']);
	this.animations.add('walk-east', ['e2', 'e1', 'e3', 'e1']);
	this.animations.add('walk-west', ['w2', 'w1', 'w3', 'w1']);
	this.animations.add('die', ['die1', 'die2', 'die3', 'die4', 'die5', 'die6', 'die7', 'die8']);
	this.animations.frameName = 's1';

	this.heading = 'south';
	this.bombRadius = 1;
	this.alive = true;
	this.speed = 80;
};

Bomber.prototype = Object.create(Phaser.Sprite.prototype);
Bomber.prototype.constructor = Bomber;

Bomber.prototype.update = function() {
	var self = this;
	var isMoving = function() {
		return self.body.velocity.x !== 0 || self.body.velocity.y !== 0;
	}

	if (!this.alive) return;

	if (this.body.velocity.x > 0) {
		this.heading = 'east';
	}
	else if (this.body.velocity.x < 0) {
		this.heading = 'west';
	}
	else if (this.body.velocity.y > 0) {
		this.heading = 'south';
	}
	else if (this.body.velocity.y < 0) {
		this.heading = 'north';
	}
	else {
		this.animations.stop();
		this.animations.frameName = this.heading[0] + '1';
	}

	if (isMoving() && !this.animations.isPlaying) {
		this.animations.play('walk-' + this.heading, 6, true);
	}
};

Bomber.prototype.die = function() {
	if (this.alive) {
		this.alive = false;
		this.animations.play('die', 10, false, true);
	}
};

Bomber.prototype.dropBomb = function() {
	var bomb = new Bomb(this.game, 3000, this.bombRadius);
	return bomb;
};
