import { Vector3, MeshBuilder, StandardMaterial } from '@babylonjs/core';

import { skewMesh } from '../utils/skewMesh';
import createBrick from '../utils/createBrick';

const BRICK_CONFIG = {
  sectionWidth: 1.5,
  sections: 3,
  wallHeight: 0.2,
  roofHeight: 1,
  roofPadding: 0.3,
}

const createContent = (scene) => {
  const wireframeMaterial = new StandardMaterial('wireframe', scene);
  wireframeMaterial.wireframe = true;

  const ground = MeshBuilder.CreateCylinder('cyl', {
    updatable: true,
    subdivisions: 20,
    height: 10,
  }, scene);
  ground.material = wireframeMaterial;
  ground.locallyTranslate(new Vector3(5, 0.5, 0))
  ground.rotate(new Vector3(0, 0, 1), Math.PI / 2)
  skewMesh(ground)
};

export default createContent;
