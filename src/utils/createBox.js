import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { Mesh } from '@babylonjs/core';

const createBox = (objs, scene, paddings) => {
  const singleMeshOfObjs = Mesh.MergeMeshes(objs, false);
  const boxSize = singleMeshOfObjs.getBoundingInfo().boundingBox;
  const meshSize = boxSize.maximum.subtract(boxSize.minimum);
  const meshOffset = singleMeshOfObjs.getBoundingInfo().boundingBox.center;
  const sizeWithPaddings = meshSize.add(paddings);

  const box = MeshBuilder.CreateBox('box', {
    updatable: true,
    height: sizeWithPaddings.y,
    width: sizeWithPaddings.x,
    depth: sizeWithPaddings.z - 0.05,
  }, scene);
  box.setPositionWithLocalVector({ ...meshOffset, z: 1000 });
  singleMeshOfObjs.dispose();
  return box;
};

export default createBox;
