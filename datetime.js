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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *	Date manipulation and presentation helper class.
 */


/**
 *	@type CalendarDateType
 */
var DateTime = function () {

	/**
  *  Creates a new DateTime instance.
  *
  *  @param Date dateTime
  *  @param bool autoResolveDefaultOptions
  *
  *  @return void
  */


	/**
  *	@var number weekStartsAtIndex
  */


	/**
  *  @var string timeZone
  */


	/**
  *  @var Date startOfMonth
  */


	/**
  *  @var Date startOfDay
  */
	function DateTime(dateTime) {
		var autoResolveDefaultOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
		(0, _classCallCheck3.default)(this, DateTime);
		this.timeZone = 'Europe/Stockholm';
		this.locale = 'en-US';
		this.weekStartsAtIndex = 1;
		this.meridiemLocaleObject = {
			am: 'AM',
			pm: 'PM',
			prefer12h: true
		};

		this.fromDate(dateTime);

		if (autoResolveDefaultOptions === true) {
			// @FLOWFIXME https://github.com/facebook/flow/issues/2801
			var _Intl$DateTimeFormat$ = Intl.DateTimeFormat().resolvedOptions(),
			    timeZone = _Intl$DateTimeFormat$.timeZone,
			    locale = _Intl$DateTimeFormat$.locale;

			this.setTimeZone(timeZone);
			this.setLocale(locale);
		}
	}

	/**
  *	Shallow clone of current instance.
  *
  *	@return DateTime
  */


	/**
  *	@var MeridiemLocaleType meridiemLocaleObject
  */


	/**
  *  @var string locale
  */


	/**
  *  @var Date endOfMonth
  */


	/**
  *  @var Date endOfDay
  */


	/**
  *  @var Date dateTime
  */


	(0, _createClass3.default)(DateTime, [{
		key: 'clone',
		value: function clone() {
			var clonedDateTime = new DateTime(new Date(+this.dateTime));
			clonedDateTime.setTimeZone(this.getTimeZone());
			clonedDateTime.setLocale(this.getLocale());
			clonedDateTime.aggregateDateTime();

			return clonedDateTime;
		}

		/**
   *	Aggregates start/end-of data based on current set date.
   *
   *	@return void
   */

	}, {
		key: 'aggregateDateTime',
		value: function aggregateDateTime() {
			var startOfDay = new Date(+this.dateTime);
			startOfDay.setHours(0, 0, 0, 1);
			this.startOfDay = startOfDay;

			var endOfDay = new Date(+this.dateTime);
			endOfDay.setHours(23, 59, 59, 999);
			this.endOfDay = endOfDay;

			var startOfMonth = new Date(+this.dateTime);
			startOfMonth.setHours(0, 0, 0, 1);
			startOfMonth.setDate(1);
			this.startOfMonth = startOfMonth;

			var daysInMonth = this.getDaysInMonth(this.dateTime.getMonth());

			var endOfMonth = new Date(+this.dateTime);
			endOfMonth.setHours(23, 59, 59, 999);
			endOfMonth.setDate(daysInMonth);
			this.endOfMonth = endOfMonth;

			this.aggregateMeridiemLocaleObject();
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
				var formatter = new Intl.DateTimeFormat(this.locale, {
					timeZone: 'UTC',
					hour: 'numeric',
					hour12: true
				});

				var dayPeriodFilter = function dayPeriodFilter(n) {
					return n.type.toLowerCase() === 'dayperiod';
				};

				var amDate = new Date('1970-01-01T09:00:01Z');
				var amParts = formatter.formatToParts(amDate).find(dayPeriodFilter);
				am = amParts && amParts.value ? amParts.value : am;

				var pmDate = new Date('1970-01-01T12:00:01Z');
				var pmParts = formatter.formatToParts(pmDate).find(dayPeriodFilter);
				pm = pmParts && pmParts.value ? pmParts.value : pm;

				var reMeridiem = new RegExp(am + '|' + pm, 'g');
				prefer12h = reMeridiem.test(pmDate.toLocaleTimeString(this.locale, { timeZone: 'UTC' }));
			} catch (error) {
				console.error(error);
			}

			var meridiemLocaleObject = {
				am: am, pm: pm, prefer12h: prefer12h
			};

			this.meridiemLocaleObject = meridiemLocaleObject;
		}

		/**
   *  Sets current date time object.
   *
   *  @param Date dateTime
   *
   *  @return void
   */

	}, {
		key: 'fromDate',
		value: function fromDate() {
			var dateTime = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

			if (!dateTime) {
				dateTime = new Date();
			}

			if (dateTime instanceof Date === false) {
				throw new Error('Must be instance of Date');
			}

			this.dateTime = dateTime;
			this.aggregateDateTime();
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
			this.aggregateMeridiemLocaleObject();
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
		key: 'getDaysInMonth',


		/**
   *  Returns the number of days in input month.
   *
   *  @param number monthOffset
   *
   *  @return number
   */
		value: function getDaysInMonth(monthOffset) {
			var daysInMonths = [31, this.isLeapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

			if (monthOffset > 11) monthOffset = 11;
			if (monthOffset < 0) monthOffset = 0;

			return daysInMonths[monthOffset];
		}

		/**
   *  @prop number daysInMonth
   */

	}, {
		key: 'durationOf',


		/**
   *  Returns the duration of a granularity of time, such as seconds, minutes up to weeks.
   *
   *  @param number value
   *  @param string granularity
   *
   *  @return number
   */
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
				var timestamp = this.dateTime.getTime();
				var duration = this.durationOf(decrementValue, granularity);

				this.dateTime = new Date(Math.abs(timestamp - parseInt(duration)));
			}

			this.aggregateDateTime();

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
				var timestamp = this.dateTime.getTime();
				var duration = this.durationOf(incrementValue, granularity);

				this.dateTime = new Date(timestamp + parseInt(duration));
			}

			this.aggregateDateTime();

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

			this.dateTime.setMonth(month - 1);

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

			this.dateTime.setDate(day);

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
   *	Returns an array of date strings for current month.
   *
   *	@return Array<string>
   */

	}, {
		key: 'getDays',
		value: function getDays() {
			var y = this.getYear();
			var m = this.getMonth();
			var d = void 0;

			var daysInMonth = Array(this.daysInMonth).fill('');
			daysInMonth = daysInMonth.map(function (n) {
				d = (n + 1).toString().padStart(2, '0');
				return y + '-' + m + '-' + d + 'T12:00:00Z';
			});

			return daysInMonth;
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
		value: function setTime() {
			var hour = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
			var minute = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
			var second = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
			var milliSecond = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

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
   *	Sets current timestamp to mid-day.
   *
   *	@return self
   */

	}, {
		key: 'setTimeToMidday',
		value: function setTimeToMidday() {
			return this.setTime(12, 0, 0, 0);
		}

		/**
   *	Sets current timestamp to midnight.
   *
   *	@return self
   */

	}, {
		key: 'setTimeToMidnight',
		value: function setTimeToMidnight() {
			return this.setTime(0, 0, 0, 1);
		}

		/**
   *	Converts 12h format to 24h format and sets the time accordingly.
   *
   *	@param string meridiem
   *	@param number hour
   *	@param number minute
   *	@param number second
   *	@param number milliSecond
   *
   *	@return self
   */

	}, {
		key: 'setTimeFrom12hFormat',
		value: function setTimeFrom12hFormat(meridiem) {
			var hour = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
			var minute = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
			var second = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
			var milliSecond = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

			var isValidMeridiem = ['am', 'pm'].includes(meridiem);

			if (!isValidMeridiem) {
				throw new Error('Invalid meridiem format, expected "am" or "pm", received "' + meridiem + '".');
			}

			hour = hour > 24 ? 24 : hour;

			if (meridiem === 'am' && hour > 12) {
				hour -= 12;
			} else if (meridiem === 'pm' && hour <= 12) {
				hour += 12;
			}

			return this.setTime(hour, minute, second, milliSecond);
		}

		/**
   *	Validates if current DateTime is between two dates.
   *
   *	@param Date startDateTime
   *	@param Date endDateTime
   *
   *	@return boolean
   */

	}, {
		key: 'isBetween',
		value: function isBetween(startDateTime, endDateTime) {
			var startDateTimestamp = startDateTime.getTime();
			var endDateTimestamp = endDateTime.getTime();
			var currentTimestamp = this.dateTime.getTime();

			return currentTimestamp >= startDateTimestamp && currentTimestamp <= endDateTimestamp;
		}

		/**
   *	Validates if input date is before current DateTime.
   *
   *	@param Date dateTime
   *
   *	@return boolean
   */

	}, {
		key: 'isBefore',
		value: function isBefore(dateTime) {
			var startDateTimestamp = this.dateTime.getTime();
			var endDateTimestamp = dateTime.getTime();

			return startDateTimestamp <= endDateTimestamp;
		}

		/**
   *	Validates if input date is after current DateTime.
   *
   *	@param Date dateTime
   *
   *	@return boolean
   */

	}, {
		key: 'isAfter',
		value: function isAfter(dateTime) {
			var startDateTimestamp = this.dateTime.getTime();
			var endDateTimestamp = dateTime.getTime();

			return startDateTimestamp >= endDateTimestamp;
		}

		/**
   *	Validates if input date is today.
   *
   *	@param Date dateTime
   *
   *	@return boolean
   */

	}, {
		key: 'sameDay',


		/**
   *	Validates if input date is same as instance date.
   *
   *	@param Date dateTime
   *
   *	@return boolean
   */
		value: function sameDay(dateTime) {
			var currentDateTime = this.clone().setTimeToMidday().toDate();
			var adjustedDateTime = new DateTime(dateTime).setTimeToMidday().toDate();

			return +currentDateTime === +adjustedDateTime;
		}

		/**
   *	Returns an array of {@see CalendarDateType}
   *
   *	@return array
   */

	}, {
		key: 'getCalendar',
		value: function getCalendar() {
			var calendar = [];
			var weekStartsAt = this.weekStartsAtIndex;
			var daysInPreviousMonth = (7 + this.startOfMonth.getDay() - weekStartsAt) % 7;
			var calendarWeeks = Math.ceil((this.daysInMonth + daysInPreviousMonth) / 7);
			var currentDay = 1 - daysInPreviousMonth;
			var weekDays = void 0;
			var date = void 0;

			for (var week = 0; week < calendarWeeks; week++) {
				weekDays = [];
				var dateIndex = void 0;

				for (var weekDay = 0; weekDay < 7; weekDay++) {
					dateIndex = weekDay + currentDay;
					date = this.clone().setTimeToMidday();
					date.dateTime.setDate(dateIndex);

					var _sameMonth = dateIndex >= 1 && dateIndex <= this.daysInMonth;

					weekDays.push({
						dateTime: date,
						isToday: DateTime.isToday(date.toDate()),
						sameMonth: _sameMonth
					});
				}

				currentDay += 7;
				calendar.push(weekDays);
			}

			return calendar;
		}

		/**
   *	Returns localized calendar date (month and year).
   *
   *	@return string
   */

	}, {
		key: 'toCalendarDateString',
		value: function toCalendarDateString() {
			return this.dateTime.toLocaleDateString(this.locale, {
				year: 'numeric',
				month: 'long'
			});
		}

		/**
   *	Returns localized time string.
   *
   *	@return string
   */

	}, {
		key: 'toTimeString',
		value: function toTimeString() {
			return this.dateTime.toLocaleTimeString(this.locale, {
				hour: '2-digit',
				minute: '2-digit'
			});
		}

		/**
   *	Returns localized weekday.
   *
   *	@param string formatLength
   *
   *	@return string
   */

	}, {
		key: 'toWeekdayString',
		value: function toWeekdayString() {
			var formatLength = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'long';

			return this.dateTime.toLocaleDateString(this.locale, {
				weekday: formatLength
			});
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
		key: 'isLeapYear',
		get: function get() {
			var year = this.dateTime.getFullYear();

			return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
		}

		/**
   *  @prop number daysInYear
   */

	}, {
		key: 'daysInYear',
		get: function get() {
			return this.isLeapYear ? 366 : 365;
		}
	}, {
		key: 'daysInMonth',
		get: function get() {
			return this.getDaysInMonth(this.dateTime.getMonth());
		}
	}], [{
		key: 'isToday',
		value: function isToday(dateTime) {
			var adjustedDateTime = new DateTime(dateTime).setTime(12, 0, 0, 0).toDate();

			var today = new Date();
			today.setHours(12, 0, 0, 0);

			return +today === +adjustedDateTime;
		}
	}]);
	return DateTime;
}();

/**
 *	@type MeridiemLocaleType
 */


/**
 *	@type TimeObjectType
 */


exports.default = DateTime;