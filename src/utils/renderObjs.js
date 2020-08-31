import { SceneLoader } from '@babylonjs/core';
import { Angle, Vector2 } from 'babylonjs';
import { Vector3 } from '@babylonjs/core/Maths/math';
import integratedLabyrinth from '../mazeGenerator/generator/integrateMase';
import generateMase from '../mazeGenerator/generator';
import constants from '../mazeGenerator/constants';

export const renderOBjs = (scene, filename) => {
  const arrPromises = Array(constants.CELL_COUNT).fill(null).map(() => SceneLoader.AppendAsync('./assets/', filename, scene));
  return Promise.all([...arrPromises]).then(() => {
    integratedLabyrinth(generateMase()).map((item, index) => {
      const element = scene.getActiveMeshes().data[index];
      if (element) {
        // eslint-disable-next-line max-len
        const rotationAngle = Angle.BetweenTwoPoints(new Vector2(...item[0]), new Vector2(...item[1]));
        element.locallyTranslate(new Vector3(...item[0], 0)
          .multiply(new Vector3(4, 4, 0)))
          .rotate(new Vector3(0, 0, 1), rotationAngle.radians())
          .rotate(new Vector3(1, 0, 0), Math.PI / 2);
      }
    });
  });
};
