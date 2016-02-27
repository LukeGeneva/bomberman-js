var ExplosionSpreader = (function() {
    'use strict';
    
    function ExplosionSpreader(game, originTile, radius) {

        this.spread = function() {
            createExplosion(originTile);
            spreadNorth(originTile, radius);
        };

        var spreadNorth = function(currentTile, explosionDistance) {
            var nextTile = game.map.getTileAbove(game.map.baseTileLayer.index, currentTile.x, currentTile.y);
            if (explosionDistance > 0 && !game.map.isTileFixed(nextTile.x, nextTile.y)) {
                createExplosion(nextTile);
                spreadNorth(nextTile, explosionDistance-1);
            }
        };

        var createExplosion = function(tile) {
            var explosion = new Explosion(game);
            game.map.centerSpriteInTile(explosion, tile);
        };

    }

    return ExplosionSpreader;
})();
