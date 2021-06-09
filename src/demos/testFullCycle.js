import {
  CSG,
  StandardMaterial,
  Vector3,
  VertexBuffer,
} from '@babylonjs/core';

import { skewMesh } from '../utils/skewMesh';
import buildLabirynthBlocks from '../utils/buildLabirynthBlocks';
import createBox from '../utils/createBox';
import labyrinthModel from '../labyrinth'
import integratedLabyrinth from '../mazeGenerator/generator/integrateMase';
import generateMase from '../mazeGenerator/generator';

const BRICK_CONFIG = {
  sectionWidth: 1.5,
  sections: 3,
  wallHeight: 0.2,
  roofHeight: 1,
  roofPadding: 0.3,
}

const labyrinthConfig = {
  height: 20,
  width: 20,
}

const createContent = (scene) => {
  const material = new StandardMaterial('material', scene);
  const maze = integratedLabyrinth(generateMase(labyrinthConfig.width, labyrinthConfig.height));
  const [blocks, finishBricks] = buildLabirynthBlocks(scene, BRICK_CONFIG, maze, labyrinthConfig);

  // NOTE: we need asymmetric paddings to get good border after skew
  const paddingsVector = new Vector3(1, 1, 0)
  const box = createBox(blocks, scene, paddingsVector)

  let boxCSG = CSG.FromMesh(box);
  [...blocks, ...finishBricks].forEach((obj) => {
    const newMeshCSG = CSG.FromMesh(obj);
    boxCSG = boxCSG.subtract(newMeshCSG);
    obj.dispose();
  })
  box.dispose();

  const newBox = boxCSG.toMesh('box', material, scene, false)
  // // this thing allows following update of a mesh.
  // // maybe I should keep it inside skew?
  newBox.markVerticesDataAsUpdatable(VertexBuffer.PositionKind, true)
  newBox.locallyTranslate(new Vector3(1, -3.495, -3));
  newBox.rotate(new Vector3(1, 0, 0), Math.PI / 2);
  // added new rotation in order to turn mesh's exit to top
  newBox.rotate(new Vector3(0, 0, 1), Math.PI / 2);
  // skewMesh(newBox)
};

export default createContent
