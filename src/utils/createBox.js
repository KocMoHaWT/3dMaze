import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { Mesh, StandardMaterial } from '@babylonjs/core';

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
    depth: sizeWithPaddings.z + 1,
  }, scene);

  // const material = new StandardMaterial('material', scene);
  // material.wireframe = true;
  // box.material = material

  // @NOTE: this fucking _z is a new key for Offset.
  //        dunno what's going on, check dependencies, kinda version UP
  const transition = { ...meshOffset, _z: meshOffset.z + 0.95 }
  box.setPositionWithLocalVector(transition);
  singleMeshOfObjs.dispose();
  return box;
};

export default createBox;
