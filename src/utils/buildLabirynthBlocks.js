import { Angle, Vector2, Tools } from 'babylonjs';
import { Vector3 } from '@babylonjs/core/Maths/math';

import createBrick from './createBrick'

const buildSingleBlock = (scene, brickConfig, item) => {
  const element = createBrick(scene, brickConfig)
  const rotationAngle = Angle.BetweenTwoPoints(new Vector2(...item[0]), new Vector2(...item[1]))
  const brickScale = new Vector3(3, 3, 0)
  const targetPosition = new Vector3(...item[0], 0).multiply(brickScale)
  return element.locallyTranslate(targetPosition)
    .rotate(new Vector3(0, 0, 1), rotationAngle.radians())
    // .rotate(new Vector3(1,0,0), Math.PI / 2)
}

const makeCopy = (maze, width) => {
  const newMaze = [...maze].map(item => {
   const newItem = [[...item[0]], [...item[1]]];
   newItem[0][1] += width;  
   newItem[1][1] += width;
   return newItem;
  })

  return newMaze;
}

// reduce borders between mazes
const borderReducer = .5;

const buildLabirynthBlocks = (scene, brickConfig, labyrynthModel, labyrinthConfig) => {
  const secondCopy = makeCopy(labyrynthModel, labyrinthConfig.height - borderReducer);
  const thirdCopy = makeCopy(labyrynthModel, (labyrinthConfig.height - borderReducer ) * 2);
  const firstFinish = labyrynthModel.pop();
  const secondFinish = secondCopy.pop();
  const thirdFinish = thirdCopy.pop();
  const blocks =  [...labyrynthModel].map((item) => buildSingleBlock(scene, brickConfig, item));
  const finishBlocks = [firstFinish].map((item) => buildSingleBlock(scene, brickConfig, item));;
  return [blocks, finishBlocks]
}
 

export default buildLabirynthBlocks
