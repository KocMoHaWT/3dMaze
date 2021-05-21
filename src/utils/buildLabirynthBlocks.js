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

const buildLabirynthBlocks = (scene, brickConfig, labyrynthModel) => {
  const blocks =  labyrynthModel.map((item) => buildSingleBlock(scene, brickConfig, item));
  const finishBrick =  blocks.pop();
  console.log(finishBrick);
  return [blocks, finishBrick]
}
 

export default buildLabirynthBlocks
