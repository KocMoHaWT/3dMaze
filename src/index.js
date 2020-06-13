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


const canvas = document.getElementById('renderCanvas');

const engine = new Engine(canvas);

function showWorldAxis(size, scene) {
  var makeTextPlane = function(text, color, size) {
    var dynamicTexture = new DynamicTexture("DynamicTexture", 50, scene, true);
    dynamicTexture.hasAlpha = true;
    dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color , "transparent", true);
    var plane = Mesh.CreatePlane("TextPlane", size, scene, true);
    plane.material = new StandardMaterial("TextPlaneMaterial", scene);
    plane.material.backFaceCulling = false;
    plane.material.specularColor = new Color3(0, 0, 0);
    plane.material.diffuseTexture = dynamicTexture;
    return plane;
  };
  var axisX = Mesh.CreateLines("axisX", [
    Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new Vector3(size * 0.95, 0.05 * size, 0),
    new Vector3(size, 0, 0), new Vector3(size * 0.95, -0.05 * size, 0)
  ], scene);
  axisX.color = new Color3(1, 0, 0);
  var xChar = makeTextPlane("X", "red", size / 10);
  xChar.position = new Vector3(0.9 * size, -0.05 * size, 0);
  var axisY = Mesh.CreateLines("axisY", [
    Vector3.Zero(), new Vector3(0, size, 0), new Vector3( -0.05 * size, size * 0.95, 0),
    new Vector3(0, size, 0), new Vector3( 0.05 * size, size * 0.95, 0)
  ], scene);
  axisY.color = new Color3(0, 1, 0);
  var yChar = makeTextPlane("Y", "green", size / 10);
  yChar.position = new Vector3(0, 0.9 * size, -0.05 * size);
  var axisZ = Mesh.CreateLines("axisZ", [
    Vector3.Zero(), new Vector3(0, 0, size), new Vector3( 0 , -0.05 * size, size * 0.95),
    new Vector3(0, 0, size), new Vector3( 0, 0.05 * size, size * 0.95)
  ], scene);
  axisZ.color = new Color3(0, 0, 1);
  var zChar = makeTextPlane("Z", "blue", size / 10);
  zChar.position = new Vector3(0, 0.05 * size, 0.9 * size);
};

// const moveObj = (element) => {
//
// };
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

  SceneLoader.RegisterPlugin(new OBJFileLoader());

const createScene = () => {
  const scene = new Scene(engine);
  const root = new TransformNode('zaraza', scene);
  createCamera(scene);
  createLight(scene);
  const wireframeMaterial = new StandardMaterial('wireframe', scene);
  wireframeMaterial.wireframe = true;

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
    const ground = Mesh.CreateGround('ground', 10, 10, 10, scene);
    ground.material = wireframeMaterial;
  
  });

  return scene;
};
const scene = createScene();

engine.runRenderLoop(() => {
  scene.render();
});
