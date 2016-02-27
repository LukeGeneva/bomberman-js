var Spawner = (function() {
    'use strict';

    function Spawner(game) {
        var currentSpawnPoint = 0;
        var spawnPoints = {
            0: { x:1, y:1 },
            1: { x:13, y:1 },
            2: { x:1, y:11 },
            3: { x:13, y:11 }
        };

        this.spawn = function() {
            var bomber = new Bomber(game);
            var spawnPoint = spawnPoints[currentSpawnPoint];
            var tile = game.map.getTile(spawnPoint.x, spawnPoint.y);
            game.map.centerSpriteInTile(bomber, tile);
            currentSpawnPoint++;
            return bomber;
        };
    }

    return Spawner;
})();
