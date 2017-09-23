'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports['default'] = spring;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _presets = require('./presets');

var _presets2 = _interopRequireDefault(_presets);

var defaultConfig = _extends({}, _presets2['default'].noWobble, {
  precision: 0.01
});

function spring(val, userConfig) {
  var config = _extends({}, defaultConfig, userConfig, { val: val });
  // stepper is used a lot. Saves allocation to return the same array wrapper.
  // This is fine and danger-free against mutations because the callsite
  // immediately destructures it and gets the numbers inside without passing the
  // array reference around.
  var reusedTuple = [0, 0];
  function stepper(secondPerFrame, x, v) {
    // Spring stiffness, in kg / s^2

    // for animations, destX is really spring length (spring at rest). initial
    // position is considered as the stretched/compressed position of a spring
    var Fspring = -config.stiffness * (x - config.val);

    // Damping, in kg / s
    var Fdamper = -config.damping * v;

    // usually we put mass here, but for animation purposes, specifying mass is a
    // bit redundant. you could simply adjust k and b accordingly
    // let a = (Fspring + Fdamper) / mass;
    var a = Fspring + Fdamper;

    var newV = v + a * secondPerFrame;
    var newX = x + newV * secondPerFrame;

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
    stepper: stepper,
    val: config.val
  };
}

module.exports = exports['default'];