import '@babylonjs/core/Materials/standardMaterial';
import '@babylonjs/core/Meshes/meshBuilder';

import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { Engine } from '@babylonjs/core/Engines/engine';
import {
  HemisphericLight, StandardMaterial,
} from '@babylonjs/core';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { Scene } from '@babylonjs/core/scene';
import { Vector3 } from '@babylonjs/core/Maths/math';

import showWorldAxis from './utils/showWorldAxis';

// import createContent from './demos/testSkew';
import createContent from './demos/testFullCycle';

const canvas = document.getElementById('renderCanvas');

const engine = new Engine(canvas);

const createCamera = (scene) => {
  const camera = new ArcRotateCamera('Camera', -Math.PI / 2, Math.PI / 2, 20, new Vector3(5, 0, 5), scene);
  camera.allowUpsideDown = false;
  camera.attachControl(canvas, true);
  camera.setTarget(new Vector3(5, 0, 5));
  camera.attachControl(canvas, false);

  return camera;
};

const createLight = (scene) => {
  const light = new HemisphericLight('light1', new Vector3(0.5, 1, 0.25), scene);
  return light;
};

const createGround = (scene) => {
  const wireframeMaterial = new StandardMaterial('wireframe', scene);
  wireframeMaterial.wireframe = true;

  const ground = Mesh.CreateGround('ground', 10, 10, 10, scene, true);
  ground.material = wireframeMaterial;

  return ground;
};

const createScene = () => {
  const scene = new Scene(engine);

  createCamera(scene);
  createLight(scene);

  createContent(scene);

  showWorldAxis(3, scene);
  // createGround(scene);

  return scene;
};

const scene = createScene();

engine.runRenderLoop(() => {
  scene.render();
});
