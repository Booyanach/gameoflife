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
    this.canvas.width = this.width * this.cellSize;
    this.canvas.height = this.height * this.cellSize;
}

GOL.prototype.drawGrid = function () {
    var self = this;
    self.clear();
    self.grid.map(function(row, iRow) {
        row.map(function(cell, iCell) {
            // Either occupied or not
            self.context.fillStyle = '#7fafd1';
            if (cell === 1) self.context.fillRect(iRow * self.cellSize, iCell * self.cellSize, self.cellSize, self.cellSize);
        });
    });
}

GOL.prototype.updateGrid = function (callback) {
    var self = this;
    self.grid = self.grid.map(function(row, iRow) {
        return row.map(function(cell, iCell) {
            var neighbors = self.getNeighbors(row, iRow, iCell);
            return self.calculateBehavior(neighbors, cell);
        });
    });
}

GOL.prototype.getNeighbors = function (row, iRow, iCell) {
    var neighbors = 0;

    var prevRow = this.grid[iRow-1];
    var nextRow = this.grid[iRow+1];

    if(prevRow) {
        neighbors += prevRow[iCell-1] || 0;         //top left
        neighbors += prevRow[iCell] || 0;           //top center
        neighbors += prevRow[iCell+1] || 0;         //top right
    }

    neighbors += row[iCell-1] || 0;                 //middle left
    neighbors += row[iCell+1] || 0;                 //middle right

    if (nextRow) {
        neighbors += nextRow[iCell-1] || 0;         //bottom left
        neighbors += nextRow[iCell] || 0;           //bottom center
        neighbors += nextRow[iCell+1] || 0;         //bottom right
    }

    return neighbors;
}

GOL.prototype.calculateBehavior = function (neighbors, cell) {
    if (cell === 0) {
        // Has 3 living neighbors, make it live, otherwise, remain dead
        cell = neighbors === 3 ? 1 : cell;
    } else {
        if ([0, 1, 4, 5, 6, 7, 8].indexOf(neighbors) > -1) {
            // Either the cell is lonely (0, 1) or the space is overcrowded (4, 5, 6, 7, 8)
            // Otherwise, it keeps on living
            cell = 0;
        }
    }
    return cell;
};

GOL.prototype.populate = function () {
    this.randomizedStart();
    this.drawGrid();
}

GOL.prototype.nextStep = function () {
    this.drawGrid();
    this.updateGrid();
    if (this.started) {
        window.requestAnimationFrame(this.nextStep.bind(this));
    }
}

GOL.prototype.startStop = function (elem) {
    this.started = !this.started;
    if (this.started) {
        elem.innerText = "Stop";
    } else {
        elem.innerText = "Start";
    }
    this.nextStep();
};

GOL.prototype.randomizedStart = function () {
    this.grid = this.grid.map(function(row) {
        return row.map(function(cell) {
            // Either alive or not
            return Math.floor(Math.random() * 2);
        });
    });
}

GOL.prototype.clear = function() {
    this.context.clearRect(0, 0, 400 * this.width, 400 * this.height);
}

var gol = new GOL();