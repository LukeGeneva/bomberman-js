var MapExtender = (function() {
    'use strict';

    function MapExtender() {

        this.extend = function(game) {
            var map = game.map;

            map.getSpriteBodyTile = function(sprite) {
                var tile = map.getTileWorldXY(sprite.body.center.x, sprite.body.center.y);
                return tile;
            };

            map.centerSpriteInTile = function(sprite, tile) {
                var center = map.getTileWorldCenter(tile);
                sprite.x = center.x;
                sprite.y = center.y;
            };

            map.getTileWorldCenter = function(tile) {
                var x = tile.worldX + tile.centerX;
                var y = tile.worldY + tile.centerY;
                return new Phaser.Point(x, y);
            };

            map.tileHasBomb = function(tile) {
                var hasBomb = false;
                game.groups.bombs.forEach(function(bomb) {
                    var bombTile = map.getSpriteBodyTile(bomb);
                    if (bombTile.x === tile.x && bombTile.y === tile.y) {
                        hasBomb = true;
                    }
                });
                return hasBomb;
            };

            map.isTileFixed = function(x, y) {
                var tile = map.getTile(x, y, map.fixedTileLayer.index);
                return tile !== null;
            };

        };
    }

    return MapExtender;
})();
