import { Vector3, Mesh, VertexData } from '@babylonjs/core'
import { curry } from 'ramda'

import { serializeVerticles } from './index'

//  3 sections brick
//  ----------
//  |  |  |  |  sectionWidth (meters)
//  ----------
//  sections (quantity)

const v3 = (...args) => new Vector3(...args)
const offsetVector = (o) => new Vector3(o, o, 0)

// const rectangle = curry((offset, xSize, ySize, h, padding) => [
//   v3(padding, padding, h).add(offsetVector(offset)),
//   v3(xSize - padding, padding, h).add(offsetVector(offset)),
//   v3(xSize - padding, ySize - padding, h).add(offsetVector(offset)),
//   v3(padding, ySize - padding, h).add(offsetVector(offset)),
// ])

const rectangle = (offset, xSize, ySize, h, padding) => [
  v3(padding, padding, h).add(offsetVector(offset)),
  v3(xSize - padding, padding, h).add(offsetVector(offset)),
  v3(xSize - padding, ySize - padding, h).add(offsetVector(offset)),
  v3(padding, ySize - padding, h).add(offsetVector(offset)),
];

// indices -- counter clockwise
const triangulate = ([a, b, c, d]) => [a, c, b, a, d, c]

const createBrick = (scene, {
  sectionWidth = 1,
  sections = 3,
  wallHeight = 0.2,
  roofHeight = 1,
  roofPadding = 0.3,
}) => {
  const w = sectionWidth
  const l = sectionWidth * sections
  const offset = sectionWidth / -2

  const brickLevel = rectangle(offset, l, w)

  // const groundPlane = brickLevel(0, 0)
  const groundPlane = rectangle(offset, l, w, 0, 0)
  // const middlePlane = brickLevel(wallHeight, 0)
  const middlePlane = rectangle(offset, l, w, wallHeight, 0)
  // const topPlane = brickLevel(wallHeight + roofHeight, roofPadding)
  const topPlane = rectangle(offset, l, w, wallHeight + roofHeight, roofPadding)
  const positions = serializeVerticles([
    ...groundPlane,
    ...middlePlane,
    ...topPlane,
  ])

  const indices = [
    ...triangulate([0, 3, 2, 1]),

    ...triangulate([0, 1, 5, 4]),
    ...triangulate([1, 2, 6, 5]),
    ...triangulate([2, 3, 7, 6]),
    ...triangulate([3, 0, 4, 7]),

    ...triangulate([4, 5, 9, 8]),
    ...triangulate([5, 6, 10, 9]),
    ...triangulate([6, 7, 11, 10]),
    ...triangulate([7, 4, 8, 11]),

    ...triangulate([8, 9, 10, 11]),
  ]

  // WTF
  // const uvs = []
  const uvs = [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0]

  const normals = []
  VertexData.ComputeNormals(positions, indices, normals)

  const vertexData = new VertexData()

  vertexData.positions = positions
  vertexData.indices = indices
  vertexData.normals = normals
  vertexData.uvs = uvs

  const mesh = new Mesh('custom-mesh', scene)
  vertexData.applyToMesh(mesh, true)
  mesh.convertToFlatShadedMesh()

  return mesh
}

export default createBrick
