import { Vector3, Mesh, VertexData } from '@babylonjs/core'
import { curry } from 'ramda'

import { serializeVerticles } from './index'

//  3 sections brick
//  ----------
//  |  |  |  |  sectionSize (meters)
//  ----------
//  sections (quantity)

const rectangle = curry((xSize, ySize, h, padding) => [
  new Vector3(0 + padding, 0 + padding, h),
  new Vector3(xSize - padding, 0 + padding, h),
  new Vector3(xSize - padding, ySize - padding, h),
  new Vector3(0 + padding, ySize - padding, h),
])

// indices -- counter clockwise
const triangulate = ([a, b, c, d]) => [a, c, b, a, d, c]

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
  const positions = serializeVerticles([
    ...groundPlane,
    ...middlePlane,
    ...topPlane,
  ])

  const indices = [
    ...triangulate([0, 3, 2, 1]), // ground

    ...triangulate([0, 1, 5, 4]), // level 1 front wall
    ...triangulate([1, 2, 6, 5]), // level 1 left wall
    ...triangulate([2, 3, 7, 6]), // level 1 back wall
    ...triangulate([3, 0, 4, 7]), // level 1 right wall

    ...triangulate([4, 5, 9, 8]), // level 2 front wall
    ...triangulate([5, 6, 10, 9]), // level 2 left wall
    ...triangulate([6, 7, 11, 10]), // level 2 back wall
    ...triangulate([7, 4, 8, 11]), // level 2 right wall

    ...triangulate([8, 9, 10, 11]), // top
  ]

  // WTF
  const uvs = []
  // const uvs = [0, 1, 0, 0, 1, 0]

  const normals = []
  VertexData.ComputeNormals(positions, indices, normals)

  const vertexData = new VertexData()

  vertexData.positions = positions
  vertexData.indices = indices
  vertexData.normals = normals
  vertexData.uvs = uvs

  const mesh = new Mesh('custom-mesh', scene)
  vertexData.applyToMesh(mesh)

  return mesh
}

export default createBrick
