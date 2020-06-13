import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { Engine } from '@babylonjs/core/Engines/engine';
import { HemisphericLight, Color3, CSG, DynamicTexture, SceneLoader, StandardMaterial } from '@babylonjs/core';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { OBJFileLoader } from '@babylonjs/loaders';
import { Scene } from '@babylonjs/core/scene';
import { Vector3 } from '@babylonjs/core/Maths/math';
import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera';


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
  createCamera(scene);
  createLight(scene);

  testSkew(scene);

  SceneLoader.RegisterPlugin(new OBJFileLoader());

  const arrPromises = arrayOfPoints.map(() => SceneLoader.AppendAsync('./assets/', 'snaggy-long.obj', scene));
  Promise.all([...arrPromises]).then(() => {
    arrayOfPoints.map((item, index) => {
      const element = scene.getActiveMeshes().data[index];
      element.parent = root;
      if (element) {
        const rotationAngle = Angle.BetweenTwoPoints(new Vector2(...item[0]), new Vector2(...item[1]));
        console.log(rotationAngle)
        element.locallyTranslate(new Vector3(...item[0], 0).multiply(new Vector3(4,4,4))).rotate(new Vector3(0,0,1), rotationAngle.radians());

      }
    })
  }).then(() => {
    showWorldAxis(3, scene);
    createGround(scene);
  });

  return scene;
};

const scene = createScene();

engine.runRenderLoop(() => {
  scene.render();
});
