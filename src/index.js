import { Engine } from '@babylonjs/core/Engines/engine';
import { Scene } from '@babylonjs/core/scene';
import { Vector3 } from '@babylonjs/core/Maths/math';
import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera';
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera'
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { GridMaterial } from '@babylonjs/materials/grid';
import { CSG, SceneLoader } from '@babylonjs/core';
import { OBJExport } from '@babylonjs/serializers/OBJ';
import '@babylonjs/core/Meshes/meshBuilder';
import '@babylonjs/core/Materials/standardMaterial';
import { OBJFileLoader } from  'babylonjs-loaders';

const canvas = document.getElementById('renderCanvas');
const engine = new Engine(canvas);

const createScene = function () {

  const scene = new Scene(engine);
  const material = new GridMaterial('grid', scene);

  // const camera = new FreeCamera('camera', new Vector3(0, 5, -100), scene);
  const  camera = new ArcRotateCamera('Camera', Math.PI / 2, Math.PI / 2, 4, Vector3.Zero(), scene);
  camera.attachControl(canvas, true);
  camera.setTarget(Vector3.Zero());
  camera.attachControl(canvas, false);
  const light = new HemisphericLight('light1', new Vector3(0, 1, 0), scene);

  SceneLoader.RegisterPlugin(new OBJFileLoader())

  Promise.all([
    SceneLoader.AppendAsync('./assets/', 'snaggy.obj', scene),
    SceneLoader.AppendAsync('./assets/', 'snaggy.obj', scene),
  ]).then(() => {
    scene.meshes.data[0].rotate(new Vector3(0, 0, 1), Math.PI / 2)
  })

  return scene;
};
const scene = createScene();

engine.runRenderLoop(() => {
  scene.render();
});
