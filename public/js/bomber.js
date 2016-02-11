'use strict';

var Bomber;

(function(){
	var self;

	Bomber = function(game) {
		self = this;
		Phaser.Sprite.call(this, game, 0, 0, 'sprites');
		applyPhysics();
		applyAnimations();
		applyDefaults();
	};

	Bomber.prototype = Object.create(Phaser.Sprite.prototype);
	Bomber.prototype.constructor = Bomber;

	var applyPhysics = function() {
		self.game.physics.enable(self);
		self.body.collideWorldBounds = true;
		self.body.setSize(13, 8, 0, 6);
	};

	var applyAnimations = function() {
		self.animations.add('walk-north', ['n2', 'n1', 'n3', 'n1']);
		self.animations.add('walk-south', ['s2', 's1', 's3', 's1']);
		self.animations.add('walk-east', ['e2', 'e1', 'e3', 'e1']);
		self.animations.add('walk-west', ['w2', 'w1', 'w3', 'w1']);
		self.animations.add('die', ['die1', 'die2', 'die3', 'die4', 'die5', 'die6', 'die7', 'die8']);
	};

	var applyDefaults = function() {
		self.anchor.setTo(0.5, 0.5);
		self.heading = 'south';
		self.bombRadius = 1;
		self.alive = true;
		self.speed = 80;
		self.animations.frameName = 's1';
	};

	Bomber.prototype.update = function() {
		if (self.alive) {
			autoSetHeading();
			playCorrectAnimation();
		}
	};

	var autoSetHeading = function() {
		if (self.body.velocity.x > 0) {
			self.heading = 'east';
		}
		else if (self.body.velocity.x < 0) {
			self.heading = 'west';
		}
		else if (self.body.velocity.y > 0) {
			self.heading = 'south';
		}
		else if (self.body.velocity.y < 0) {
			self.heading = 'north';
		}
	};

	var playCorrectAnimation = function() {
		if (isMoving()) {
			playOrContinueWalkingAnimation();
		}
		else {
			self.animations.stop();
			self.animations.frameName = self.heading[0] + '1';
		}
	};

	var isMoving = function() {
		return self.body.velocity.x !== 0 || self.body.velocity.y !== 0;
	};

	var playOrContinueWalkingAnimation = function() {
		if (!self.animations.isPlaying) {
			self.animations.play('walk-' + self.heading, 6, true);
		}
	};

	Bomber.prototype.dropBomb = function() {
		return new Bomb(self.game, 3000, self.bombRadius);
	};
})();
