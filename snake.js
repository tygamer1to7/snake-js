/*
 *  Project: Snake
 *  Description: Plays snake on the window object.
 *  Author: Joshua Kravitz
 */

(function() {
    /**
     * Encapsulates a grid location.
     */
    function Location(row, col) {
        this.row = row;
        this.col = col;
    }

    var SnakeWorld = {
        init: function() {
            this.snake = [this.getRandomLocation()];
            this.placeFood();
        },

        placeFood: function() {
            this.food = this.getRandomLocation();
        },

        getRandomLocation: function() {
            return new Location(getRandomInt(0, getNumRows() - 1), 
                                getRandomInt(0, getNumCols() - 1));
        },

        /**
         * Return snake tile locations.
         */
        getSnake: function() {
            return this.snake;
        },

        /**
         * Return food location.
         */
        getFood: function() {
            return this.food;
        },

        /**
         * Checks if there is a food/snake collision.
         * @return {bool} whether a collision has occured
         */
        checkCollision: function() {
            var head = this.snake[this.snake.length - 1];
            return head.row == food.row && head.col == food.col;
        },

        /**
         * Updates locations of snake and food.
         * @param  {number} currDir id of snake's dirrection
         */
        update: function(currDir) {
            if (this.checkCollision()) {
                this.placeFood();
                this.snake.push(this.getNewHead(currDir));             
            } else {
                this.snake[this.snake.length] = this.getNewHead(currDir);
                this.snake.shift();
            }
        },


        /**
         * Returns the location of the new head one tile in specified direction
         * @param  {number} dir direction id of snake
         * @return {Location}   new location of head
         */
        getNewHead: function(dir) {
            var oldHead = this.getHead(),
                newHead = new Location(oldHead.row, oldHead.col);

            if (dir == DIRS["UP"]) {
                newHead.row--;
            } else if (dir == DIRS["DOWN"]) {
                newHead.row++;
            } else if (dir == DIRS["LEFT"]) {
                newHead.col--;
            } else if (dir == DIRS["RIGHT"]) {
                newHead.col++;
            }

            // wrap snake around to other side
            if (newHead.row < 0) newHead.row = getNumRows() - 1;
            if (newHead.col < 0) newHead.col = getNumCols() - 1;
            newHead.row %= getNumRows();
            newHead.col %= getNumCols();

            return newHead;
        },

        getHead: function() {
            return this.snake[this.snake.length - 1];
        }
    };

    var SnakeGraphics = {
        init: function() {
            this.setupCanvas();
        },

        /**
         * Creates a canvas that overlays the entire screen.
         * Stores the canvas and context in member variables.
         */
        setupCanvas: function() {
            this.canvas = this.createNewCanvas();
            $(document.body).append(this.canvas);
            this.ctx = this.canvas.getContext('2d');
        },

        /**
         * Sets up an html5 canvas element so that it stays fixed
         * on the page and changes size when the window is resized.
         */
        createNewCanvas: function() {
            var canvas = document.createElement('canvas');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            canvas.style.cssText = CANVAS_CSS;

            $(window).resize($.proxy(this.onResize, this));

            return canvas;
        },

        /**
         * Resizes the canvas to fit the full screen (called when window is resized).
         */
        onResize: function() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        },

        /**
         * Draws the snake and food to the canvas.
         */
        draw: function() {
            this.clearCanvas();
            this.drawSnake();
            this.drawFood();
        },

        clearCanvas: function() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        },

        drawSnake: function() {
            snake = SnakeWorld.getSnake();
            this.ctx.fillStyle = SNAKE_COLOR;
            for (var i = 0; i < snake.length; ++i) {
                this.drawRect(snake[i]);
            }
        },

        drawFood: function() {
            food = SnakeWorld.getFood();
            this.ctx.fillStyle = FOOD_COLOR;
            this.drawRect(food);
        },

        drawRect: function(loc) {
            this.ctx.fillRect(
                loc.col * TILE_SIZE, 
                loc.row * TILE_SIZE, 
                TILE_SIZE, TILE_SIZE
            );
        }
    };

    var Snake = {
        run: function() {
            SnakeGraphics.init();
            SnakeWorld.init();

            this.lastTwoDirs = [null, DIRS["RIGHT"]]; // make snake start out going right
            $(window).keydown($.proxy(this.onKeyDown, this));

            this.updateFrame();
        },

        /**
         * Log key pressed if arrow keys.
         */
        onKeyDown: function(e) {
            switch (e.keyCode) {
                case (KEYS["UP"]):
                    this.setDir(DIRS["UP"]);
                    break;
                case (KEYS["DOWN"]):
                    this.setDir(DIRS["DOWN"]);
                    break;
                case (KEYS["LEFT"]):
                    this.setDir(DIRS["LEFT"]);
                    break;
                case (KEYS["RIGHT"]):
                    this.setDir(DIRS["RIGHT"]);
                    break;
            }
        },

        /**
         * Adds dir to lastTwoDirs and shifts over old move. 
         * @param {[number]} dir id of direction corresponding to key pressed
         */
        setDir: function(dir) {
            if (this.lastTwoDirs[1] != DIRS.OPPOSITE[dir]) {
                this.lastTwoDirs.shift();
                this.lastTwoDirs[1] = dir;
            }
        },

        /**
         * Draws the current frame and updates data for the next frame.
         */
        updateFrame: function() {
            SnakeGraphics.draw();
            SnakeWorld.update(this.lastTwoDirs[1]);
            // requestAnimationFrame($.proxy(this.updateFrame, this));
            setTimeout($.proxy(this.updateFrame, this), DELAY);
        },
    };


    /* Utility Functions */
    
    /**
     * Returns a random integer between min and max
     * Using Math.round() will give you a non-uniform distribution!
     */
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    /**
     * Returns the number of rows and columns in the current window.
     * Add 1 so that no space is left in ends of window when snake moves across.
     */
    function getNumRows() {
        return Math.floor($(window).height() / TILE_SIZE) + 1;
    }

    function getNumCols() {
        return Math.floor($(window).width() / TILE_SIZE) + 1;
    }

    
    /* Constants */

    var TILE_SIZE = 20, // width/height of snake/food tiles
        KEYS = { ESC: 27, SPACE: 32, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40 },
        DIRS = { UP: 0, DOWN: 1, LEFT: 2, RIGHT: 3, OPPOSITE: [1, 0, 3, 2] },
        SNAKE_COLOR = 'green',
        FOOD_COLOR = 'red',
        DELAY = 50;

    var CANVAS_CSS = "background: rgba(0, 0, 0, 0) !important; position: fixed; top: 0; left: 0; z-index: 100000";


    window.Snake = Snake; // make Snake object available to global window
})();
