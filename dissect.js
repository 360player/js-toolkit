'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

exports.default = dissect;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *	Dissects a single source object into a dissected object, and a remaining object.
 *
 *	@param MixedObjectType sourceObject
 *	@param string, ... omitKeys
 *
 *	@return [ MixedObjectType, MixedObjectType ]
 */
function dissect(sourceObject) {
	for (var _len = arguments.length, dissectKeys = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
		dissectKeys[_key - 1] = arguments[_key];
	}

	var remainingObject = {};
	var dissectedObject = {};
	var sourceKeys = Object.keys(sourceObject);

	// @NOTE Compare if source object keys and dissect keys are the same, throw error
	var compareKeys = function compareKeys(key, n) {
		return key === dissectKeys[n];
	};

	if (sourceKeys.length === dissectKeys.length && sourceKeys.every(compareKeys)) {
		throw new Error('dissect: Trying to dissect into same as source object.');
	}

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = Object.entries(sourceObject)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var _step$value = (0, _slicedToArray3.default)(_step.value, 2),
			    key = _step$value[0],
			    value = _step$value[1];

			if (dissectKeys.includes(key)) {
				dissectedObject[key] = value;
			} else {
				remainingObject[key] = value;
			}
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator.return) {
				_iterator.return();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}

	return [dissectedObject, remainingObject];
}

/* @type-dependencies */