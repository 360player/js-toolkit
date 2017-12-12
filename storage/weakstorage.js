"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *	@const WeakMap weakStorage
 */
var weakStorage = new WeakMap();

/**
 *	@private
 *	Returns {@see StorageDataMapType}.
 *
 *	@param WeakStorage context
 *
 *	@return StorageDataMapType
 */


/**
 *	@type StorageDataMapType
 */
function getStore(context) {
  var storageDataMap = weakStorage.get(context);

  if (storageDataMap === null || storageDataMap === undefined) {
    var emptyStorageDataMap = {};
    storageDataMap = emptyStorageDataMap;
  }

  return storageDataMap;
}

/**
 *	@private
 *	Clear storage.
 *
 *	@param WeakStorage context
 *
 *	@return void
 */
function clearStore(context) {
  var emptyStorageDataMap = {};
  weakStorage.set(context, emptyStorageDataMap);
}

/**
 *	@private
 *	Sets item to storage.
 *
 *	@param WeakStorage context
 *	@param string key
 *	@param mixed data
 *
 *	@return void
 */
function _setItem(context, key, data) {
  var storageDataMap = getStore(context);
  storageDataMap[key] = data;
  weakStorage.set(context, storageDataMap);
}

/**
 *	@private
 *	Retrieves item from storage.
 *
 *	@param WeakStorage context
 *	@param string key
 *
 *	@return void
 */
function _getItem(context, key) {
  var storageDataMap = getStore(context);

  if (storageDataMap.hasOwnProperty(key) === true) {
    return storageDataMap[key];
  }

  return null;
}

/**
 *	@private
 *	Removes item from storage.
 *
 *	@param WeakStorage context
 *	@param string key
 *
 *	@return void
 */
function _removeItem(context, key) {
  var storageDataMap = getStore(context);

  if (storageDataMap.hasOwnProperty(key) === true) {
    delete storageDataMap[key];
    weakStorage.set(context, storageDataMap);
  }
}

/**
 *	Storage API wrapper for WeakMap
 */

var WeakStorage = function () {

  /**
   *	Creates a new empty weak store.
   *
   *	@return void
   */
  function WeakStorage() {
    (0, _classCallCheck3.default)(this, WeakStorage);

    clearStore(this);
  }

  (0, _createClass3.default)(WeakStorage, [{
    key: "setItem",
    value: function setItem(key, data) {
      _setItem(this, key, data);
    }
  }, {
    key: "getItem",
    value: function getItem(key) {
      return _getItem(this, key);
    }
  }, {
    key: "removeItem",
    value: function removeItem(key) {
      _removeItem(this, key);
    }
  }, {
    key: "clear",
    value: function clear() {
      clearStore(this);
    }
  }, {
    key: "length",
    get: function get() {
      var storageDataMap = getStore(this);
      return Object.keys(storageDataMap).length;
    }
  }]);
  return WeakStorage;
}();

exports.default = WeakStorage;