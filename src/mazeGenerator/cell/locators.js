const constants = require('../constants');

export const getRandomNumber = (max = 1, method = 'round') => Math[method](Math.random() * max);
export const getRandomCell = (cells) => cells[getRandomNumber(constants.GRID_SIZE - 1)][getRandomNumber(constants.GRID_SIZE - 1)];

function getUnvisitedNeighbours(cells, { column, row }) {
  const previousColumn = column > 0 ? cells[column - 1][row] : null;
  const previousRow = row > 0 ? cells[column][row - 1] : null;
  const nextColumn = column < cells.length - 1 ? cells[column + 1][row] : null; 
  const nextRow = row < cells[0].length - 1 ? cells[column][row + 1] : null;
  return [previousColumn, previousRow, nextColumn, nextRow]
    .filter(Boolean)
    .filter((cell) => !cell.isVisited);
}

export const getUnvisitedNeighbour = (cells, cell) => {
  // eslint-disable-next-line no-use-before-define
  const neighbours = getUnvisitedNeighbours(cells, cell);
  return neighbours[getRandomNumber(neighbours.length, 'floor')] || null;
};
