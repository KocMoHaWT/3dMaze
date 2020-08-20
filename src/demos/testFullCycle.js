import { CSG, Vector3 } from '@babylonjs/core';

import buildLabirynthBlocks from '../utils/buildLabirynthBlocks';
import labyrinthModel from '../labyrinth'

const BRICK_CONFIG = {
  sectionWidth: 1,
  sections: 3,
  wallHeight: 0.2,
  roofHeight: 1,
  roofPadding: 0.3,
}

const createContent = (scene) => {
  const blocks = buildLabirynthBlocks(scene, BRICK_CONFIG, labyrinthModel)

  // NOTE: we need assymetric paddings to get good border after skew
  const paddingsVector = new Vector3(1, 2, 0)
  const box = createBox(blocks, scene, paddingsVector)

  let boxCSG = CSG.FromMesh(box)
  blocks.forEach((obj, i) => {
    const newMeshCSG = CSG.FromMesh(obj)
    boxCSG = boxCSG.subtract(newMeshCSG)
    // obj.dispose()
  })

  const newBox = boxCSG.toMesh('box', testMat, scene, false)
  box.dispose()

  blocks.forEach((obj) => obj.dispose())
};

export default createContent
