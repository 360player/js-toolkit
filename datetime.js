'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Calendar = undefined;

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DEFAULT_TIMEZONE = 'Europe/Stockholm';

/**
 *  @const string DEFAULT_LOCALE
 */
var DEFAULT_LOCALE = 'en-US';

/**
 *	@type TimeType
 */


/**
 *	@type TimeObjectType
 */


/**
 *	@type MeridiemLocaleType
 */


/**
 *	@type MeridiemType
 */


/**
 *	@type RoundDirectionType
 */


/**
 *	@type LocaleOptionsType
 */

/**
 *	Date manipulation and presentation helper class.
 */
var DateTime = function () {

	/**
  *  Creates a new DateTime instance.
  *
  *  @param Date date
  *	@param bool skipBoundsAggregation
  *	@param bool autoResolveDefaultOptions
  *
  *  @return void
  */


	/**
  *	@var MeridiemLocaleType meridiemLocaleObject
  */


	/**
  *  @var string locale
  */


	/**
  *  @var TimeType endOfMonth
  */


	/**
  *  @var TimeType endOfDay
  */


	/**
  *  @var Date dateTime
  */
	function DateTime(date) {
		var skipBoundsAggregation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
		var autoResolveDefaultOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
		(0, _classCallCheck3.default)(this, DateTime);
		this.timeZone = DEFAULT_TIMEZONE;
		this.locale = DEFAULT_LOCALE;
		this.enforce24hFormat = false;

		this.fromDate(date || new Date(), skipBoundsAggregation);

		if (autoResolveDefaultOptions) {
			this.resolveDateTimeOptions();
		}
	}

	/**
  *	Returns a new instance of DateTime set to current date.
  *
  *	@return DateTime
  */


	/**
  *	@var bool enforce24hFormat
  */


	/**
  *  @var string timeZone
  */


	/**
  *  @var TimeType startOfMonth
  */


	/**
  *  @var TimeType startOfDay
  */


	(0, _createClass3.default)(DateTime, [{
		key: 'resolveDateTimeOptions',


		/**
   *	Sets timezone and locale based on current device resolved options.
   *
   *	@return void
   */
		value: function resolveDateTimeOptions() {
			// @FLOWFIXME https://github.com/facebook/flow/issues/2801
			var _Intl$DateTimeFormat$ = Intl.DateTimeFormat().resolvedOptions(),
			    timeZone = _Intl$DateTimeFormat$.timeZone,
			    locale = _Intl$DateTimeFormat$.locale;

			this.setTimeZone(timeZone);
			this.setLocale(locale);
		}

		/**
   *  Sets current date time object.
   *
   *  @param Date dateTime
   *	@param boolean skipBoundsAggregation
   *
   *  @return void
   */

	}, {
		key: 'fromDate',
		value: function fromDate(dateTime) {
			var skipBoundsAggregation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

			if (dateTime instanceof Date === false) {
				throw new Error('Must be instance of Date');
			}

			// @NOTE Make sure created date is a new date instance
			this.dateTime = new Date(+dateTime);

			if (!skipBoundsAggregation) {
				this.aggregateDateBoundsTimestamps();
			}
		}

		/**
   *  Returns current date time object.
   *
   *  @return Date
   */

	}, {
		key: 'toDate',
		value: function toDate() {
			return this.dateTime;
		}

		/**
   *	Merges date (year, month and date), to merge time use {@see mergeTime} or to change full date use {@see setDate}.
   *
   *	@param Date date
   *
   *	@return void
   */

	}, {
		key: 'mergeDate',
		value: function mergeDate(date) {
			var y = date.getFullYear();
			var m = date.getMonth() + 1;
			var d = date.getDate();

			this.setYear(y);
			this.setMonth(m);
			this.setDay(d);

			this.aggregateDateBoundsTimestamps();
		}

		/**
   *  Sets current time zone.
   *
   *  @param string timeZone
   *
   *  @return void
   */

	}, {
		key: 'setTimeZone',
		value: function setTimeZone(timeZone) {
			this.timeZone = timeZone;
		}

		/**
   *  Returns current time zone.
   *
   *  @return string
   */

	}, {
		key: 'getTimeZone',
		value: function getTimeZone() {
			return this.timeZone;
		}

		/**
   *  Sets current locale.
   *
   *  @param string locale
   *
   *  @return void
   */

	}, {
		key: 'setLocale',
		value: function setLocale(locale) {
			this.locale = locale;
		}

		/**
   *  Returns current locale.
   *
   *  @return string
   */

	}, {
		key: 'getLocale',
		value: function getLocale() {
			return this.locale;
		}

		/**
   *  @prop bool isLeapYear
   */

	}, {
		key: 'aggregateStartAndEndOfDay',


		/**
   *	Calculates and sets start and end of day from input date.
   *
   *	@param Date date
   *
   *	@return void
   */
		value: function aggregateStartAndEndOfDay(date) {
			// @NOTE Get start of current date as timestamp
			date.setHours(0, 0, 0, 0);
			this.startOfDay = +date;

			// @NOTE Get end of current date as timestamp
			date.setHours(23, 59, 59, 999);
			this.endOfDay = +date;
		}

		/**
   *	Calculates and sets start and end of month from input date.
   *
   *	@param Date date
   *
   *	@return void
   */

	}, {
		key: 'aggregateStartAndEndOfMonth',
		value: function aggregateStartAndEndOfMonth(date) {
			// @NOTE Get start of current month as timestamp
			date.setHours(0, 0, 0, 0);
			date.setDate(1);
			this.startOfMonth = +date;

			// @NOTE Get end of current month as timestamp
			date.setHours(23, 59, 59, 999);
			date.setDate(DateTime.getDaysInMonth(date.getFullYear(), date.getMonth() + 1));
			this.endOfMonth = +date;
		}

		/**
   *	Calculates start of, and end of day and month based on instance date.
   *
   *	@return void
   */

	}, {
		key: 'aggregateDateBoundsTimestamps',
		value: function aggregateDateBoundsTimestamps() {
			var date = new Date(+this.dateTime);

			this.aggregateStartAndEndOfDay(date);
			this.aggregateStartAndEndOfMonth(date);
		}

		/**
   *	Aggregates current locale meridiem format.
   *
   *	@return void
   */

	}, {
		key: 'aggregateMeridiemLocaleObject',
		value: function aggregateMeridiemLocaleObject() {
			var am = 'AM';
			var pm = 'PM';
			var prefer12h = true;

			try {
				// @FLOWFIXME https://github.com/facebook/flow/issues/2801
				var formatter = new Intl.DateTimeFormat(this.locale, { hour: 'numeric', hour12: true });
				var dayPeriodFilter = function dayPeriodFilter(n) {
					return n.type.toLowerCase() === 'dayperiod';
				};

				var amDate = new Date(1970, 0, 1, 0, 0, 0, 0);
				am = formatter.formatToParts(amDate).find(dayPeriodFilter).value;

				var pmDate = new Date(1970, 0, 1, 23, 59, 59, 999);
				pm = formatter.formatToParts(pmDate).find(dayPeriodFilter).value;

				var reMeridiem = new RegExp(am + '|' + pm, 'g');
				prefer12h = reMeridiem.test(amDate.toLocaleTimeString(this.locale));
			} catch (error) {
				throw new Error(error);
			}

			var meridiemLocaleObject = { am: am, pm: pm, prefer12h: prefer12h };

			this.meridiemLocaleObject = meridiemLocaleObject;
		}

		/**
   *  Returns the duration of a granularity of time, such as seconds, minutes up to weeks.
   *
   *  @param number value
   *  @param string granularity
   *
   *  @return number
   */

	}, {
		key: 'durationOf',
		value: function durationOf(value, granularity) {
			var granularities = {
				millisecond: 1,
				second: 1000,
				minute: 60000,
				hour: 3600000,
				day: 86400000,
				week: 604800000
			};

			// @NOTE Pluralize granularities
			Object.entries(granularities).forEach(function (_ref) {
				var _ref2 = (0, _slicedToArray3.default)(_ref, 2),
				    key = _ref2[0],
				    value = _ref2[1];

				return granularities[key + 's'] = value;
			});

			if (granularities.hasOwnProperty(granularity)) {
				return granularities[granularity] * Math.abs(value);
			}

			return null;
		}

		/**
   *	Rounds date to nearest granularity.
   *
   *	@param number value
   *  @param string granularity
   *	@param RoundDirectionType roundDirection
   *
   *	@return self
   */

	}, {
		key: 'toNearestGranularity',
		value: function toNearestGranularity(value, granularity) {
			var roundDirection = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'up';

			var duration = this.durationOf(value, granularity);

			if (!duration) {
				throw new Error('Not a valid time granularity.');
			}

			var timestamp = +this.dateTime;
			var roundingMethod = roundDirection === 'up' ? 'ceil' : 'floor';
			var roundBy = Math[roundingMethod];

			var adjustedTimestamp = roundBy(timestamp / duration) * duration;

			if (adjustedTimestamp > this.endOfDay) {
				adjustedTimestamp = this.endOfDay;
			}

			this.dateTime.setTime(adjustedTimestamp);

			return this;
		}

		/**
   *	Sets full year.
   *
   *	@param number fullYear
   *
   *	@return self
   */

	}, {
		key: 'setYear',
		value: function setYear(fullYear) {
			this.dateTime.setFullYear(fullYear);

			return this;
		}

		/**
   *	Returns full year.
   *
   *	@param number fullYear
   *
   *	@return self
   */

	}, {
		key: 'getYear',
		value: function getYear() {
			return this.dateTime.getFullYear();
		}

		/**
   *	Sets month, does not decrement or increment year(s) for current date. Use {@see prev} and {@see next} methods instead.
   *
   *	@param number month
   *
   *	@return DateTime
   */

	}, {
		key: 'setMonth',
		value: function setMonth(month) {
			if (month > 12) month = 12;
			if (month < 1) month = 1;

			if (this.dateTime.getMonth() !== month) {
				this.dateTime.setMonth(month - 1);
				this.aggregateDateBoundsTimestamps();
			}

			return this;
		}

		/**
   *	Returns month number, to get month index use {@see getMonthOffset}.
   *
   *	@return number
   */

	}, {
		key: 'getMonth',
		value: function getMonth() {
			return this.dateTime.getMonth() + 1;
		}

		/**
   *	Returns month offset, to get month number, use {@see getMonth}.
   *
   *	@return number
   */

	}, {
		key: 'getMonthOffset',
		value: function getMonthOffset() {
			return this.dateTime.getMonth();
		}

		/**
   *	Sets day for current month. Just like {@see setMonth} it does not adjust date if outside of current month bounds.
   *	To increment or decrement date, use {@see prev} or {@see next} instead.
   *
   *	@param number day
   *
   *	@return self
   */

	}, {
		key: 'setDay',
		value: function setDay(day) {
			var daysInMonth = this.daysInMonth;

			day = Math.ceil(Math.abs(day));

			if (day > daysInMonth) day = daysInMonth;
			if (day < 1) day = 1;

			if (this.dateTime.getDate() !== day) {
				this.dateTime.setDate(day);
				this.aggregateDateBoundsTimestamps();
			}

			return this;
		}

		/**
   *	Returns current day (date).
   *
   *	@return number
   */

	}, {
		key: 'getDay',
		value: function getDay() {
			return this.dateTime.getDate();
		}

		/**
   *	Returns weekday number.
   *
   *	@return number
   */

	}, {
		key: 'getWeekday',
		value: function getWeekday() {
			return this.dateTime.getDay();
		}

		/**
   *	Sets timestamp from UNIX epoch time.
   *
   *	@param number timestamp
   *
   *	@return self
   */

	}, {
		key: 'setTimestamp',
		value: function setTimestamp(timestamp) {
			this.dateTime.setTime(timestamp);

			return this;
		}

		/**
   *	Returns timestamp.
   *
   *	@return number
   */

	}, {
		key: 'getTimestamp',
		value: function getTimestamp() {
			return +this.dateTime;
		}

		/**
   *	Sets time to current DateTime instance.
   *
   *	@param number hour
   *	@param number minute
   *	@param number second
   *	@param number milliSecond
   *
   *	@return self
   */

	}, {
		key: 'setTime',
		value: function setTime(hour) {
			var minute = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;
			var second = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : -1;
			var milliSecond = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : -1;

			var dateTime = this.dateTime;

			if (hour > 23 || hour < 0) {
				hour = dateTime.getHours();
			}

			if (minute > 59 || minute < 0) {
				minute = dateTime.getMinutes();
			}

			if (second > 59 || second < 0) {
				second = dateTime.getSeconds();
			}

			if (milliSecond > 999 || milliSecond < 0) {
				milliSecond = dateTime.getMilliseconds();
			}

			dateTime.setHours(hour, minute, second, milliSecond);

			this.dateTime = dateTime;

			return this;
		}

		/**
   *	Returns {@see TimeObjectType} for current timestamp.
   *
   *	@return TimeObjectType
   */

	}, {
		key: 'getTime',
		value: function getTime() {
			var hour = this.dateTime.getHours();
			var minute = this.dateTime.getMinutes();
			var second = this.dateTime.getSeconds();
			var milliSecond = this.dateTime.getMilliseconds();

			var timeObject = {
				hour: hour,
				minute: minute,
				second: second,
				milliSecond: milliSecond
			};

			return timeObject;
		}

		/**
   *	Returns true if time is AM.
   *
   *	@return boolean
   */

	}, {
		key: 'setTime12h',


		/**
   *	Converts 12h format to 24h format and sets the time accordingly.
   *
   *	@param MeridiemType meridiem
   *	@param number hour
   *	@param number minute
   *	@param number second
   *	@param number milliSecond
   *
   *	@return self
   */
		value: function setTime12h(meridiem, hour) {
			var minute = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : -1;
			var second = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : -1;
			var milliSecond = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : -1;

			var isValidMeridiem = ['am', 'pm'].includes(meridiem);

			if (!isValidMeridiem) {
				throw new Error('Invalid meridiem format, expected "am" or "pm", received "' + meridiem + '".');
			}

			if (meridiem === 'pm') {
				hour += 12;
			}

			return this.setTime(hour, minute, second, milliSecond);
		}

		/**
   *	Returns {@see TimeObjectType} for current timestamp in 12h format.
   *
   *	@return TimeObjectType
   */

	}, {
		key: 'getTime12h',
		value: function getTime12h() {
			var hour = this.dateTime.getHours();
			var minute = this.dateTime.getMinutes();
			var second = this.dateTime.getSeconds();
			var milliSecond = this.dateTime.getMilliseconds();
			var meridiem = hour >= 12 && minute >= 0 && second >= 0 && milliSecond > 0 ? 'pm' : 'am';

			if (hour > 12) {
				hour -= 12;
			}

			var timeObject = {
				hour: hour,
				minute: minute,
				second: second,
				milliSecond: milliSecond,
				meridiem: meridiem
			};

			return timeObject;
		}

		/**
   *	Sets current timestamp to mid-day.
   *
   *	@return self
   */

	}, {
		key: 'setTimeToMidday',
		value: function setTimeToMidday() {
			this.dateTime.setHours(12, 0, 0, 0);

			return this;
		}

		/**
   *	Sets current timestamp to midnight.
   *
   *	@return self
   */

	}, {
		key: 'setTimeToMidnight',
		value: function setTimeToMidnight() {
			this.dateTime.setHours(0, 0, 0, 1);

			return this;
		}

		/**
   *	Merges time, to merge date use {@see mergeDate} or to change full date use {@see setDate}.
   *
   *	@param Date date
   *
   *	@return void
   */

	}, {
		key: 'mergeTime',
		value: function mergeTime(date) {
			var h = date.getHours();
			var m = date.getMinutes();
			var s = date.getSeconds();
			var ms = date.getMilliseconds();

			this.setTime(h, m, s, ms);

			this.aggregateMeridiemLocaleObject();
		}

		/**
   *	Sets date from UNIX timestamp.
   *
   *	@param number unixTimestamp
   *
   *	@return self
   */

	}, {
		key: 'setUnixTimestamp',
		value: function setUnixTimestamp(unixTimestamp) {
			return this.setTimestamp(unixTimestamp * 1000);
		}

		/**
   *	Returns UNIX timestamp.
   *
   *	@return number
   */

	}, {
		key: 'getUnixTimestamp',
		value: function getUnixTimestamp() {
			return Math.ceil(this.getTimestamp() / 1000);
		}

		/**
   *	Validates if input date is before instance date.
   *
   *	@param TimeType timestamp
   *
   *	@return boolean
   */

	}, {
		key: 'isBefore',
		value: function isBefore(timestamp) {
			return this.getTimestamp() <= timestamp;
		}

		/**
   *	Validates if input date is after instance date.
   *
   *	@param TimeType timestamp
   *
   *	@return boolean
   */

	}, {
		key: 'isAfter',
		value: function isAfter(timestamp) {
			return this.getTimestamp() >= timestamp;
		}

		/**
   *	Validates if instance date is between start and end timestamp.
   *
   *	@param Date startDateTime
   *	@param Date endDateTime
   *
   *	@return boolean
   */

	}, {
		key: 'isBetween',
		value: function isBetween(startTimestamp, endTimestamp) {
			return this.isAfter(startTimestamp) && this.isBefore(endTimestamp);
		}

		/**
   *	Validates if input timestamp is within todays time bounds.
   *
   *	@param TimeType timestamp
   *
   *	@return boolean
   */

	}, {
		key: 'sameDay',


		/**
   *	Validates if input timestamp is within bounds of instance date.
   *
   *	@param TimeType timestamp
   *
   *	@return boolean
   */
		value: function sameDay(timestamp) {
			return timestamp >= this.startOfDay && timestamp <= this.endOfDay;
		}

		/**
   *  Decrements nth granularity from date time.
   *
   *  @param string granularity
   *  @param number decrementValue
   *
   *  @return self
   */

	}, {
		key: 'prev',
		value: function prev(granularity) {
			var decrementValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

			if (granularity.match(/years?/)) {
				var prevFullYear = this.dateTime.getFullYear() - Math.abs(Math.ceil(decrementValue));

				this.dateTime.setFullYear(prevFullYear);
			} else if (granularity.match(/months?/)) {
				var prevMonths = this.dateTime.getMonth() - Math.abs(Math.ceil(decrementValue));

				this.dateTime.setMonth(prevMonths);
			} else {
				var _timestamp = this.dateTime.getTime();
				var duration = this.durationOf(decrementValue, granularity);

				this.dateTime = new Date(Math.abs(_timestamp - parseInt(duration)));
			}

			this.aggregateDateBoundsTimestamps();

			return this;
		}

		/**
   *  Increments nth granularity to date time.
   *
   *  @param string granularity
   *  @param number incrementValue
   *
   *  @return self
   */

	}, {
		key: 'next',
		value: function next(granularity) {
			var incrementValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

			if (granularity.match(/years?/)) {
				var nextFullYear = this.dateTime.getFullYear() + Math.abs(Math.ceil(incrementValue));

				this.dateTime.setFullYear(nextFullYear);
			} else if (granularity.match(/months?/)) {
				var nextMonths = this.dateTime.getMonth() + Math.abs(Math.ceil(incrementValue));

				this.dateTime.setMonth(nextMonths);
			} else {
				var _timestamp2 = this.dateTime.getTime();
				var duration = this.durationOf(incrementValue, granularity);

				this.dateTime = new Date(_timestamp2 + parseInt(duration));
			}

			this.aggregateDateBoundsTimestamps();

			return this;
		}

		/**
   *	Returns localized representation of date, assumes instance locale variable.
   *
   *	@param LocaleOptionsType formatOptions
   *
   *	@return string
   */

	}, {
		key: 'toLocaleDateString',
		value: function toLocaleDateString(formatOptions) {
			return this.dateTime.toLocaleDateString(this.locale, formatOptions);
		}

		/**
   *	Returns localized representation of time, assumes instance locale variable.
   *
   *	@param LocaleOptionsType formatOptions
   *
   *	@return string
   */

	}, {
		key: 'toLocaleTimeString',
		value: function toLocaleTimeString(formatOptions) {
			return this.dateTime.toLocaleTimeString(this.locale, formatOptions);
		}
	}, {
		key: 'toCalendarDateString',
		value: function toCalendarDateString() {
			return this.toLocaleDateString({ year: 'numeric', month: 'long' });
		}
	}, {
		key: 'toDateString',
		value: function toDateString() {
			return this.toLocaleDateString({ year: 'numeric', month: 'numeric', day: 'numeric' });
		}
	}, {
		key: 'toLongDateString',
		value: function toLongDateString() {
			return this.toLocaleDateString({ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
		}
	}, {
		key: 'toTimeString',
		value: function toTimeString() {
			return this.toLocaleTimeString({ hour: '2-digit', minute: '2-digit', hour12: !this.enforce24hFormat });
		}
	}, {
		key: 'toLongTimeString',
		value: function toLongTimeString() {
			var enforce24hFormat = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

			return this.toLocaleTimeString({ hour12: !this.enforce24hFormat });
		}
	}, {
		key: 'toWeekdayString',
		value: function toWeekdayString() {
			return this.toLocaleDateString({ weekday: 'short' });
		}
	}, {
		key: 'toLongWeekdayString',
		value: function toLongWeekdayString() {
			return this.toLocaleDateString({ weekday: 'long' });
		}

		/**
   *	Returns current date as string.
   *
   *	@return string
   */

	}, {
		key: 'toString',
		value: function toString() {
			return this.dateTime.toString();
		}
	}, {
		key: 'daysInMonth',


		/**
   *  @prop number daysInMonth
   */
		get: function get() {
			return DateTime.getDaysInMonth(this.dateTime.getFullYear(), this.dateTime.getMonth());
		}
	}, {
		key: 'isAnteMeridiem',
		get: function get() {
			return !this.isPostMeridiem;
		}

		/**
   *	Returns true if time is PM.
   *
   *	@return boolean
   */

	}, {
		key: 'isPostMeridiem',
		get: function get() {
			var _getTime = this.getTime(),
			    hour = _getTime.hour,
			    minute = _getTime.minute,
			    second = _getTime.second,
			    milliSecond = _getTime.milliSecond;

			return hour >= 12 && minute >= 0 && second >= 0 && milliSecond > 0;
		}
	}], [{
		key: 'now',
		value: function now() {
			return new DateTime(new Date());
		}
	}, {
		key: 'isLeapYear',
		value: function isLeapYear(year) {
			return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
		}

		/**
   *  Returns number of days in current year
   */

	}, {
		key: 'daysInYear',
		value: function daysInYear(year) {
			return DateTime.isLeapYear(year) ? 366 : 365;
		}

		/**
   *  Returns the number of days in input month.
   *
   *	@param number year
   *  @param number month
   *
   *  @return number
   */

	}, {
		key: 'getDaysInMonth',
		value: function getDaysInMonth(year, month) {
			var daysInMonths = [31, DateTime.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

			var monthOffset = month - 1;
			if (monthOffset > 11) monthOffset = 11;
			if (monthOffset < 0) monthOffset = 0;

			return daysInMonths[monthOffset];
		}
	}, {
		key: 'isToday',
		value: function isToday(timestamp) {
			var _ref3 = new DateTime(new Date()),
			    startOfDay = _ref3.startOfDay,
			    endOfDay = _ref3.endOfDay;

			return timestamp >= startOfDay && timestamp <= endOfDay;
		}
	}]);
	return DateTime;
}();

/**
 *	@type CalendarDayType
 */


exports.default = DateTime;

/**
 *	@type CalendarMonthType
 */

var Calendar = exports.Calendar = function () {
	function Calendar() {
		(0, _classCallCheck3.default)(this, Calendar);
	}

	(0, _createClass3.default)(Calendar, null, [{
		key: 'generate',


		/**
   *	Generates a multi dimensional array representing a calendar month.
   */
		value: function generate(year, month) {
			var date = new Date(year, month - 1, 1, 12, 0, 0, 0);

			var calendar = [];
			var daysInMonth = DateTime.getDaysInMonth(year, month);
			var startOfMonthWeekday = date.getDay();
			var daysInPreviousMonth = (7 + startOfMonthWeekday - Calendar.weekStartsAtIndex) % 7;
			var calendarWeeksInMonth = Math.ceil((daysInMonth + daysInPreviousMonth) / 7);
			var currentDay = 1 - daysInPreviousMonth;

			for (var week = 0; week < calendarWeeksInMonth; week++) {
				var dateIndex = void 0;

				for (var weekDay = 0; weekDay < 7; weekDay++) {
					dateIndex = weekDay + currentDay;

					var calendarDate = new Date(year, month - 1, dateIndex, 12, 0, 0, 0);

					var calendarDay = {
						isToday: DateTime.isToday(+calendarDate),
						isCurrentMonth: calendarDate.getMonth() === month - 1,
						timestamp: +calendarDate,
						day: calendarDate.getDate()
					};

					calendar.push(calendarDay);
				}

				currentDay += 7;
			}

			return calendar;
		}

		/**
   *	@static number weekStartsAtIndex
   */

	}]);
	return Calendar;
}();

Calendar.weekStartsAtIndex = 1;