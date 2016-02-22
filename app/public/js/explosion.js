var Explosion = (function() {
    function Explosion(x, y, radius) {
        var self = this;
        var duration = 500;
        var endTime = Date.now() + duration;

        this.x = x;
        this.y = y;
        this.radius = radius;

        this._update = function() {
            var currentTime = Date.now();
            if (currentTime > endTime) {
                self.destroy();
            }
        };
    }

    Explosion.prototype = Object.create(Phaser.Sprite.prototype);

    Explosion.prototype.update = function() {
        this._update();
    };

    return Explosion();
})();