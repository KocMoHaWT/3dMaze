// eslint-disable-next-line max-len
const integratedLabyrinth = (maze) => maze.map((column, columnIndex) => column.map((rowItem, rowIndex) => {
  const connections = [];
  const rightN = maze[columnIndex + 1] ? maze[columnIndex + 1][rowIndex] : null;
  const downN = maze[rowIndex + 1] ? maze[columnIndex][rowIndex + 1] : null;

  if (rowItem.type === 'START') {
    connections.push([[columnIndex - 1, rowIndex], [columnIndex, rowIndex]]);
  }

  if (rowItem.type === 'FINISH') {
    connections.push([[columnIndex, rowIndex], [columnIndex + 1, rowIndex]]);
  }

  if (rightN && rowItem.walls[1] === 0 && rightN.walls[3] === 0) {
    connections.push([[columnIndex, rowIndex], [columnIndex + 1, rowIndex]]);
  }

  if (downN && rowItem.walls[2] === 0 && downN.walls[0] === 0) {
    connections.push([[columnIndex, rowIndex], [columnIndex, rowIndex + 1]]);
  }

  return connections;
}).flat(1)).flat(1);

export default integratedLabyrinth;
