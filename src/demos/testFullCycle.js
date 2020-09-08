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
import integratedLabyrinth from "../mazeGenerator/generator/integrateMase";
import generateMase from "../mazeGenerator/generator";

const BRICK_CONFIG = {
  sectionWidth: 1.5,
  sections: 3,
  wallHeight: 0.2,
  roofHeight: 1,
  roofPadding: 0.3,
}

const labyrinthConfig = {
  width: 10,
  height: 10,
}

const createContent = (scene) => {
  const material = new StandardMaterial('material', scene);
  const maze = integratedLabyrinth(generateMase(labyrinthConfig.width, labyrinthConfig.height))
  const blocks = buildLabirynthBlocks(scene, BRICK_CONFIG, maze)

  // NOTE: we need asymmetric paddings to get good border after skew
  const paddingsVector = new Vector3(1, 2, 0)
  const box = createBox(blocks, scene, paddingsVector)

  let boxCSG = CSG.FromMesh(box)
  box.dispose()
  blocks.forEach((obj) => {
    const newMeshCSG = CSG.FromMesh(obj)
    boxCSG = boxCSG.subtract(newMeshCSG)
    obj.dispose()
  })

  const newBox = boxCSG.toMesh('box', material, scene, false)
  // this thing allows following update of a mesh.
  // maybe I should keep it inside skew?
  newBox.markVerticesDataAsUpdatable(VertexBuffer.PositionKind, true)
  skewMesh(newBox)
};

export default createContent
