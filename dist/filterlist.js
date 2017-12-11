'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = filterList;

var _levenshtein = require('./levenshtein');

var _levenshtein2 = _interopRequireDefault(_levenshtein);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *	Filters an array of strings using {@see levenshtein}.
 *
 *	@param array list
 *	@param string keyword
 *	@param number minDistance
 *
 *	@return array
 */
function filterList(list, keyword) {
  var minDistance = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

  if (minDistance < 2) minDistance = 1;

  return list.filter(function (item) {
    return item;
  }).filter(function (item) {
    return (0, _levenshtein2.default)(keyword, item) <= minDistance;
  });
}

/* @dependencies */