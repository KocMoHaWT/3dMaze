import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { Engine } from '@babylonjs/core/Engines/engine';
import { HemisphericLight } from '@babylonjs/core';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { Scene } from '@babylonjs/core/scene';
import { StandardMaterial } from '@babylonjs/core/Materials';
import { Vector3 } from '@babylonjs/core/Maths/math';

import showWorldAxis from './utils/showWorldAxis';
import { skewMesh } from './utils/skewMesh';

const canvas = document.getElementById('renderCanvas');

const engine = new Engine(canvas);

const createCamera = (scene) => {
  const cameraAngle = Math.PI / 4 + Math.PI / 8;
  const camera = new ArcRotateCamera('Camera', cameraAngle, cameraAngle, 16, Vector3.Zero(), scene);
  camera.allowUpsideDown = false;
  camera.attachControl(canvas, true);
  camera.setTarget(Vector3.Zero());
  camera.attachControl(canvas, false);

  return camera;
};

const createLight = (scene) => {
  const light = new HemisphericLight('light1', new Vector3(0, 1, 0), scene);
  return light;
};

const createScene = () => {
  const scene = new Scene(engine);
  createCamera(scene);
  showWorldAxis(3, scene);
  createLight(scene);
  const wireframeMaterial = new StandardMaterial('wireframe', scene);
  wireframeMaterial.wireframe = true;

  const ground = Mesh.CreateGround('ground', 10, 10, 10, scene);
  ground.material = wireframeMaterial;
  skewMesh(ground);

  return scene;
};
const scene = createScene();

engine.runRenderLoop(() => {
  scene.render();
});
