import { Vector3, VertexBuffer } from '@babylonjs/core';
import { curry } from 'ramda'

//  3 sections brick
//  ----------
//  |  |  |  |  sectionSize (meters)
//  ----------
//  sections (quantity)

const rectangle = curry((xSize, ySize, h, padding) => [
  Vector3(0 + padding, 0 + padding, h),
  Vector3(xSize - padding, 0 + padding, h),
  Vector3(xSize - padding, ySize - padding, h),
  Vector3(0 + padding, ySize - padding, h),
])

const createBrick = (scene, {
  sectionSize = 1,
  sections = 3,
}) => {
  const w = sectionSize
  const l = sectionSize * sections
  const h = 1
  const padding = sectionSize / 3

  const brickLevel = rectangle(l, w)

  const groundPlane = brickLevel(0, 0)
  const middlePlane = brickLevel(h, 0)
  const topPlane = brickLevel(h * 2, padding)
}

export default createBrick
