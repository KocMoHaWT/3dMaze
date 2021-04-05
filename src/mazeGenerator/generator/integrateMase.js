// eslint-disable-next-line max-len
const integratedLabyrinth = (maze) => maze.map((column, columnIndex) => column.map((rowItem, rowIndex) => {
  const connections = [];
  const rightNeighbour = maze[columnIndex + 1] ? maze[columnIndex + 1][rowIndex] : null;
  const downNeighbour = maze[rowIndex + 1] ? maze[columnIndex][rowIndex + 1] : null;

  if (rowItem.type === 'FINISH') {
    connections.push([[columnIndex, rowIndex], [columnIndex + 1, rowIndex]]);
  }
  // check current cell's right wall with the left wall of neighbour
  if (rightNeighbour && rowItem.walls[1] === 0) {
    connections.push([[columnIndex, rowIndex], [columnIndex + 1, rowIndex]]);
  }
  // check current cell's down wall with the upper wall of neighbour
  if (downNeighbour && rowItem.walls[2] === 0) {
    connections.push([[columnIndex, rowIndex], [columnIndex, rowIndex + 1]]);
  }

  return connections;
})).flat(2);

export default integratedLabyrinth;
