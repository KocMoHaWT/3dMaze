import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { Mesh } from '@babylonjs/core';

const createBox = (objs, scene, paddings) => {
  const singleMeshOfObjs = Mesh.MergeMeshes(objs, false);
  const boxSize = singleMeshOfObjs.getBoundingInfo().boundingBox;
  const meshSize = boxSize.maximum.subtract(boxSize.minimum);
  const meshOffset = singleMeshOfObjs.getBoundingInfo().boundingBox.center;
  const sizeWithPaddings = meshSize.add(paddings);
  console.log(boxSize);

  const box = MeshBuilder.CreateBox('box', {
    updatable: true,
    height: sizeWithPaddings.y,
    width: sizeWithPaddings.x,
    depth: sizeWithPaddings.z + 2,
  }, scene);
  box.setPositionWithLocalVector({ ...meshOffset, z: meshOffset.z + 1.5 });
  singleMeshOfObjs.dispose();
  return box;
};

export default createBox;
