var Bomb = (function() {
    'use strict';

    function Bomb(game) {
        var self = this;
        var fuseStartTime = Date.now();
        var hasExploded = false;

        var construct = function() {
            Phaser.Sprite.call(self, game, 0, 0, 'sprites');
            game.add.existing(self);
            game.groups.bombs.add(self);
            game.physics.enable(self);
            self.anchor.setTo(0.5, 0.5);
            self.body.setSize(16, 16);
            self.fuseTime = 3000;
            self.explosionRadius = 1;
            self.animations.add('tick', ['bomb1', 'bomb2', 'bomb3', 'bomb2']);
            self.exploded = new Phaser.Signal();
        };

        this._update = function() {
            if (hasExploded) {
                self.destroy();
            }
            else {
                self.animations.play('tick', 3, true);
                self.body.immovable = self.body.immovable || !game.physics.arcade.overlap(self.body, game.groups.bombers);
                advanceFuse();
            }
        };

        var advanceFuse = function() {
            var endTime = fuseStartTime + self.fuseTime;
            var done = Date.now() >= endTime;
            if (done) {
                self._explode();
            }
        };

        this._explode = function() {
            var bombTile = game.map.getSpriteBodyTile(self);
            var spreader = new ExplosionSpreader(game, bombTile, self.explosionRadius);
            spreader.spread();
            self.exploded.dispatch();
            hasExploded = true;
        };

        construct();
    }

    Bomb.prototype = Object.create(Phaser.Sprite.prototype);

    Bomb.prototype.update = function() {
        this._update();
    };

    Bomb.prototype.explode = function() {
        this._explode();
    };

    return Bomb;
})();
