export const serializeVector = ({ x, y, z }) => [x, y, z];
export const serializeVerticles = R.pipe(R.map(serializeVector), R.flatten);
