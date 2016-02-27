var MovementHelper = (function() {
    'use strict';

    function MovementHelper(game, bomber) {

        var HELPER_THRESHOLD = 8;
        var FIXED_TILE_INDEX = -1;

        this.help = function() {
            applyHelperXVelocity();
            applyHelperYVelocity();
        };

        var applyHelperXVelocity = function() {
            var bomberTile = getCurrentTile();
            var destinationTile;
            if (bomber.body.blocked.up) {
                destinationTile = game.map.getTileAbove(game.map.fixedTileLayer.index, bomberTile.x, bomberTile.y);
            }
            else if (bomber.body.blocked.down) {
                destinationTile = game.map.getTileBelow(game.map.fixedTileLayer.index, bomberTile.x, bomberTile.y);
            }

            if (destinationTile && destinationTile.index === FIXED_TILE_INDEX) {
                var bomberTileCenter = bomberTile.left + bomberTile.width / 2;
                var offset = bomberTileCenter - bomber.body.center.x;
                var absoluteOffset = Math.abs(offset);
                if (absoluteOffset !== 0 && absoluteOffset < HELPER_THRESHOLD) {
                    bomber.body.velocity.x = offset > 0 ? bomber.speed : -bomber.speed;
                }
            }
        };

        var applyHelperYVelocity = function() {
            var bomberTile = getCurrentTile();
            var destinationTile;
            if (bomber.body.blocked.left) {
                destinationTile = game.map.getTileLeft(game.map.fixedTileLayer.index, bomberTile.x, bomberTile.y);
            }
            else if (bomber.body.blocked.right) {
                destinationTile = game.map.getTileRight(game.map.fixedTileLayer.index, bomberTile.x, bomberTile.y);
            }

            if (destinationTile && destinationTile.index === FIXED_TILE_INDEX) {
                var bomberTileCenter = bomberTile.top + bomberTile.height / 2;
                var offset = bomberTileCenter - bomber.body.center.y;
                var absoluteOffset = Math.abs(offset);
                if (absoluteOffset !== 0 && absoluteOffset < HELPER_THRESHOLD) {
                    bomber.body.velocity.y = offset > 0 ? bomber.speed : -bomber.speed;
                }
            }
        };

        var getCurrentTile = function() {
            return game.map.getTileWorldXY(bomber.body.center.x, bomber.body.center.y);
        };

    }

    return MovementHelper;
})();
