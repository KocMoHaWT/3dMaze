import { Vector3, VertexBuffer } from '@babylonjs/core';
import * as R from 'ramda';
import { serializeVerticles } from './index';

const FULL_CIRCLE_RADIANS = Math.PI * 2;
const POSITION_KIND = VertexBuffer.PositionKind;

const createVector = ([x, y, z]) => new Vector3(x, y, z);
const subdivide = R.curry(function group(n, list) {
  return R.isEmpty(list) ? [] : R.prepend(R.take(n, list), group(n, R.drop(n, list)));
});

export const positionsToVectors = R.pipe(subdivide(3), R.map(createVector));

export const getMeshSize = (mesh) => {
  const boundingInfo = mesh.getBoundingInfo();
  const { minimum, maximum } = boundingInfo;
  const { x, y, z } = maximum.subtract(minimum);

  return { width: x, heigth: y, depth: z };
};

const tubeMeshPoint = R.curry((radius, perimeter, point) => {
  const { x, y, z } = point;
  // TODO: compare to pivotPoint.X
  const distanceToPivot = x;
  const angle = (distanceToPivot / perimeter) * FULL_CIRCLE_RADIANS;
  const xX = Math.cos(angle) * radius;
  const yY = Math.sin(angle) * radius;
  const zZ = z;

  const newPotision = new Vector3(xX, yY, zZ);
  return newPotision;
});

export const skewMesh = (mesh) => {
  const positions = mesh.getVerticesData(POSITION_KIND);
  const verticles = positionsToVectors(positions);
  const size = getMeshSize(mesh);
  const { width: perimeter } = size;
  const radius = Math.sqrt(perimeter / Math.PI);

  const updatedVerticles = verticles.map(tubeMeshPoint(radius, perimeter));
  const updatedPositions = serializeVerticles(updatedVerticles);
  mesh.updateVerticesData(POSITION_KIND, updatedPositions);
};
