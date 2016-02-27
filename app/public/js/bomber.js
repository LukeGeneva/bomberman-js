/*global Bomb */

var Bomber = (function() {
    'use strict';

    function Bomber(game) {
        var self = this;
        var movementHelper = new MovementHelper(game, self);
        var bombCapacity = 3;
        var activeBombs = 0;

        var construct = function () {
            Phaser.Sprite.call(self, game, 0, 0, 'sprites');
            game.add.existing(self);
            game.groups.bombers.add(self);
            applyPhysics();
            applyAnimations();
            applyDefaults();
        };

        var applyPhysics = function () {
            game.physics.enable(self);
            self.body.collideWorldBounds = true;
            self.body.setSize(13, 8, 0, 6);
        };

        var applyAnimations = function () {
            self.animations.add('walk-north', ['n2', 'n1', 'n3', 'n1'], 6, true);
            self.animations.add('walk-south', ['s2', 's1', 's3', 's1'], 6, true);
            self.animations.add('walk-east', ['e2', 'e1', 'e3', 'e1'], 6, true);
            self.animations.add('walk-west', ['w2', 'w1', 'w3', 'w1'], 6, true);
            self.animations.add('die', ['die1', 'die2', 'die3', 'die4', 'die5', 'die6', 'die7', 'die8']);
        };

        var applyDefaults = function () {
            self.anchor.setTo(0.5, 0.5);
            self.heading = 'south';
            self.bombRadius = 2;
            self.alive = true;
            self.speed = 60;
            self.animations.frameName = 's1';
        };

        this._processInput = function() {
            if (self.alive) {
                while (game.inputQueue.length > 0) {
                    var input = game.inputQueue.shift();
                    switch (input) {
                        case 'move-north':
                            self.body.velocity.y = -self.speed;
                            self.body.velocity.x = 0;
                            self.heading = 'north';
                            self.animations.play('walk-north');
                            break;
                        case 'move-south':
                            self.body.velocity.y = self.speed;
                            self.body.velocity.x = 0;
                            self.heading = 'south';
                            self.animations.play('walk-south');
                            break;
                        case 'move-east':
                            self.body.velocity.x = self.speed;
                            self.body.velocity.y = 0;
                            self.heading = 'east';
                            self.animations.play('walk-east');
                            break;
                        case 'move-west':
                            self.body.velocity.x = -self.speed;
                            self.body.velocity.y = 0;
                            self.heading = 'west';
                            self.animations.play('walk-west');
                            break;
                        case 'stop':
                            self.body.velocity.x = 0;
                            self.body.velocity.y = 0;
                            self.animations.stop();
                            showDefaultWalkingFrame();
                            break;
                        case 'drop-bomb':
                            if (canDropBomb()) {
                                dropBomb();
                            }
                            break;
                    }
                }
            }
        };

        var showDefaultWalkingFrame = function () {
            self.animations.frameName = self.heading[0] + '1';
        };

        this._update = function () {
            movementHelper.help();
        };

        var dropBomb = function () {
            var bomb = new Bomb(game);
            bomb.explosionRadius = self.bombRadius;
            bomb.exploded.add(function() {
                activeBombs--;
            });
            activeBombs++;
            var bomberTile = game.map.getSpriteBodyTile(self);
            game.map.centerSpriteInTile(bomb, bomberTile);
        };

        var canDropBomb = function() {
            var bombTile = game.map.getSpriteBodyTile(self);
            return activeBombs < bombCapacity && !game.map.tileHasBomb(bombTile);
        };

        this._die = function () {
            self.alive = false;
            self.animations.play('die', 8, false, true);
        };

        construct();
    }

    Bomber.prototype = Object.create(Phaser.Sprite.prototype);

    Bomber.prototype.update = function() {
        this._update();
    };

    Bomber.prototype.processInput = function(input) {
        this._processInput(input);
    };

    Bomber.prototype.die = function() {
        this._die();
    };

    return Bomber;
})();
