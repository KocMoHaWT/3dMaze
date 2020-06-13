import { Mesh, StandardMaterial } from '@babylonjs/core';

import { skewMesh } from '../utils/skewMesh';

const createContent = (scene) => {
  const wireframeMaterial = new StandardMaterial('wireframe', scene);
  wireframeMaterial.wireframe = true;

  const ground = Mesh.CreateGround('ground', 10, 10, 10, scene, true);
  ground.material = wireframeMaterial;
  skewMesh(ground);

  const ground2 = Mesh.CreateGround('ground', 10, 10, 10, scene, true);
  ground2.material = wireframeMaterial;
};

export default createContent;
