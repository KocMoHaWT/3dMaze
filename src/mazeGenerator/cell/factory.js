export const START = 'START';
export const FINISH = 'FINISH';

// eslint-disable-next-line max-len,import/prefer-default-export
export const createCell = (isVisited, type, walls, column, row) => ({
  column,
  row,
  isVisited,
  type,
  walls,
  toString: () => `${column},${row}`,
});
