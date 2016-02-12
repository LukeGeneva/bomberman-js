'use strict';

var Bomber = function(game) {
    this._applyPhysics = function() {
        this.game.physics.enable(this);
        this.body.collideWorldBounds = true;
        this.body.setSize(13, 8, 0, 6);
    };

    this._applyAnimations = function() {
        this.animations.add('walk-north', ['n2', 'n1', 'n3', 'n1']);
        this.animations.add('walk-south', ['s2', 's1', 's3', 's1']);
        this.animations.add('walk-east', ['e2', 'e1', 'e3', 'e1']);
        this.animations.add('walk-west', ['w2', 'w1', 'w3', 'w1']);
        this.animations.add('die', ['die1', 'die2', 'die3', 'die4', 'die5', 'die6', 'die7', 'die8']);
    };

    this._applyDefaults = function() {
        this.anchor.setTo(0.5, 0.5);
        this.heading = 'south';
        this.bombRadius = 1;
        this.alive = true;
        this.speed = 80;
        this.animations.frameName = 's1';
    };

    this._autoSetHeading = function() {
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
    };

    this._isMoving = function() {
        return this.body.velocity.x !== 0 || this.body.velocity.y !== 0;
    };

    this._playOrContinueWalkingAnimation = function() {
        if (!this.animations.isPlaying) {
            var animationName = this._getNextWalkingAnimationName();
            this.animations.play(animationName, 6, true);
        }
    };

    this._getNextWalkingAnimationName = function() {
        return 'walk-' + this.heading;
    };

    this._showDefaultWalkingFrame = function() {
        this.animations.frameName = this.heading[0] + '1';
    };

    Phaser.Sprite.call(this, game, 0, 0, 'sprites');
    game.add.existing(this);
    this._applyPhysics();
    this._applyAnimations();
    this._applyDefaults();
};

Bomber.prototype = Object.create(Phaser.Sprite.prototype);
Bomber.prototype.constructor = Bomber;

Bomber.prototype.update = function() {
    if (this.alive) {
        this._autoSetHeading();
        if (this._isMoving()) {
            this._playOrContinueWalkingAnimation();
        }
        else {
            this.animations.stop();
            this._showDefaultWalkingFrame();
        }
    }
};

Bomber.prototype.dropBomb = function() {
    return new Bomb(this.game, 3000, this.bombRadius);
};
