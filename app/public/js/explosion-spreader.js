var ExplosionSpreader = (function() {
    'use strict';
    
    function ExplosionSpreader(game, originTile, radius) {
        var previousTile = originTile;
        var currentTile = originTile;
        var explosionDistance = radius;

        this.spread = function() {
            createExplosion(currentTile);
            spreadNorth();
            spreadSouth();
            spreadEast();
            spreadWest();
        };

        var spreadNorth = function() {
            previousTile = currentTile;
            currentTile = game.map.getTileAbove(game.map.baseTileLayer.index, currentTile.x, currentTile.y);
            continueSpread(spreadNorth);
        };

        var spreadSouth = function() {
            previousTile = currentTile;
            currentTile = game.map.getTileBelow(game.map.baseTileLayer.index, currentTile.x, currentTile.y);
            continueSpread(spreadSouth);
        };

        var spreadEast = function() {
            previousTile = currentTile;
            currentTile = game.map.getTileRight(game.map.baseTileLayer.index, currentTile.x, currentTile.y);
            continueSpread(spreadEast);
        };

        var spreadWest = function() {
            previousTile = currentTile;
            currentTile = game.map.getTileLeft(game.map.baseTileLayer.index, currentTile.x, currentTile.y);
            continueSpread(spreadWest);
        };

        var continueSpread = function(spreadFunction) {
            if (currentTile && explosionCanSpread()) {
                createExplosion();
                explosionDistance--;
                spreadFunction();
            }
            else {
                resetVars();
            }
        };

        var explosionCanSpread = function() {
            return !game.map.isTileFixed(currentTile.x, currentTile.y) && 
                !game.map.isTileBreakable(previousTile.x, previousTile.y) && 
                explosionDistance > 0;
        };

        var createExplosion = function() {
            var explosion = new Explosion(game);
            game.map.centerSpriteInTile(explosion, currentTile);
        };

        var resetVars = function() {
            currentTile = originTile;
            explosionDistance = radius;
        };

    }

    return ExplosionSpreader;
})();
