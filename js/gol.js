var GOL = function() {
    this.started = false;
    this.width = 0;
    this.height = 0;
    this.cellSize = 8;
    this.cellSpacing = 1;
    this.colors = ['#FFFFFF', '#7fafd1']

    this.elements = [];
    this.grid = [];

    this.counter = document.getElementById('counter');
    this.canvas = document.getElementById('playground');
    this.context = this.canvas.getContext('2d');

    // Handle click events on canvas
    this.canvas.addEventListener('mousedown', this.clickListener.bind(this), false);

    this.generateGrid();
};

GOL.prototype.clickListener = function (event) {
    var self = this;
    var x = event.pageX - self.canvas.offsetLeft,
        y = event.pageY - self.canvas.offsetTop;
    
    // Detect click over a cell.
    self.elements.forEach(function(element) {
        if (
            y > element.row && y < element.row + element.height 
            && x > element.column && x < element.column + element.width
        ) {
            element.value = element.value === 0 ? 1 : 0;
            element.color = self.colors[element.value];
            self.storeCell(element);
            self.drawCell(element);
        }
    });
}

GOL.prototype.storeCell = function (element) {
    this.grid[element.iColumn][element.iCell] = element.value;
}

GOL.prototype.generateGrid = function () {
    var self = this;

    self.counter.innerText = 0;

    self.width = parseInt(document.getElementById('x_input').value) || 40;
    self.height = parseInt(document.getElementById('y_input').value) || 40;

    self.grid = new Array(self.width).fill(new Array(self.height).fill(0));
    self.canvas.width = self.width * self.cellSize + self.cellSpacing * self.width + self.cellSpacing;
    self.canvas.height = self.height * self.cellSize + self.cellSpacing * self.height + self.cellSpacing;

    self.grid = self.grid.map(function(column, iColumn) {
        return column.map(function(cell, iCell) {
            var element = {
                iColumn: iColumn,
                iCell: iCell,
                col: column,
                column: (iColumn * self.cellSize) + self.cellSpacing + (self.cellSpacing * iColumn),
                row: (iCell * self.cellSize) + self.cellSpacing + (self.cellSpacing * iCell),
                color: self.colors[0],
                value: 0,
                width: self.cellSize,
                height: self.cellSize
            };

            self.drawCell(element);
            
            self.elements.push(element);
            return element;
        });
    });

    this.drawGrid();
}

GOL.prototype.drawGrid = function () {
    var self = this;
    self.clear();
    self.grid.map(function(column, iColumn) {
        column.map(function(cell, iCell) {
            // Either occupied or not
            self.context.fillStyle = self.colors[cell];
            self.context.fillRect(
                (iColumn * self.cellSize) + self.cellSpacing + (self.cellSpacing * iColumn),
                (iCell * self.cellSize) + self.cellSpacing + (self.cellSpacing * iCell),
                self.cellSize,
                self.cellSize
            );
        });
    });
}

GOL.prototype.drawCell = function (element) {
    // Either occupied or not
    this.context.fillStyle = element.color;

    this.context.fillRect(
        element.column,
        element.row,
        this.cellSize,
        this.cellSize
    );
}

GOL.prototype.updateGrid = function () {
    var self = this;
    self.elements.forEach(function (element) {
        var neighbors = self.getNeighbors(element.col, element.iColumn, element.iCell);
        element.value = self.calculateBehavior(neighbors, element.value);
        self.storeCell(element);
    });
}

GOL.prototype.getNeighbors = function (column, iColumn, iRow) {
    var neighbors = 0;

    var prevColumn = this.grid[iColumn-1];
    var nextColumn = this.grid[iColumn+1];

    if(prevColumn) {
        neighbors += prevColumn[iRow-1] || 0;         //top left
        neighbors += prevColumn[iRow] || 0;           //top center
        neighbors += prevColumn[iRow+1] || 0;         //top right
    }

    neighbors += column[iRow-1] || 0;                 //middle left
    neighbors += column[iRow+1] || 0;                 //middle right

    if (nextColumn) {
        neighbors += nextColumn[iRow-1] || 0;         //bottom left
        neighbors += nextColumn[iRow] || 0;           //bottom center
        neighbors += nextColumn[iRow+1] || 0;         //bottom right
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
    this.generateGrid();
    this.randomizedStart();
    this.drawGrid();
}

GOL.prototype.nextStep = function () {
    this.counter.innerText = parseInt(this.counter.innerText) + 1;
    this.updateGrid();
    this.drawGrid();
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
    var self = this;
    self.elements.forEach(function (element) {
        // Either alive or not
        element.value = Math.floor(Math.random() * 2);
        element.color = self.colors[element.value];
        self.storeCell(element);
        self.drawCell(element);
    });
}

GOL.prototype.clear = function() {
    this.context.clearRect(0, 0, 400 * this.width, 400 * this.height);
}

var gol = new GOL();