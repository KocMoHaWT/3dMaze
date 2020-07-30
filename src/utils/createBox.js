import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { Mesh } from '@babylonjs/core';

const createBox = (objs, scene) => {
  const singleMeshOfObjs = Mesh.MergeMeshes(objs);
  const boxSize = singleMeshOfObjs.getBoundingInfo().boundingBox;
  const meshSize = boxSize.maximum.subtract(boxSize.minimum);
  const meshOffset = singleMeshOfObjs.getBoundingInfo().boundingBox.center;
  console.log(boxSize);

  const box = MeshBuilder.CreateBox('box', { height: meshSize.y, width: meshSize.x, depth: meshSize.z }, scene);
  box.setPositionWithLocalVector({ ...meshOffset, z: meshOffset.z + 0.5 });
  return box;
};

export default createBox;
