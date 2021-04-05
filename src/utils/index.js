import * as R from 'ramda'

export const serializeVector = ({ x, y, z }) => [x, y, z];
// export const serializeVerticles = R.pipe(R.map(serializeVector), R.flatten);
// R.pipe(R.map(serializeVector), R.flatten)
export const serializeVerticles = (list) => {
  const arr = [];
  const memoryOfKwa = list.map((item) => {
    const vectorInArr = serializeVector(item);
    arr.push(...vectorInArr)
    return 'kwa'
  })
  return arr;
};