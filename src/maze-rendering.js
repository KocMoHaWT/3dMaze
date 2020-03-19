// import 'babylonjs-loaders';
import {
  Engine
} from "@babylonjs/core/Engines/engine";
import {
  Scene
} from "@babylonjs/core/scene";
import {
  Vector3
} from "@babylonjs/core/Maths/math";
import {
  FreeCamera,
} from "@babylonjs/core/Cameras/freeCamera";
import {
  ArcRotateCamera
} from "@babylonjs/core/Cameras/arcRotateCamera"
import {
  HemisphericLight
} from "@babylonjs/core/Lights/hemisphericLight";
import {
  Mesh
} from "@babylonjs/core/Meshes/mesh";

import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import {
  GridMaterial
} from "@babylonjs/materials/grid";
import { CSG, SceneLoader } from "@babylonjs/core";
import { OBJExport } from "@babylonjs/serializers/OBJ";
// Required side effects to populate the Create methods on the mesh class. Without this, the bundle would be smaller but the createXXX methods from mesh would not be accessible.
import "@babylonjs/core/Meshes/meshBuilder";
import "@babylonjs/core/Materials/standardMaterial";
import { OBJFileLoader } from  "babylonjs-loaders";
import labyrinth from './labyrinth'
// Get the canvas element from the DOM.
const canvas = document.getElementById("renderCanvas");
const engine = new Engine(canvas);

const createScene = function () {

  const scene = new Scene(engine);
  const material = new GridMaterial("grid", scene);

  // const camera = new FreeCamera("camera", new Vector3(0, 5, -100), scene);
  const  camera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 4, Vector3.Zero(), scene);
  camera.attachControl(canvas, true);
  camera.setTarget(Vector3.Zero());
  camera.attachControl(canvas, false);
  const light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);

  const myShape = [
    new Vector3(0, 5, 0),
    new Vector3(1, 1, 0),
    new Vector3(5, 0, 0),
    new Vector3(1, -1, 0),
  ];
  var radius = 5;
  var tes = 120;
  var pi2 = Math.PI * 2;
  var step = pi2 / tes;
  var path = [];
  for (var i = 0; i < pi2; i += step ) {
    var x = radius * Math.sin(i);
    var z = 0;
    var y = radius * Math.cos(i);
    path.push( new Vector3(x, y, z) );
  }
  path.push(path[0]);

  myShape.push(myShape[0]);

  const secondObj = labyrinth;

  const otherPoint = (obj, parent) => ({x: obj.x, y: obj.y, parentX: parent.x, parentY: parent.y})
  let processingStack = [secondObj.path];
  let arrayOfSnags = [];
  let snag = [];

  const createSnag = (startPoint) => {
    return [startPoint];
  };

  // const closeSnag = (snag, arrayOfSnags) => {
  //     arrayOfSnags.push(snag);
  //     return arrayOfSnags;
  // }

  const processElement = (snag, item) => {
    snag.push([item.x, item.y]);
    return snag;
  };
  const stackElementChildren = (processingStack, item) => {
    const children = item.children;
    children.forEach(childItem => processingStack.push({ ...childItem, parent: item }));
    return processingStack;
  };

  const createSnagIfNeeded = (snag, item) => {
    const { parent } = item;
    return !snag ? createSnag([parent.x, parent.y]) : snag;
  };

  const closeSnagIfNeeded = (snag, item, arrayOfSnags) => {
    const children = item.children;
    if (!children || !children.length || children.length > 1) {
      arrayOfSnags.push(snag);
      return [ null, arrayOfSnags ];
    }
    return [snag ,arrayOfSnags];
  };

  while (processingStack.length) {
    const item = processingStack.pop();
    snag = createSnagIfNeeded(snag, item);
    snag = processElement(snag, item);
    processingStack = stackElementChildren(processingStack, item);
    [snag, arrayOfSnags] = closeSnagIfNeeded(snag, item, arrayOfSnags);
  }

  const scale = 20;
  const snagToVectorArray = (snag) => {
    return snag.map(([x, y]) => new Vector3(x * scale, y * scale, 0))
  };

  // const buildMesh = (vectorArray) => MeshBuilder.ExtrudeShape("star", {shape: path, path: vectorArray, sideOrientation: Mesh.DOUBLESIDE, updatable: true}, scene);
  // const arrayOfSnagsVectors = arrayOfSnags
  //   .map(snagToVectorArray)
  //   .map((vector) => {
  //     buildMesh(vector);
  //     buildMesh.material = material;
  //   });

  // const ground = Mesh.CreateGround("ground1", 6, 6, 2, scene);


  /// test code

  // var box = MeshBuilder.CreateBox("box", {height: 12, width: 10, depth: 10}, scene);
  // var sphere = MeshBuilder.CreateSphere("sphere", {diameterX: 5, diameterY: 5, diameterZ: 5}, scene);
  // var myPlane =  MeshBuilder.CreateBox("box", {height: 10, width: 30, depth: 30}, scene);
  // myPlane.setPositionWithLocalVector(new Vector3(2,2,2));
  // box.setPositionWithLocalVector(new Vector3(2.5,2.5,2.5));
  // sphere.setPositionWithLocalVector(new Vector3(8,2,2.5));
  // const myPlaneCSG = CSG.FromMesh(myPlane);
  // const boxCSG = CSG.FromMesh(box);
  // const sphereCSG = CSG.FromMesh(sphere);
  // const boxWithSphereResultCSG = boxCSG.union(sphereCSG);
  // const planeSubstract = myPlaneCSG.subtract(boxWithSphereResultCSG);
  // resultCSG.toMesh("csg", material, scene);
  // const meshPlane = planeSubstract.toMesh("plane", material, scene);
  // console.log(OBJExport)
//   const obj = OBJExport.OBJ([meshPlane],false, "", true)
//   var saveBlob = (function () {
//     var a = document.createElement("a");
//     document.body.appendChild(a);
//     a.style = "display: none";
//     return function (blob, fileName) {
//         var url = window.URL.createObjectURL(blob);
//         a.href = url;
//         a.download = fileName;
//         a.click();
//         window.URL.revokeObjectURL(url);
//     };
// }());



// saveBlob(new Blob([obj]), 'test.obj');
  // console.log(obj);
  // OBJExport.ObjAsync(scene, "fileName1").then((obj) => {
  //   obj.downloadFiles();
  // });


  //OBJ([planeSubstract], true, material, true)
// delete them from scene
  // box.dispose();
  // sphere.dispose();
  // myPlane.dispose();

  // ground.material = material;
  // SceneLoader.ImportMesh("", "/", "snaggy.obj", scene, function (meshes) {
  //   scene.createDefaultCameraOrLight(true, true, true);
  //   scene.createDefaultEnvironment();
  // });
  //   SceneLoader.Append("", "snaggy.obj",scene, function (scene) {
  const obj = new OBJFileLoader()
  //
  // });

  return scene;
};
const scene = createScene();



engine.runRenderLoop(() => {
  scene.render();
});
