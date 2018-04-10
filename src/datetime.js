/* @flow */

if ( ! window ) window = {};

/**
 *  @const string DEFAULT_TIMEZONE
 */
export const DEFAULT_TIMEZONE : string = 'Europe/Stockholm';

/**
 *  @const string DEFAULT_LOCALE
 */
export const DEFAULT_LOCALE : string = 'en-US';

/**
 *	@type TimeType
 */
type TimeType = number;

/**
 *	@type TimeObjectType
 */
type TimeObjectType = {
	hour : number,
	minute : number,
	second : number,
	milliSecond : number,
	meridiem? : string
};

/**
 *	@type MeridiemLocaleType
 */
type MeridiemLocaleType = {
	am : string,
	pm : string,
	prefer12h : boolean
};

/**
 *	@type MeridiemType
 */
type MeridiemType = 'am' | 'pm';

/**
 *	@type RoundDirectionType
 */
type RoundDirectionType = 'up' | 'down';

/**
 *	@type LocaleOptionsType
 */
type LocaleOptionsType = { [ key : string ] : string | boolean };

/**
 *	Date manipulation and presentation helper class.
 */
export default class DateTime {

	/**
	 *  @var Date dateTime
	 */
	dateTime : Date;

	/**
	 *  @var TimeType startOfDay
	 */
	startOfDay : TimeType;

	/**
	 *  @var TimeType endOfDay
	 */
	endOfDay : TimeType;

	/**
	 *  @var TimeType startOfMonth
	 */
	startOfMonth : TimeType;

	/**
	 *  @var TimeType endOfMonth
	 */
	endOfMonth : TimeType;

	/**
	 *	@var bool enforce24hFormat
	 */
	enforce24hFormat : boolean = false;

	/**
	 *	@var MeridiemLocaleType meridiemLocaleObject
	 */
	meridiemLocaleObject : MeridiemLocaleType;

	/**
	 *  Creates a new DateTime instance.
	 *
	 *  @param Date date
	 *	@param bool skipBoundsAggregation
	 *	@param bool autoResolveDefaultOptions
	 *
	 *  @return void
	 */
	constructor( date : Date, skipBoundsAggregation : boolean = false, autoResolveDefaultOptions : boolean = true ) {
		this.fromDate( date || new Date(), skipBoundsAggregation );

		if ( autoResolveDefaultOptions ) {
			this.resolveDateTimeOptions();
		}
	}

	/**
	 *	Returns a new instance of DateTime set to current date.
	 *
	 *	@return DateTime
	 */
	static now() : DateTime {
		return new DateTime( new Date() );
	}

	/**
	 *	Sets timezone and locale based on current device resolved options.
	 *
	 *	@return void
	 */
	resolveDateTimeOptions() {
		// @FLOWFIXME https://github.com/facebook/flow/issues/2801
		const { timeZone, locale } = Intl.DateTimeFormat().resolvedOptions();

		DateTime.setTimeZone( timeZone );
		DateTime.setLocale( locale );
	}

	/**
	 *  Sets current date time object.
	 *
	 *  @param Date dateTime
	 *	@param boolean skipBoundsAggregation
	 *
	 *  @return void
	 */
	fromDate( dateTime : Date, skipBoundsAggregation : boolean = false ) {
		if ( ( dateTime instanceof Date ) === false ) {
			throw new Error( 'Must be instance of Date' );
		}

		// @NOTE Make sure created date is a new date instance
		this.dateTime = new Date( +dateTime );

		if ( ! skipBoundsAggregation ) {
			this.aggregateDateBoundsTimestamps();
		}
	}

	/**
	 *  Returns current date time object.
	 *
	 *  @return Date
	 */
	toDate() : Date {
		return this.dateTime;
	}

	/**
	 *	Merges date (year, month and date), to merge time use {@see mergeTime} or to change full date use {@see setDate}.
	 *
	 *	@param Date date
	 *
	 *	@return void
	 */
	mergeDate( date : Date ) {
		const y : number = date.getFullYear();
		const m : number = date.getMonth() + 1;
		const d : number = date.getDate();

		this.setYear( y );
		this.setMonth( m );
		this.setDay( d );

		this.aggregateDateBoundsTimestamps();
	}

	/**
	 *  Sets current time zone.
	 *
	 *  @param string timeZone
	 *
	 *  @return void
	 */
	static setTimeZone( timeZone : string ) {
		window.dateTimeSelectedTimeZone = timeZone;
	}

	/**
	 *  Returns current time zone.
	 *
	 *  @return string
	 */
	static getTimeZone() : string {
		return window.dateTimeSelectedTimeZone || DEFAULT_TIMEZONE;
	}

	/**
	 *  Sets current locale.
	 *
	 *  @param string locale
	 *
	 *  @return void
	 */
	static setLocale( locale : string ) {
		window.dateTimeSelectedLocale = locale.replace( '_', '-' );
	}

	/**
	 *  Returns current locale.
	 *
	 *  @return string
	 */
	static getLocale() : string {
		return window.dateTimeSelectedLocale || DEFAULT_LOCALE;
	}

	/**
	 *  @prop bool isLeapYear
	 */
	static isLeapYear( year : number ) : boolean {
		return ( ( ( year % 4 === 0 ) && ( year % 100 !== 0 ) ) || ( year % 400 === 0 ) );
	}

	/**
	 *  Returns number of days in current year
	 */
	static daysInYear( year : number ) : number {
		return ( DateTime.isLeapYear( year ) ) ? 366 : 365;
	}

	/**
	 *  Returns the number of days in input month.
	 *
	 *	@param number year
	 *  @param number month
	 *
	 *  @return number
	 */
	static getDaysInMonth( year : number, month : number ) : number {
		let daysInMonths = [ 31, ( DateTime.isLeapYear( year ) ? 29 : 28 ), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

		let monthOffset = month - 1;
		if ( monthOffset > 11 ) monthOffset = 11;
		if ( monthOffset < 0 ) monthOffset = 0;

		return daysInMonths[ monthOffset ];
	}

	/**
	 *  @prop number daysInMonth
	 */
	get daysInMonth() : number {
		return DateTime.getDaysInMonth( this.dateTime.getFullYear(), this.dateTime.getMonth() );
	}

	/**
	 *	Calculates and sets start and end of day from input date.
	 *
	 *	@param Date date
	 *
	 *	@return void
	 */
	aggregateStartAndEndOfDay( date : Date ) {
		// @NOTE Get start of current date as timestamp
		date.setHours( 0, 0, 0, 0 );
		this.startOfDay = +date;

		// @NOTE Get end of current date as timestamp
		date.setHours( 23, 59, 59, 999 );
		this.endOfDay = +date;
	}

	/**
	 *	Calculates and sets start and end of month from input date.
	 *
	 *	@param Date date
	 *
	 *	@return void
	 */
	aggregateStartAndEndOfMonth( date : Date ) {
		// @NOTE Get start of current month as timestamp
		date.setHours( 0, 0, 0, 0 );
		date.setDate( 1 );
		this.startOfMonth = +date;

		// @NOTE Get end of current month as timestamp
		date.setHours( 23, 59, 59, 999 );
		date.setDate( DateTime.getDaysInMonth( date.getFullYear(), date.getMonth() + 1 ) );
		this.endOfMonth = +date;
	}

	/**
	 *	Calculates start of, and end of day and month based on instance date.
	 *
	 *	@return void
	 */
	aggregateDateBoundsTimestamps() {
		const date : Date = new Date( +this.dateTime );

		this.aggregateStartAndEndOfDay( date );
		this.aggregateStartAndEndOfMonth( date );
	}

	/**
	 *	Aggregates current locale meridiem format.
	 *
	 *	@return void
	 */
	aggregateMeridiemLocaleObject() {
		let am : string = 'AM';
		let pm : string = 'PM';
		let prefer12h : boolean = true;

		try {
			// @FLOWFIXME https://github.com/facebook/flow/issues/2801
			const formatter = new Intl.DateTimeFormat( DateTime.getLocale(), { hour : 'numeric', hour12 : true });
			const dayPeriodFilter = n => ( n.type.toLowerCase() === 'dayperiod' );

			let amDate : Date = new Date( 1970, 0, 1, 0, 0, 0, 0 );
			am = formatter.formatToParts( amDate ).find( dayPeriodFilter ).value;

			let pmDate : Date = new Date( 1970, 0, 1, 23, 59, 59, 999 );
			pm = formatter.formatToParts( pmDate ).find( dayPeriodFilter ).value;

			let reMeridiem : RegExp = new RegExp(`${am}|${pm}`, 'g' );
			prefer12h = reMeridiem.test( amDate.toLocaleTimeString( DateTime.getLocale() ) );
		} catch ( error ) {
			throw new Error( error );
		}

		const meridiemLocaleObject : MeridiemLocaleType = { am, pm, prefer12h };

		this.enforce24hFormat = prefer12h;
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
	static durationOf( value : number , granularity : string ) : ?number {
		let granularities = {
			millisecond : 1,
			second : 1000,
			minute : 60000,
			hour : 3600000,
			day : 86400000,
			week : 604800000,
		};

		// @NOTE Pluralize granularities
		Object.entries( granularities ).forEach(([ key, value ]) =>  granularities[ `${key}s` ] = value );

		if ( granularities.hasOwnProperty( granularity ) ) {
			return granularities[ granularity ] * Math.abs( value );
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
	toNearestGranularity( value : number, granularity : string, roundDirection : RoundDirectionType = 'up' ) : DateTime {
		const duration = DateTime.durationOf( value, granularity );

		if ( ! duration ) {
			throw new Error( 'Not a valid time granularity.' );
		}

		const timestamp = +this.dateTime;
		const roundingMethod = roundDirection === 'up' ? 'ceil' : 'floor';
		const roundBy = Math[ roundingMethod ];

		let adjustedTimestamp = roundBy( timestamp / duration ) * duration;

		if ( adjustedTimestamp > this.endOfDay ) {
			adjustedTimestamp = this.endOfDay;
		}

		this.dateTime.setTime( adjustedTimestamp );

		return this;
	}

	/**
	 *	Sets full year.
	 *
	 *	@param number fullYear
	 *
	 *	@return self
	 */
	setYear( fullYear : number ) : DateTime {
		this.dateTime.setFullYear( fullYear );

		return this;
	}

	/**
	 *	Returns full year.
	 *
	 *	@param number fullYear
	 *
	 *	@return self
	 */
	getYear() : number {
		return this.dateTime.getFullYear();
	}

	/**
	 *	Sets month, does not decrement or increment year(s) for current date. Use {@see prev} and {@see next} methods instead.
	 *
	 *	@param number month
	 *
	 *	@return DateTime
	 */
	setMonth( month : number ) : DateTime {
		if ( month > 12 ) month = 12;
		if ( month < 1 ) month = 1;

		if ( this.dateTime.getMonth() !== month ) {
			this.dateTime.setMonth( month - 1 );
			this.aggregateDateBoundsTimestamps();
		}

		return this;
	}

	/**
	 *	Returns month number, to get month index use {@see getMonthOffset}.
	 *
	 *	@return number
	 */
	getMonth() : number {
		return this.dateTime.getMonth() + 1;
	}

	/**
	 *	Returns month offset, to get month number, use {@see getMonth}.
	 *
	 *	@return number
	 */
	getMonthOffset() : number {
		return this.dateTime.getMonth() ;
	}

	/**
	 *	Sets day for current month. Just like {@see setMonth} it does not adjust date if outside of current month bounds.
	 *	To increment or decrement date, use {@see prev} or {@see next} instead.
	 *
	 *	@param number day
	 *
	 *	@return self
	 */
	setDay( day : number ) : DateTime {
		let { daysInMonth } = this;
		day = Math.ceil( Math.abs( day ) );

		if ( day > daysInMonth ) day = daysInMonth;
		if ( day < 1 ) day = 1;

		if ( this.dateTime.getDate() !== day ) {
			this.dateTime.setDate( day );
			this.aggregateDateBoundsTimestamps();
		}

		return this;
	}

	/**
	 *	Returns current day (date).
	 *
	 *	@return number
	 */
	getDay() : number {
		return this.dateTime.getDate();
	}

	/**
	 *	Returns weekday number.
	 *
	 *	@return number
	 */
	getWeekday() : number {
		return this.dateTime.getDay();
	}

	/**
	 *	Sets timestamp from UNIX epoch time.
	 *
	 *	@param number timestamp
	 *
	 *	@return self
	 */
	setTimestamp( timestamp : number ) : DateTime {
		this.dateTime.setTime( timestamp );

		return this;
	}

	/**
	 *	Returns timestamp.
	 *
	 *	@return number
	 */
	getTimestamp() : number {
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
	setTime( hour : number, minute : number = -1, second : number = -1, milliSecond : number = -1 ) : DateTime {
		let dateTime = this.dateTime;

		if ( hour > 23 || hour < 0 ) {
			hour = dateTime.getHours();
		}

		if ( minute > 59 || minute < 0 ) {
			minute = dateTime.getMinutes();
		}

		if ( second > 59 || second < 0 ) {
			second = dateTime.getSeconds();
		}

		if ( milliSecond > 999 || milliSecond < 0 ) {
			milliSecond = dateTime.getMilliseconds();
		}

		dateTime.setHours( hour, minute, second, milliSecond );

		this.dateTime = dateTime;

		return this;
	}

	/**
	 *	Returns {@see TimeObjectType} for current timestamp.
	 *
	 *	@return TimeObjectType
	 */
	getTime() : TimeObjectType {
		const hour : number = this.dateTime.getHours();
		const minute : number = this.dateTime.getMinutes();
		const second : number = this.dateTime.getSeconds();
		const milliSecond : number = this.dateTime.getMilliseconds();

		const timeObject : TimeObjectType = {
			hour,
			minute,
			second,
			milliSecond
		};

		return timeObject;
	}

	/**
	 *	Returns true if time is AM.
	 *
	 *	@return boolean
	 */
	get isAnteMeridiem() : boolean {
		return ! this.isPostMeridiem;
	}

	/**
	 *	Returns true if time is PM.
	 *
	 *	@return boolean
	 */
	get isPostMeridiem() : boolean {
		const { hour, minute, second, milliSecond } = this.getTime();
		return ( hour >= 12 && minute >= 0 && second >= 0 && milliSecond > 0 );
	}

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
	setTime12h( meridiem : MeridiemType, hour : number, minute : number = -1, second : number = -1, milliSecond : number = -1 ) : DateTime {
		const isValidMeridiem : boolean = [ 'am', 'pm' ].includes( meridiem );

		if ( ! isValidMeridiem ) {
			throw new Error( `Invalid meridiem format, expected "am" or "pm", received "${meridiem}".` );
		}

		if ( meridiem === 'pm' ) {
			hour += 12;
		}

		return this.setTime( hour, minute, second, milliSecond );
	}

	/**
	 *	Returns {@see TimeObjectType} for current timestamp in 12h format.
	 *
	 *	@return TimeObjectType
	 */
	getTime12h() : TimeObjectType {
		let hour : number = this.dateTime.getHours();
		const minute : number = this.dateTime.getMinutes();
		const second : number = this.dateTime.getSeconds();
		const milliSecond : number = this.dateTime.getMilliseconds();
		const meridiem = ( hour >= 12 && minute >= 0 && second >= 0 && milliSecond > 0 ) ? 'pm' : 'am';

		if ( hour > 12 ) {
			hour -= 12;
		}

		const timeObject : TimeObjectType = {
			hour,
			minute,
			second,
			milliSecond,
			meridiem
		};

		return timeObject;
	}

	/**
	 *	Sets current timestamp to mid-day.
	 *
	 *	@return self
	 */
	setTimeToMidday() : DateTime {
		this.dateTime.setHours( 12, 0, 0, 0 );

		return this;
	}

	/**
	 *	Sets current timestamp to midnight.
	 *
	 *	@return self
	 */
	setTimeToMidnight() : DateTime {
		this.dateTime.setHours( 0, 0, 0, 1 );

		return this;
	}

	/**
	 *	Merges time, to merge date use {@see mergeDate} or to change full date use {@see setDate}.
	 *
	 *	@param Date date
	 *
	 *	@return void
	 */
	mergeTime( date : Date ) {
		const h : number = date.getHours();
		const m : number = date.getMinutes();
		const s : number = date.getSeconds();
		const ms : number = date.getMilliseconds();

		this.setTime( h, m, s, ms );

		this.aggregateMeridiemLocaleObject();
	}

	/**
	 *	Sets date from UNIX timestamp.
	 *
	 *	@param number unixTimestamp
	 *
	 *	@return self
	 */
	setUnixTimestamp( unixTimestamp : number ) : DateTime {
		return this.setTimestamp( unixTimestamp * 1000 );
	}

	/**
	 *	Returns UNIX timestamp.
	 *
	 *	@return number
	 */
	getUnixTimestamp() : number {
		return Math.ceil( this.getTimestamp() / 1000 );
	}

	/**
	 *	Validates if input date is before instance date.
	 *
	 *	@param TimeType timestamp
	 *
	 *	@return boolean
	 */
	isBefore( timestamp : TimeType ) : boolean {
		return ( this.getTimestamp() <= timestamp );
	}

	/**
	 *	Validates if input date is after instance date.
	 *
	 *	@param TimeType timestamp
	 *
	 *	@return boolean
	 */
	isAfter( timestamp : TimeType ) : boolean {
		return ( this.getTimestamp() >= timestamp );
	}

	/**
	 *	Validates if instance date is between start and end timestamp.
	 *
	 *	@param Date startDateTime
	 *	@param Date endDateTime
	 *
	 *	@return boolean
	 */
	isBetween( startTimestamp : TimeType, endTimestamp : TimeType ) : boolean {
		return ( this.isAfter( startTimestamp ) && this.isBefore( endTimestamp ) );
	}

	/**
	 *	Validates if input timestamp is within todays time bounds.
	 *
	 *	@param TimeType timestamp
	 *
	 *	@return boolean
	 */
	static isToday( timestamp : TimeType ) : boolean {
		let { startOfDay, endOfDay } = new DateTime( new Date() );

		return ( timestamp >= startOfDay && timestamp <= endOfDay );
	}

	/**
	 *	Validates if input timestamp is within bounds of instance date.
	 *
	 *	@param TimeType timestamp
	 *
	 *	@return boolean
	 */
	sameDay( timestamp : TimeType ) : boolean {
		return ( timestamp >= this.startOfDay && timestamp <= this.endOfDay );
	}

	/**
	 *  Decrements nth granularity from date time.
	 *
	 *  @param string granularity
	 *  @param number decrementValue
	 *
	 *  @return self
	 */
	prev( granularity : string, decrementValue : number = 1 ) : DateTime {
		if ( granularity.match( /years?/ ) ) {
			const prevFullYear : number = this.dateTime.getFullYear() - Math.abs( Math.ceil( decrementValue ) );

			this.dateTime.setFullYear( prevFullYear );
		} else if ( granularity.match( /months?/ ) ) {
			const prevMonths : number = this.dateTime.getMonth() - Math.abs( Math.ceil( decrementValue ) );

			this.dateTime.setMonth( prevMonths );
		} else {
			let timestamp : number = this.dateTime.getTime();
			let duration : ?number = DateTime.durationOf( decrementValue, granularity );

			this.dateTime = new Date( Math.abs( timestamp - parseInt( duration ) ) );
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
	next( granularity : string, incrementValue : number = 1 ) : DateTime {
		if ( granularity.match( /years?/ ) ) {
			const nextFullYear = this.dateTime.getFullYear() + Math.abs( Math.ceil( incrementValue ) );

			this.dateTime.setFullYear( nextFullYear );
		} else if ( granularity.match( /months?/ ) ) {
			const nextMonths = this.dateTime.getMonth() + Math.abs( Math.ceil( incrementValue ) );

			this.dateTime.setMonth( nextMonths );
		} else {
			let timestamp : number = this.dateTime.getTime();
			let duration : ?number = DateTime.durationOf( incrementValue, granularity );

			this.dateTime = new Date( timestamp + parseInt( duration ) );
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
	toLocaleDateString( formatOptions : Date$LocaleOptions ) : string {
		return this.dateTime.toLocaleDateString( DateTime.getLocale(), formatOptions );
	}

	/**
	 *	Returns localized representation of time, assumes instance locale variable.
	 *
	 *	@param LocaleOptionsType formatOptions
	 *
	 *	@return string
	 */
	toLocaleTimeString( formatOptions : Date$LocaleOptions ) : string {
		return this.dateTime.toLocaleTimeString( DateTime.getLocale(), formatOptions );
	}

	/**
	 *	Returns localized calendar date.
	 *
	 *	@return string
	 */
	toCalendarDateString() : string {
		return this.toLocaleDateString({ year : 'numeric', month : 'long' });
	}

	/**
	 *	Returns localized date (short).
	 *
	 *	@return string
	 */
	toDateString() : string {
		return this.toLocaleDateString({ year: 'numeric', month: 'numeric', day: 'numeric' });
	}

	/**
	 *	Returns localized long date.
	 *
	 *	@return string
	 */
	toLongDateString() : string {
		return this.toLocaleDateString({ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
	}

	/**
	 *	Returns localized time (short).
	 *
	 *	@return string
	 */
	toTimeString() : string {
		return this.toLocaleTimeString({ hour : '2-digit', minute : '2-digit', hour12 : ! this.enforce24hFormat });
	}

	/**
	 *	Returns localized time (short).
	 *
	 *	@return string
	 */
	toLongTimeString( ) : string {
		return this.toLocaleTimeString({ hour12 : ! this.enforce24hFormat });
	}

	/**
	 *	Returns localized weekday name (short).
	 *
	 *	@return string
	 */
	toWeekdayString() : string {
		return this.toLocaleDateString({ weekday : 'short' });
	}

	/**
	 *	Returns localized long weekday name.
	 *
	 *	@return string
	 */
	toLongWeekdayString() : string {
		return this.toLocaleDateString({ weekday : 'long' });
	}

	/**
	 *	Returns current date as string.
	 *
	 *	@return string
	 */
	toString() : string {
		return this.dateTime.toString();
	}

}

/**
 *	@type CalendarDayType
 */
type CalendarDayType = {
	isToday : boolean,
	isCurrentMonth : boolean,
	timestamp : number
};

/**
 *	@type CalendarMonthType
 */
type CalendarMonthType = Array<CalendarDayType>;

export class Calendar {

	/**
	 *	@static number weekStartsAtIndex
	 */
	static weekStartsAtIndex : number = 1;

	/**
	 *	Generates a multi dimensional array representing a calendar month.
	 */
	static generate( year : number , month : number ) : CalendarMonthType {
		let date = new Date( year, month - 1, 1, 12, 0, 0, 0 );

		let calendar : CalendarMonthType = [];
		const daysInMonth : number = DateTime.getDaysInMonth( year, month );
		const startOfMonthWeekday : number = date.getDay();
		const daysInPreviousMonth : number = ( 7 + startOfMonthWeekday - Calendar.weekStartsAtIndex ) % 7;
		const calendarWeeksInMonth : number = Math.ceil( ( daysInMonth + daysInPreviousMonth ) / 7 );
		let currentDay : number = 1 - daysInPreviousMonth;

		for ( let week : number = 0; week < calendarWeeksInMonth; week++ ) {
			let dateIndex;

			for ( let weekDay : number = 0; weekDay < 7; weekDay++ ) {
				dateIndex = weekDay + currentDay;

				let calendarDate : Date = new Date( year, month - 1, dateIndex, 12, 0, 0, 0 );

				const calendarDay : CalendarDayType = {
					isToday : DateTime.isToday( +calendarDate ),
					isCurrentMonth : ( calendarDate.getMonth() === month - 1 ),
					timestamp : +calendarDate,
					day : calendarDate.getDate()
				};

				calendar.push( calendarDay );
			}

			currentDay += 7;
		}

		return calendar;
	}

}
