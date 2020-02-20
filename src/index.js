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
  FreeCamera
} from "@babylonjs/core/Cameras/freeCamera";
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

// Required side effects to populate the Create methods on the mesh class. Without this, the bundle would be smaller but the createXXX methods from mesh would not be accessible.
import "@babylonjs/core/Meshes/meshBuilder";
import "@babylonjs/core/Materials/standardMaterial"

// Get the canvas element from the DOM.
const canvas = document.getElementById("renderCanvas");
const engine = new Engine(canvas);

const createScene = function () {

  const scene = new Scene(engine);
  const material = new GridMaterial("grid", scene);

  const camera = new FreeCamera("camera", new Vector3(0, 5, -100), scene);
  camera.setTarget(Vector3.Zero());
  camera.attachControl(canvas, false);
  const light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);

  const myShape = [
    new Vector3(0, 5, 0),
    new Vector3(1, 1, 0),
    new Vector3(5, 0, 0),
    new Vector3(1, -1, 0),
    new Vector3(0, -5, 0),
    new Vector3(-1, -1, 0),
    new Vector3(-5, 0, 0),
    new Vector3(-1, 1, 0)
  ];


  myShape.push(myShape[0]);
  const item = (x, y, c = []) => ({ x, y, children: c })
  const testObj = {
    width: 5,
    height: 5,
    path: item(0, 0, [
      item(1, 0, [
        item(1,1, [
          item(1,2, [
            item(0,2), item(2,2)
          ])
        ])
      ])
    ])
  };

  const secondObj = {
    width: 20,
    height: 20,
    path: item(0, 1, [
      // 1
      item(1, 1, [
        // 2
        item(1,2, [
          // 3
          item(1,3, [
            // 4
            item(2,3,[
              // 5
              item(2,4,[
                //6
                item(2,5,[
                  //7
                  item(2,6,[
                    //8
                    item(2,7,[
                      //9
                      item(2,8,[
                        //10
                        item(1,8),
                        //11
                        item(2,9,[
                          //12
                          item(3,9,[
                            ////16
                            item(3,11)
                          ]),
                          //13
                          item(2,10,[
                            //14
                            item(2,11,[
                              //15
                              item(1,11),
                              //16
                              item(3,11,[
                                //17
                                item(3,12,[
                                  //18
                                  item(3,13,[
                                    //19
                                    item(4,13,[
                                      //20
                                      item(5,13,[
                                        //21
                                        item(5,12,[
                                          //22
                                          item(5,11,[
                                            //23
                                            item(4,11,[
                                              ////16
                                              item(3,11)
                                            ]),
                                            //24
                                            item(5,10,[
                                              //25
                                              item(5,9,[
                                                //26
                                                item(5,8,[
                                                  //27
                                                  item(4,8,[
                                                    //28
                                                    item(4,7,[
                                                      //29
                                                      item(4,6,[
                                                        //30
                                                        item(5,6),
                                                        //31
                                                        item(4,5,[
                                                          //32
                                                          item(3,5,[
                                                            ////6
                                                            item(2,5)
                                                          ]),
                                                          //33
                                                          item(4,4,[
                                                            //34
                                                            item(4,3,[
                                                              //35
                                                              item(4,2,[
                                                                //36
                                                                item(4,1,[
                                                                  //37
                                                                  item(3,1,[
                                                                    //38
                                                                    item(2,1,[
                                                                      ////
                                                                      item(1, 1)
                                                                    ])
                                                                  ])
                                                                ])
                                                              ])
                                                            ])
                                                          ])
                                                        ])
                                                      ])
                                                    ])
                                                  ])
                                                ])
                                              ])
                                            ])
                                          ])
                                        ])
                                      ])
                                    ])
                                  ])
                                ])
                              ])
                            ])
                          ])
                        ])
                      ])
                    ])
                  ])
                ])
              ])
            ])
          ])
        ])
      ])
    ])
  };



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
    if (!item.children || !item.children.length) {
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

  const scale = 10;
  const snagToVectorArray = (snag) => {
    return snag.map(([x, y]) => new Vector3(x * scale, y * scale, 0))
  };

  const buildMesh = (vectorArray) => MeshBuilder.ExtrudeShape("star", {shape: myShape, path: vectorArray, sideOrientation: Mesh.DOUBLESIDE, updatable: true}, scene);
  const arrayOfSnagsVectors = arrayOfSnags
    .map(snagToVectorArray)
    .map((vector) => {
      buildMesh(vector);
      buildMesh.material = material;
    });

  const ground = Mesh.CreateGround("ground1", 6, 6, 2, scene);

  ground.material = material;

  return scene;
};

const scene = createScene();
engine.runRenderLoop(() => {
  scene.render();

});

