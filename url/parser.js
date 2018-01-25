'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _unserialize = require('../unserialize');

var _unserialize2 = _interopRequireDefault(_unserialize);

var _serialize = require('../serialize');

var _serialize2 = _interopRequireDefault(_serialize);

var _associate = require('../associate');

var _associate2 = _interopRequireDefault(_associate);

var _omit = require('../omit');

var _omit2 = _interopRequireDefault(_omit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *	@const RegExp REGEX_LOOKUP_PATTERN
 */


/* @type-dependencies */


/**
 *	@type ParserParamsType
 */


/**
 *	@type ParserMatchType
 */


/* @dependencies */
var REGEX_LOOKUP_PATTERN = /(\:[^\/]+)/g;

/**
 *	@const RegExp REGEX_REPLACE_PATTERN
 */
var REGEX_REPLACE_PATTERN = /\:([^\/]+)/;

/**
 *	@const string REGEX_LOOKUP_CAPTURE
 */
var REGEX_LOOKUP_CAPTURE = '([^\/]+)';

/**
 *	@const RegExp REGEX_LOOKUP_QUERY
 */
var REGEX_LOOKUP_QUERY = /\S[^?]*(?:\?+|$)/g;

/**
 *	URL parser and matcher
 */

var Parser = function () {
	function Parser() {
		(0, _classCallCheck3.default)(this, Parser);
	}

	(0, _createClass3.default)(Parser, [{
		key: 'clean',


		/**
   *	Removes excessive forward slashes.
   *
   *	@param string uriPath
   *
   *	@return string
   */
		value: function clean(uriPath) {
			return uriPath.replace(/\/+/g, '/').replace(/\/+$/, '');
		}

		/**
   *	Converts URI path to RegExp.
   *
   *	@param string uriPattern
   *
   *	@return RegExp
   */

	}, {
		key: 'getPatternRegExp',
		value: function getPatternRegExp(uriPattern) {
			var pattern = this.clean('/' + uriPattern).replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&').replace(REGEX_LOOKUP_PATTERN, function (match) {
				return REGEX_LOOKUP_CAPTURE;
			});

			return new RegExp('^' + pattern + '$', 'i');
		}

		/**
   *	Transforms URI path and populates parameters in that path.
   *
   *	@param string uriPattern
   *	@param ParserParamsType uriParams
   *
   *	@return string
   */

	}, {
		key: 'transform',
		value: function transform(uriPattern) {
			var uriParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			var omitKeys = [];

			var replaceMatch = function replaceMatch(match, key) {
				if (uriParams.hasOwnProperty(key) === true) {
					omitKeys.push(key);
					// @FLOWFIXME https://github.com/facebook/flow/issues/2221
					return uriParams[key];
				}

				return '';
			};

			var transformedUrl = this.clean(uriPattern).replace(REGEX_REPLACE_PATTERN, replaceMatch);
			var queryString = (0, _serialize2.default)(_omit2.default.apply(undefined, [uriParams].concat(omitKeys)));
			var urlSuffix = queryString.length > 0 ? '?' + queryString : '';

			return this.clean(transformedUrl + urlSuffix);
		}

		/**
   *	Parses URI using URI pattern.
   *
   *	@param string uriPattern
   *	@param string uriPath
   *
   *	@return ParserResultType
   */

	}, {
		key: 'parse',
		value: function parse(uriPattern, uriPath) {
			var uriPatternRegex = this.getPatternRegExp(uriPattern);
			var parameterMatches = uriPattern.match(REGEX_LOOKUP_PATTERN);
			var uriMatches = uriPath.match(REGEX_LOOKUP_QUERY);

			var parserResult = {
				match: false,
				path: uriPath,
				pattern: uriPattern,
				params: {},
				query: {}
			};

			if (uriMatches !== null && uriMatches !== undefined) {
				if (uriMatches.length <= 1) {
					uriMatches.push('', '');
				}

				var _uriMatches$map = uriMatches.map(function (match) {
					return match.replace('?', '');
				}),
				    _uriMatches$map2 = (0, _slicedToArray3.default)(_uriMatches$map, 2),
				    parsedUriPath = _uriMatches$map2[0],
				    parsedUriQuery = _uriMatches$map2[1];

				var parsedUriMatches = parsedUriPath.match(uriPatternRegex);

				// @NOTE Update 'path' without eventual query string
				if (typeof parsedUriPath === 'string') {
					parserResult.path = parsedUriPath;
				}

				// @NOTE Unserialize query string if it exists
				if (typeof parsedUriQuery === 'string' && parsedUriQuery.length > 0) {
					var uriQueryObject = (0, _unserialize2.default)(parsedUriQuery);
					parserResult.query = uriQueryObject;
				}

				if (parsedUriMatches !== null && parsedUriMatches !== undefined) {
					parserResult.match = true;

					// @NOTE Filter out any non strings and remove full match from result
					var filteredMatches = parsedUriMatches.filter(function (match) {
						return typeof match === 'string';
					}).slice(1);

					var hasFilteredMatches = filteredMatches !== null && filteredMatches !== undefined;
					var hasParameterMatches = parameterMatches !== null && parameterMatches !== undefined;

					if (hasFilteredMatches === true && hasParameterMatches === true) {
						// @FLOWFIXME Flow does not play nice with maybe types, supress Flow error (which will never occur).
						var keys = parameterMatches.map(function (match) {
							return match.replace(':', '');
						});
						var values = filteredMatches.map(_unserialize.unserializeValue);

						var matchParams = (0, _associate2.default)(keys, values);

						parserResult.params = matchParams;
					}
				}
			}

			return parserResult;
		}
	}]);
	return Parser;
}();

exports.default = Parser;