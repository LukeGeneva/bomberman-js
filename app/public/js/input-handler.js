var InputHandler = (function() {
    'use strict';

    function InputHandler(game) {
        var self = this,
            cursors = game.input.keyboard.createCursorKeys(),
            bombKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        this.moveBomber = new Phaser.Signal();
        this.stopBomber = new Phaser.Signal();
        this.dropBomb = new Phaser.Signal();

        this.dispatch = function() {
            dispatchMovementMessages();
            dispatchBombMessages();
        };

        var dispatchMovementMessages = function() {
            dispatchMoveMessage(cursors.right, 'east');
            dispatchMoveMessage(cursors.left, 'west');
            dispatchMoveMessage(cursors.up, 'north');
            dispatchMoveMessage(cursors.down, 'south');
            dispatchStopMessage();
        };

        var dispatchMoveMessage = function(cursor, direction) {
            if (cursor.isDown) {
                self.moveBomber.dispatch(direction);
            }
        };

        var dispatchStopMessage = function() {
            if (!anyCursorKeysAreDown()) {
                self.stopBomber.dispatch();
            }
        };

        var anyCursorKeysAreDown = function() {
            return cursors.right.isDown ||
                cursors.left.isDown ||
                cursors.up.isDown ||
                cursors.down.isDown;
        };

        var dispatchBombMessages = function() {
            if (bombKey.justDown) {
                self.dropBomb.dispatch();
            }
        };
    }

    return InputHandler;
})();
