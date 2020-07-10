import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder";
import {Mesh} from "@babylonjs/core";

const createBox = (objs, scene) => {
  const singleMeshOfObjs = Mesh.MergeMeshes(objs);
  const meshSize = singleMeshOfObjs.getBoundingInfo().boundingBox.maximum;
  const meshOffset = singleMeshOfObjs.getBoundingInfo().boundingBox.extendSize;
  console.log(singleMeshOfObjs.getBoundingInfo().boundingBox);
  const box = MeshBuilder.CreateBox("box", {height: meshSize.y + 1, width: meshSize.x + 1, depth: meshSize.z }, scene);
  box.setPositionWithLocalVector({ ...meshOffset,x: meshOffset.x - 1.5 , z: meshOffset.z - .5});
  return box;
}

export default createBox;
