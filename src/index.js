import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { Engine } from '@babylonjs/core/Engines/engine';
import { HemisphericLight, Color3, CSG, DynamicTexture, SceneLoader, StandardMaterial } from '@babylonjs/core';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { OBJFileLoader } from '@babylonjs/loaders';
import { Scene } from '@babylonjs/core/scene';
import { Vector3 } from '@babylonjs/core/Maths/math';
import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera';
import { renderOBjs } from "./utils/renderObjs";
import createBox from "./utils/createBox";


import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { GridMaterial } from '@babylonjs/materials/grid';
import { OBJExport } from '@babylonjs/serializers/OBJ';
import '@babylonjs/core/Meshes/meshBuilder';
import '@babylonjs/core/Materials/standardMaterial';
import arrayOfPoints from "./labyrinth";
import { Angle, Vector2, TransformNode } from 'babylonjs';

import showWorldAxis from './utils/showWorldAxis';
import testSkew from './demos/testSkew';

const canvas = document.getElementById('renderCanvas');

const engine = new Engine(canvas);

const OBJ_FILE_NAME = 'coffin.obj';

const createCamera = (scene) => {
  const camera = new ArcRotateCamera('Camera', - Math.PI / 2, Math.PI / 2, 20, new Vector3(5, 0, 5), scene);
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
  const testMat = new StandardMaterial("myMaterial", scene);

  createCamera(scene);
  createLight(scene);

  SceneLoader.RegisterPlugin(new OBJFileLoader());

  renderOBjs(scene, OBJ_FILE_NAME).then(() => {
    // const newMesh = Mesh.MergeMeshes([...scene.getActiveMeshes().data]);
    const objs = scene.getActiveMeshes().data.map(x => x);
    //
    // var box = MeshBuilder.CreateBox("box", {height: 16, width: 20, depth: 3 }, scene);
    // box.setPositionWithLocalVector(new Vector3(8,6,2.05));

    // NOTE: we need assymetric paddings to get good border after skew
    const paddingsVector = new Vector3(1, 2, 0);
    const box = createBox(objs, scene, paddingsVector);

    let boxCSG = CSG.FromMesh(box);
    objs.forEach((obj, i) => {
      const newMeshCSG = CSG.FromMesh(obj);
      boxCSG = boxCSG.subtract(newMeshCSG);
      // obj.dispose();
    });

    const newBox = boxCSG.toMesh("box", testMat, scene, false);
    box.dispose();

    objs.forEach(obj => obj.dispose());
  });
  return scene;
};

const scene = createScene();

engine.runRenderLoop(() => {
  scene.render();
});
