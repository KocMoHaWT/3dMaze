const wallDeletionComputations = [
  (cell, neighbour) => (neighbour.row < cell.row ? 1 : 0),
  (cell, neighbour) => (neighbour.column > cell.column ? 1 : 0),
  (cell, neighbour) => (neighbour.row > cell.row ? 1 : 0),
  (cell, neighbour) => (neighbour.column < cell.column ? 1 : 0),
];

export const createWalls = () => [1, 1, 1, 1]; // top-right-bottom-left - transformed via bit mask
// export const isHorizontalWall = (index) => index % 2 === 0;
export const isBottomWall = (index) => index === 2;
export const isRightWall = (index) => index === 1;

export const toggleWallBits = (cell, neighbour) => cell.walls.map(
  // eslint-disable-next-line no-bitwise
  (bit, i) => bit ^ wallDeletionComputations[i](cell, neighbour),
);
