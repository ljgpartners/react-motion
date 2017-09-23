/* @flow */
import presets from './presets';
import type {SpringHelperConfig} from './Types';

const defaultConfig = {
  ...presets.noWobble,
  precision: 0.01,
};

export default function spring(val: number, userConfig?: SpringHelperConfig) {
  const config = {...defaultConfig, ...userConfig, val};
  // stepper is used a lot. Saves allocation to return the same array wrapper.
  // This is fine and danger-free against mutations because the callsite
  // immediately destructures it and gets the numbers inside without passing the
  // array reference around.
  let reusedTuple: [number, number] = [0, 0];
  function stepper(
    secondPerFrame: number,
    x: number,
    v: number): [number, number] {
    // Spring stiffness, in kg / s^2

    // for animations, destX is really spring length (spring at rest). initial
    // position is considered as the stretched/compressed position of a spring
    const Fspring = -config.stiffness * (x - config.val);

    // Damping, in kg / s
    const Fdamper = -config.damping * v;

    // usually we put mass here, but for animation purposes, specifying mass is a
    // bit redundant. you could simply adjust k and b accordingly
    // let a = (Fspring + Fdamper) / mass;
    const a = Fspring + Fdamper;

    const newV = v + a * secondPerFrame;
    const newX = x + newV * secondPerFrame;

    if (Math.abs(newV) < config.precision && Math.abs(newX - config.val) < config.precision) {
      reusedTuple[0] = config.val;
      reusedTuple[1] = 0;
      return reusedTuple;
    }

    reusedTuple[0] = newX;
    reusedTuple[1] = newV;
    return reusedTuple;
  }

  return {
    stepper,
    val: config.val,
  };
}
