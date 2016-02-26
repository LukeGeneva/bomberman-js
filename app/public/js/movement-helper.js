var MovementHelper = (function() {
    'use strict';

    function MovementHelper(game, bomber) {

        const HELPER_THRESHOLD = 8;

        this.help = function() {
            applyHelperXVelocity();
            applyHelperYVelocity();
        }

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
            var offset = bomberTileCenter - self.body.center.x;
            var absoluteOffset = Math.abs(offset);
            if (absoluteOffset === 0 || absoluteOffset > HELPER_THRESHOLD) {
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
            var offset = bomberTileCenter - self.body.center.y;
            var absoluteOffset = Math.abs(offset);
            if (absoluteOffset === 0 || absoluteOffset > HELPER_THRESHOLD) {
                return;
            }
            self.body.velocity.y = offset > 0 ? self.speed : -self.speed;
        };

    }

    return MovementHelper;
})();
