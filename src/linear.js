/* @flow */
import type {LinearHelperConfig} from './Types';

const defaultConfig = {
  velocity: 20,
};

export default function linear(val: number, userConfig?: LinearHelperConfig) {
  const config = {...defaultConfig, ...userConfig, val};
  // stepper is used a lot. Saves allocation to return the same array wrapper.
  // This is fine and danger-free against mutations because the callsite
  // immediately destructures it and gets the numbers inside without passing the
  // array reference around.
  let reusedTuple: [number, number] = [0, 0];
  function stepper(
    secondPerFrame: number,
    x: number): [number, number] {
    if (Math.abs(x - config.val) < config.velocity) {
      reusedTuple[0] = config.val;
      reusedTuple[1] = 0;
      return reusedTuple;
    }

    const newX = x + ((config.val - x) > 0 ? config.velocity : -config.velocity);

    reusedTuple[0] = newX;
    reusedTuple[1] = config.velocity;
    return reusedTuple;
  }

  return {
    stepper,
    val: config.val,
  };
}
