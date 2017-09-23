'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports['default'] = linear;

var defaultConfig = {
  velocity: 20
};

function linear(val, userConfig) {
  var config = _extends({}, defaultConfig, userConfig, { val: val });
  // stepper is used a lot. Saves allocation to return the same array wrapper.
  // This is fine and danger-free against mutations because the callsite
  // immediately destructures it and gets the numbers inside without passing the
  // array reference around.
  var reusedTuple = [0, 0];
  function stepper(secondPerFrame, x) {
    if (Math.abs(x - config.val) < config.velocity) {
      reusedTuple[0] = config.val;
      reusedTuple[1] = 0;
      return reusedTuple;
    }

    var newX = x + (config.val - x > 0 ? config.velocity : -config.velocity);

    reusedTuple[0] = newX;
    reusedTuple[1] = config.velocity;
    return reusedTuple;
  }

  return {
    stepper: stepper,
    val: config.val
  };
}

module.exports = exports['default'];