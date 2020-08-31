import * as R from 'ramda';
import { createCell } from '../cell/factory';
import { getRandomCell, getUnvisitedNeighbour } from '../cell/locators';
import { createWalls, toggleWallBits } from '../wallGenerator';
import constants from '../constants';

const FIRST_CELL = 'FIRST_CELL';
const LAST_COORD = `${constants.GRID_SIZE - 1},${constants.GRID_SIZE - 1}`;

const cellMarkers = new Map([
  [FIRST_CELL, (cell) => cell.visit()], // first cell is inherently visited
  ['0,0', 'START'],
  [LAST_COORD, 'FINISH'],
]);

const createFilledArray = (length, predicate) => Array(length).fill(null).map(
  (_, i) => predicate(i),
);

const rCreateCell = R.curry(createCell);
const initCell = rCreateCell(false, null, createWalls());

function generateCells() {
  const { GRID_SIZE } = constants;

  return createFilledArray(
    GRID_SIZE,
    (column) => createFilledArray(
      GRID_SIZE,
      (row) => initCell(column, row),
    ),
  );
}

function markCell(cell, visitedCellsCount) {
  const key = visitedCellsCount === 0 ? FIRST_CELL : cell.toString();

  if (cellMarkers.has(key)) {
    return cellMarkers.get(key);
  }
  return null;
}

function generateMase() {
  const cells = generateCells();
  let cell = cells[0][0];
  let visitedCellsCount = 0;
  const stack = [];
  const { CELL_COUNT } = constants;
  while (visitedCellsCount !== CELL_COUNT - 1) {
    const neighbour = getUnvisitedNeighbour(cells, cell);

    const increment = neighbour ? 1 : 0;

    cell.type = markCell(cell, visitedCellsCount);

    if (neighbour) {
      cell.isTrue = true;
      cell.walls = toggleWallBits(cell, neighbour);
      neighbour.isVisited = true;
      neighbour.walls = toggleWallBits(neighbour, cell);
      stack.push(neighbour);
    }
    cell = neighbour || stack.pop();
    visitedCellsCount += increment;
  }
  return cells;
}

export default generateMase;
