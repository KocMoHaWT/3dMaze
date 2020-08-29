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
  return maximum.subtract(minimum);
};

const tubeMeshPoint = R.curry((radius, perimeter, point) => {
  const { x, y, z } = point;
  // TODO: compare to pivotPoint.X
  const distanceToPivot = x;
  // TODO: compare to pivotPoint.Y
  const depth = y
  const angle = (distanceToPivot / perimeter) * FULL_CIRCLE_RADIANS;
  const xX = Math.cos(angle) * (radius + depth);
  const yY = Math.sin(angle) * (radius + depth);
  const zZ = z;

  const newPotision = new Vector3(xX, yY, zZ);
  return newPotision;
});

// This function is gonna skew some random mesh AROUND specified random AXIS (any possible Vector3).
// Let's pretend this is Oz for now
// Most likely -- I want to do that globally
export const skewMesh = (mesh) => {
  // Okay, so verticles are in local coordinate system for each mesh.
  // in Babylon this thing is called
  mesh.bakeCurrentTransformIntoVertices()
  // Now I need to convert them to Vector a)
  const positions = mesh.getVerticesData(POSITION_KIND)

  // ya, we have vectors now, cool, cool
  const verticles = positionsToVectors(positions);
  // Calculating target radius for a given perimeter
  const size = getMeshSize(mesh);
  const perimeter = size.x;
  const radius = Math.sqrt(perimeter / Math.PI);

  // magically update position of every verticle, lol
  const updatedVerticles = verticles.map(tubeMeshPoint(radius, perimeter))
  const updatedPositions = serializeVerticles(updatedVerticles);

  mesh.updateVerticesData(POSITION_KIND, updatedPositions);
};
