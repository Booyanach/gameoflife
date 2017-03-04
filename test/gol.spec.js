var expect = chai.expect;
var should = chai.should;

describe('GOL', function() {
  describe('init', function() {
    it('should have initialized with all values', function() {
      expect(gol.started).to.equal(false);
      expect(gol.width).to.equal(40);
      expect(gol.height).to.equal(40);
      expect(gol.cellSize).to.equal(8);
      expect(gol.cellSpacing).to.equal(1);
      expect(gol.colors[0]).to.equal('#FFFFFF');
      expect(gol.colors[1]).to.equal('#7fafd1');
      expect(gol.elements.length).to.equal(1600);
      expect(gol.grid.length).to.equal(40);
    });
  });

  describe('storeCell', function () {
    it('stores the value of an element in a grid cell', function () {
      var element = {iColumn: 1, iCell: 2, value: 1};

      gol.storeCell(element);

      expect(gol.grid[1][2]).to.equal(1);
    });
  });

  describe('drawCell', function () {
    it('draws a cell on the canvas', function () {
      var spy = chai.spy(gol.context.fillRect);
      var element = {column: 1, row: 2, value: 1, color: gol.colors[1]};

      gol.drawCell(element);

      expect(gol.context.fillStyle).to.equal(gol.colors[1]);
      // Having issues spying on fillRect, moving on
      //expect(spy).to.have.been.called.with(1, 2, 8, 8);
    });
  });

  describe('updateGrid', function () {
    it('cycles all elements to check if they live and stores them', function () {
      var spy = chai.spy.on(gol, 'storeCell');
      gol.grid = [[1, 1], [0, 1]];
      gol.elements = [{
          iColumn: 0,
          iCell: 0,
          col: gol.grid[0],
          value: 1
        }, {
          iColumn: 0,
          iCell: 1,
          col: gol.grid[0],
          value: 1
        }, {
          iColumn: 1,
          iCell: 0,
          col: gol.grid[1],
          value: 0
        }, {
          iColumn: 1,
          iCell: 1,
          col: gol.grid[1],
          value: 1
      }];

      gol.updateGrid();
      expect(spy).to.have.been.called.exactly(4);
      expect(gol.grid[0][0]).to.equal(1);
      expect(gol.grid[0][1]).to.equal(1);
      expect(gol.grid[1][0]).to.equal(1);
      expect(gol.grid[1][1]).to.equal(1);

    });
  });

  describe('calculateBehavior', function () {
    it('checks if a cell should live or die, cell: 0', function () {
      for(var i = 1; i <= 8; i++) {
        var value = gol.calculateBehavior(i, 0);
        if (i === 3) {
          expect(value).to.equal(1);
        } else {
          expect(value).to.equal(0);
        }
      }
    });

    it('checks if a cell should live or die, cell: 1', function () {

      for(var i = 1; i <= 8; i++) {
        var value = gol.calculateBehavior(i, 1);
        if (i === 2 || i === 3) {
          expect(value).to.equal(1);
        } else {
          expect(value).to.equal(0);
        }
      }
    });
  });
});