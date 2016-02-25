var InputHandler = (function() {
    'use strict';

    function InputHandler(game) {
        var self = this,
            cursors = game.input.keyboard.createCursorKeys(),
            bombKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        this.handle = function() {
            handleMovementInput();
            handleBombInput();
        };

        var handleMovementInput = function() {
            handleMoveInput(cursors.right, 'east');
            handleMoveInput(cursors.left, 'west');
            handleMoveInput(cursors.up, 'north');
            handleMoveInput(cursors.down, 'south');
            handleStopInput();
        };

        var handleMoveInput = function(cursor, direction) {
            if (cursor.isDown) {
                game.inputQueue.push('move-' + direction);
            }
        };

        var handleStopInput = function() {
            if (!anyCursorKeysAreDown()) {
                game.inputQueue.push('stop');
            }
        };

        var anyCursorKeysAreDown = function() {
            return cursors.right.isDown ||
                cursors.left.isDown ||
                cursors.up.isDown ||
                cursors.down.isDown;
        };

        var handleBombInput = function() {
            if (bombKey.justDown) {
                game.inputQueue.push('drop-bomb');
            }
        };
    }

    return InputHandler;
})();
