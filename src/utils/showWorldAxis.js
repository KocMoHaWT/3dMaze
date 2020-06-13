import { Color3, DynamicTexture, StandardMaterial } from '@babylonjs/core';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { Vector3 } from '@babylonjs/core/Maths/math';

const makeTextPlane = (text, color, size, scene) => {
  const dynamicTexture = new DynamicTexture('DynamicTexture', 50, scene, true);
  dynamicTexture.hasAlpha = true;
  dynamicTexture.drawText(text, 5, 40, 'bold 36px Arial', color, 'transparent', true);
  const plane = Mesh.CreatePlane('TextPlane', size, scene, true);
  plane.material = new StandardMaterial('TextPlaneMaterial', scene);
  plane.material.backFaceCulling = false;
  plane.material.specularColor = new Color3(0, 0, 0);
  plane.material.diffuseTexture = dynamicTexture;
  return plane;
};

const showWorldAxis = (size, scene) => {
  const axisX = Mesh.CreateLines('axisX', [
    Vector3.Zero(), new Vector3(size, 0, 0), new Vector3(size * 0.95, 0.05 * size, 0),
    new Vector3(size, 0, 0), new Vector3(size * 0.95, -0.05 * size, 0),
  ], scene);
  axisX.color = new Color3(1, 0, 0);
  const xChar = makeTextPlane('X', 'red', size / 10, scene);
  xChar.position = new Vector3(0.9 * size, -0.05 * size, 0);
  const axisY = Mesh.CreateLines('axisY', [
    Vector3.Zero(), new Vector3(0, size, 0), new Vector3(-0.05 * size, size * 0.95, 0),
    new Vector3(0, size, 0), new Vector3(0.05 * size, size * 0.95, 0),
  ], scene);
  axisY.color = new Color3(0, 1, 0);
  const yChar = makeTextPlane('Y', 'green', size / 10, scene);
  yChar.position = new Vector3(0, 0.9 * size, -0.05 * size);
  const axisZ = Mesh.CreateLines('axisZ', [
    Vector3.Zero(), new Vector3(0, 0, size), new Vector3(0, -0.05 * size, size * 0.95),
    new Vector3(0, 0, size), new Vector3(0, 0.05 * size, size * 0.95),
  ], scene);
  axisZ.color = new Color3(0, 0, 1);
  const zChar = makeTextPlane('Z', 'blue', size / 10, scene);
  zChar.position = new Vector3(0, 0.05 * size, 0.9 * size);
};

export default showWorldAxis;
