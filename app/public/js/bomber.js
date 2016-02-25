/*global Bomb */

var Bomber = (function() {
    'use strict';

    function Bomber(game) {
        var self = this;
        var bombCapacity = 3;
        var activeBombs = 0;

        var construct = function () {
            Phaser.Sprite.call(self, game, 0, 0, 'sprites');
            game.add.existing(self);
            applyPhysics();
            applyAnimations();
            applyDefaults();
        };

        var applyPhysics = function () {
            self.game.physics.enable(self);
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
            self.bombRadius = 1;
            self.alive = true;
            self.speed = 80;
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

        var applyHelperXVelocity = function() {
            var bomberTile = getCurrentTile();
            var destinationTile;
            if (self.body.blocked.up) {
                destinationTile = game.map.getTileAbove(game.map.fixedTileLayer.index, bomberTile.x, bomberTile.y);
            }
            else if (self.body.blocked.down) {
                destinationTile = game.map.getTileBelow(game.map.fixedTileLayer.index, bomberTile.x, bomberTile.y);
            }
            else {
                return;
            }

            if (destinationTile.index !== -1) {
                return;
            }

            var bomberTileCenter = bomberTile.left + bomberTile.width / 2;
            var helperThreshold = 8;
            var offset = bomberTileCenter - self.body.center.x;
            var absoluteOffset = Math.abs(offset);
            if (absoluteOffset === 0 || absoluteOffset > helperThreshold) {
                return;
            }
            self.body.velocity.x = offset > 0 ? self.speed : -self.speed;
        };

        var applyHelperYVelocity = function() {
            var bomberTile = getCurrentTile();
            var destinationTile;
            if (self.body.blocked.left) {
                destinationTile = game.map.getTileLeft(game.map.fixedTileLayer.index, bomberTile.x, bomberTile.y);
            }
            else if (self.body.blocked.right) {
                destinationTile = game.map.getTileRight(game.map.fixedTileLayer.index, bomberTile.x, bomberTile.y);
            }
            else {
                return;
            }

            if (destinationTile.index !== -1) {
                return;
            }

            var bomberTileCenter = bomberTile.top + bomberTile.height / 2;
            var helperThreshold = 8;
            var offset = bomberTileCenter - self.body.center.y;
            var absoluteOffset = Math.abs(offset);
            if (absoluteOffset === 0 || absoluteOffset > helperThreshold) {
                return;
            }
            self.body.velocity.y = offset > 0 ? self.speed : -self.speed;
        };

        var getCurrentTile = function() {
            return game.map.getTileWorldXY(self.body.center.x, self.body.center.y);
        };

        this._update = function () {
            applyHelperXVelocity();
            applyHelperYVelocity();
        };

        var dropBomb = function () {
            var bomb = new Bomb(self.game);
            bomb.bomber = self;
            bomb.centerInTile(getCurrentTile());
            bomb.startFuse();
            bomb.exploded.add(function() {
                activeBombs--;
            });
            activeBombs++;
        };

        var canDropBomb = function() {
            var bombTile = getCurrentTile();
            return activeBombs < bombCapacity && !tileHasBomb(bombTile);
        };

        var tileHasBomb = function(tile) {
            var hasBomb = false;
            game.groups.bombs.forEach(function(bomb) {
                var bombTile = game.map.getTileWorldXY(bomb.x, bomb.y);
                if (bombTile.x === tile.x && bombTile.y === tile.y) {
                    hasBomb = true;
                }
            });
            return hasBomb;
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
