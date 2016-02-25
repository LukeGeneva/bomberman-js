var Explosion = (function() {
    'use strict';

    function Explosion(game) {
        var self = this;
        var exploding = false;

        var construct = function() {
            Phaser.Sprite.call(self, game, 0, 0, 'sprites');
            game.add.existing(self);
            game.physics.enable(self);
            self.body.setSize(16, 16);
            self.anchor.setTo(0.5, 0.5);
            self.immovable = true;
            applyAnimations();
        };

        var applyAnimations = function () {
            self.animations.add('explode', ['explosion1', 'explosion2', 'explosion3', 'explosion4']);
        };

        this._update = function() {
            if (!exploding) {
                explode();
            }
        };

        var explode = function() {
            exploding = true;
            self.animations.play('explode', 16, false, true);
        };

        construct();
    }

    Explosion.prototype = Object.create(Phaser.Sprite.prototype);
    Explosion.prototype.update = function() {
        this._update();
    };

    return Explosion;
})();
