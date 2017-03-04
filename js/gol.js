var GOL = function() {
    this.started = false;
    this.width = 0;
    this.height = 0;
    this.grid = [];
    this.canvas = document.getElementById('playground');
    this.context = this.canvas.getContext('2d');
    this.cellSize = 4;
};

GOL.prototype.generateGrid = function () {
    this.width = parseInt(document.getElementById('x_input').value);
    this.height = parseInt(document.getElementById('y_input').value);

    this.grid = new Array(this.width).fill(new Array(this.height).fill(0));

    console.log(this.grid);
}

/**
 * We'll be using a canvas to draw this
 */
GOL.prototype.drawGrid = function () {
    var self = this;
    self.clear();
    self.grid = self.grid.map(function(row, irow) {
        return row.map(function(cell, icell) {
            // Either occupied or not
            self.context.fillStyle = '#7fafd1';
            if (cell === 1) self.context.fillRect(irow * self.cellSize, icell * self.cellSize, self.cellSize, self.cellSize);
        });
    });
}

GOL.prototype.populate = function () {
    this.randomizedStart();
    this.drawGrid();
}

GOL.prototype.nextStep = function () {

}

GOL.prototype.startStop = function (elem) {
    this.started = !this.started;
    if (this.started) {
        elem.innerText = "Stop";
    } else {
        elem.innerText = "Start";
    }

    // this.calculate();
};

GOL.prototype.randomizedStart = function () {
    this.grid = this.grid.map(function(row) {
        return row.map(function(cell) {
            // Either occupied or not
            return Math.floor(Math.random() * 2);
        });
    });
}

GOL.prototype.clear = function() {
    this.context.clearRect(0, 0, 400 * this.width, 400 * this.height);
}

var gol = new GOL();