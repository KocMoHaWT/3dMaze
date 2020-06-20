import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { Engine } from '@babylonjs/core/Engines/engine';
import { HemisphericLight, Color3, CSG, DynamicTexture, SceneLoader, StandardMaterial } from '@babylonjs/core';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { OBJFileLoader } from '@babylonjs/loaders';
import { Scene } from '@babylonjs/core/scene';
import { Vector3 } from '@babylonjs/core/Maths/math';
import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera';
import { renderOBjs } from "./utils/renderObjs";


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

const createCamera = (scene) => {
  const camera = new ArcRotateCamera('Camera', - Math.PI / 2, Math.PI / 2, 20, new Vector3(5, 0, 5), scene);
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

const createGround = (scene) => {
  const wireframeMaterial = new StandardMaterial('wireframe', scene);
  wireframeMaterial.wireframe = true;

  const ground = Mesh.CreateGround('ground', 10, 10, 10, scene, true);
  ground.material = wireframeMaterial;

  return ground;
};

const createScene = () => {
  const scene = new Scene(engine);
  const root = new TransformNode('zaraza', scene);
  const material = new GridMaterial("grid", scene);
  const testMat = new StandardMaterial("myMaterial", scene);
  testMat.diffuseColor = new Color3(0,0,1);
  // testMat.emissiveColor = new Color3(0,0,1);

  createCamera(scene);
  createLight(scene);

  // testSkew(scene);

  SceneLoader.RegisterPlugin(new OBJFileLoader());

  renderOBjs(scene).then(() => {
    // const labyrinthMesh = Mesh.MergeMeshes(scene.getActiveMeshes().data);
    const newMesh = Mesh.MergeMeshes([...scene.getActiveMeshes().data]);
    var box = MeshBuilder.CreateBox("box", {height: 15, width: 20, depth: 2 }, scene);
    box.setPositionWithLocalVector(new Vector3(8,6,1));

    const boxCSG = CSG.FromMesh(box);
    const newMeshCSG = CSG.FromMesh(newMesh);
    const newObj = boxCSG.subtract(newMeshCSG);
    // labyrinthMesh.dispose();
    newMesh.dispose();
    box.dispose();
    newObj.toMesh("csg", testMat, scene, true);

    // newMeshTest.locallyTranslate(new Vector3(4,4,4));

    // const testMesh = CSG.FromMesh(root);
    // showWorldAxis(3, scene);
    // createGround(scene);
  })

  return scene;
};

const scene = createScene();

engine.runRenderLoop(() => {
  scene.render();
});
