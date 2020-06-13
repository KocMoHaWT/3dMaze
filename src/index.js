import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { Engine } from '@babylonjs/core/Engines/engine';
import { HemisphericLight } from '@babylonjs/core';
import { Scene } from '@babylonjs/core/scene';
import { Vector3 } from '@babylonjs/core/Maths/math';

import showWorldAxis from './utils/showWorldAxis';
import testSkew from './demos/testSkew';

const canvas = document.getElementById('renderCanvas');

const engine = new Engine(canvas);

const createCamera = (scene) => {
  const cameraAngle = Math.PI / 4 + Math.PI / 8;
  const camera = new ArcRotateCamera('Camera', cameraAngle, cameraAngle, 16, new Vector3(5, 0, 5), scene);
  camera.allowUpsideDown = false;
  camera.attachControl(canvas, true);
  camera.setTarget(new Vector3(5, 0, 5));
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

  testSkew(scene);

  return scene;
};

const scene = createScene();

engine.runRenderLoop(() => {
  scene.render();
});
