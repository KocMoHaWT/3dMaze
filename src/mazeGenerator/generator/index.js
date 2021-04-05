import * as R from 'ramda';
import { createCell } from '../cell/factory';
import { getUnvisitedNeighbour } from '../cell/locators';
import { createWalls, toggleWallBits } from '../wallGenerator';
import constants from '../constants';

const FIRST_CELL = 'FIRST_CELL';

const createFilledArray = (length, predicate) => Array(length).fill(null).map(
  (_, i) => predicate(i),
);

const rCreateCell = R.curry(createCell);
const initCell = rCreateCell(false, null, createWalls());

function generateCells(cols, rows) {
  return createFilledArray(
    cols,
    (column) => createFilledArray(
      rows,
      (row) => initCell(column, row),
    ),
  );
}

function markCell(cell, visitedCellsCount, cols, rows) {
  const key = visitedCellsCount === 0 ? FIRST_CELL : cell.toString();

  const cellMarkers = new Map([
    [FIRST_CELL, (cellBox) => cellBox.visit()], // first cell is inherently visited
    ['0,0', 'START'],
    [`${cols - 1},${rows - 1}`, 'FINISH'],
  ]);

  if (cellMarkers.has(key)) {
    return cellMarkers.get(key);
  }
  return null;
}

function generateMase(cols, rows) {
  const cells = generateCells(cols, rows);
  let cell = cells[0][0];
  let visitedCellsCount = 0;
  const stack = [];
  const gridSize = cols * rows;
  while (visitedCellsCount !== gridSize - 1) {
    const neighbour = getUnvisitedNeighbour(cells, cell);

    const increment = neighbour ? 1 : 0;

    cell.type = markCell(cell, visitedCellsCount, cols, rows);

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
