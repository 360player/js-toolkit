'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = associate;


/**
 *	Combines two arrays of equal size into a literal object.
 *
 *	@param array keys
 *	@param array values
 *
 *	@return AssociationType
 */
function associate(keys, values) {
  var targetObject = {};

  if (keys.length !== values.length) {
    throw new RangeError('Keys and value arrays must match in size.');
  }

  return keys.reduce(function (target, key, index) {
    target[key] = values[index];
    return target;
  }, targetObject);
}

/**
 *	@type AssociationType
 */