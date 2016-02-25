var Bomb = (function() {
    'use strict';

    function Bomb(game) {
        var self = this;
        var ticking = false;
        var fuseStartTime = 0;

        this.bomber = null;

        var construct = function() {
            Phaser.Sprite.call(self, game, 0, 0, 'sprites');
            game.add.existing(self);
            game.physics.enable(self);
            game.groups.bombs.add(self);
            self.body.setSize(16, 16);
            self.anchor.setTo(0.5, 0.5);
            self.fuseTime = 3000;
            self.explosionRadius = 1;
            self.animations.add('tick', ['bomb1', 'bomb2', 'bomb3', 'bomb2']);
            self.exploded = new Phaser.Signal();
        };

        this._update = function() {
			self.body.immovable = self.body.immovable || !game.physics.arcade.overlap(self.body, game.groups.bombers);

            if (ticking) {
                advanceFuse();
            }
        };

        var advanceFuse = function() {
            var endTime = fuseStartTime + self.fuseTime;
            var done = Date.now() >= endTime;
            if (done) {
                explode();
            }
        };

        var explode = function() {
            ticking = false;
            var explosion = new Explosion(game);
            explosion.x = self.x;
            explosion.y = self.y;
            game.groups.explosions.add(explosion);
            self.exploded.dispatch();
            self.destroy();
        };

        this._startFuse = function() {
            fuseStartTime = Date.now();
            self.animations.play('tick', 3, true);
            ticking = true;
        };

        this._centerInTile = function(tile) {
            var center = getTileWorldCenter(tile);
            self.x = center.x;
            self.y = center.y;
        };

        var getTileWorldCenter = function(tile) {
            var x = tile.worldX + tile.centerX;
            var y = tile.worldY + tile.centerY;
            return new Phaser.Point(x, y);
        };

        construct();
    }

    Bomb.prototype = Object.create(Phaser.Sprite.prototype);

    Bomb.prototype.update = function() {
        this._update();
    };

    Bomb.prototype.startFuse = function() {
        this._startFuse();
    };

    Bomb.prototype.centerInTile = function(tile) {
        this._centerInTile(tile);
    };

    return Bomb;
})();
