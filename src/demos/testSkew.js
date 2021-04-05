import { Vector3, MeshBuilder, StandardMaterial } from '@babylonjs/core';

import { skewMesh } from '../utils/skewMesh';

const createContent = (scene) => {
  const wireframeMaterial = new StandardMaterial('wireframe', scene);
  wireframeMaterial.wireframe = true;

  const ground = MeshBuilder.CreateCylinder('cyl', {
    updatable: true,
    subdivisions: 20,
    height: 10,
  }, scene);
  // ground.material = wireframeMaterial;
  ground.locallyTranslate(new Vector3(5, 0.5, 0))
  ground.rotate(new Vector3(0, 0, 1), Math.PI / 2)
  console.log('ground', ground);
  skewMesh(ground)
};

export default createContent;
