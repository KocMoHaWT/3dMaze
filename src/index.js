import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { Engine } from '@babylonjs/core/Engines/engine';
import { HemisphericLight, SceneLoader } from '@babylonjs/core';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { OBJFileLoader } from '@babylonjs/loaders';
import { Scene } from '@babylonjs/core/scene';
import { StandardMaterial } from '@babylonjs/core/Materials';
import { Vector3 } from '@babylonjs/core/Maths/math';

import showWorldAxis from './utils/showWorldAxis';

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

  SceneLoader.RegisterPlugin(new OBJFileLoader());

  Promise.all([
    SceneLoader.AppendAsync('./assets/', 'snaggy.obj', scene),
    SceneLoader.AppendAsync('./assets/', 'snaggy.obj', scene),
  ]).then(() => {
    scene.getActiveMeshes().data[0].rotate(new Vector3(0, 0, 1), Math.PI / 2);
  });

  const ground = Mesh.CreateGround('ground', 10, 10, 10, scene);
  ground.material = wireframeMaterial;

  return scene;
};
const scene = createScene();

engine.runRenderLoop(() => {
  scene.render();
});
