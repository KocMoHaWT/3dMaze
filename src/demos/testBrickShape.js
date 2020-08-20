import { StandardMaterial } from '@babylonjs/core';

import createBrick from '../utils/createBrick';

const createContent = (scene) => {
  const wireframeMaterial = new StandardMaterial('wireframe', scene);
  // wireframeMaterial.wireframe = true;

  const mesh = createBrick(scene, {
    sections: 3,
    sectionWidth: 1,
    wallHeight: 0.2,
    roofHeight: 1,
  });
  mesh.material = wireframeMaterial;
};

export default createContent;
