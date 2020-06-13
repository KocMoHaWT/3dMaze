import { VertexBuffer } from '@babylonjs/core';

export const getSkewedTargetAngle = () => {}

export const skewMesh = (mesh) => {
  const positions = mesh.getVerticesData(VertexBuffer.PositionKind);
  const normals = mesh.getVerticesData(VertexBuffer.NormalKind);
  const colors = mesh.getVerticesData(VertexBuffer.ColorKind);
  const uvs = mesh.getVerticesData(VertexBuffer.UVKind);
  const indices = mesh.getIndices();

  console.log({ positions, normals,
colors,
uvs,
indices, });
};
