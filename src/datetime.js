/* @flow */

/**
 *	@type TimeObjectType
 */
type TimeObjectType = {
	hour : number,
	minute : number,
	second : number,
	milliSecond : number
};

/**
 *	@type CalendarDateType
 */
type CalendarDateType = {
	dateTime : DateTime,
	isToday : boolean,
	sameMonth : boolean
};

/**
 *	Date manipulation and presentation helper class.
 */
export default class DateTime {

	/**
	 *  @var Date dateTime
	 */
	dateTime : Date;

	/**
	 *  @var Date startOfDay
	 */
	startOfDay : Date;

	/**
	 *  @var Date endOfDay
	 */
	endOfDay : Date;

	/**
	 *  @var Date startOfMonth
	 */
	startOfMonth : Date;

	/**
	 *  @var Date endOfMonth
	 */
	endOfMonth : Date;

	/**
	 *  @var string timeZone
	 */
	timeZone = 'Europe/Stockholm';

	/**
	 *  @var string locale
	 */
	locale = 'en-US';

	/**
	 *  Creates a new DateTime instance.
	 *
	 *  @param Date dateTime
	 *  @param bool autoResolveDefaultOptions
	 *
	 *  @return void
	 */
	constructor( dateTime : Date , autoResolveDefaultOptions : boolean = true ) {
		this.setDateTime( dateTime );

		if ( autoResolveDefaultOptions === true ) {
			// @FLOWFIXME https://github.com/facebook/flow/issues/2801
			const { timeZone, locale } = Intl.DateTimeFormat().resolvedOptions();

			this.setTimeZone( timeZone );
			this.setLocale( locale );
		}
	}

	/**
	 *	Shallow clone of current instance.
	 *
	 *	@return DateTime
	 */
	clone() : DateTime {
		const clonedDateTime = new DateTime( new Date( +this.dateTime ) );
		clonedDateTime.setTimeZone( this.getTimeZone() );
		clonedDateTime.setLocale( this.getLocale() );
		clonedDateTime.aggregateDateTime();

		return clonedDateTime;
	}

	/**
	 *	Aggregates start/end-of data based on current set date.
	 *
	 *	@return void
	 */
	aggregateDateTime() {
		const startOfDay = new Date( +this.dateTime );
		startOfDay.setHours( 0, 0, 0, 1 );
		this.startOfDay = startOfDay;

		const endOfDay = new Date( +this.dateTime );
		endOfDay.setHours( 23, 59, 59, 999 );
		this.endOfDay = endOfDay;

		const startOfMonth = new Date( +this.dateTime );
		startOfMonth.setHours( 0, 0, 0, 1 );
		startOfMonth.setDate( 1 );
		this.startOfMonth = startOfMonth;

		const daysInMonth = this.getDaysInMonth( this.dateTime.getMonth() );

		const endOfMonth = new Date( +this.dateTime );
		endOfMonth.setHours( 23, 59, 59, 999 );
		endOfMonth.setDate( daysInMonth );
		this.endOfMonth = endOfMonth;
	}

	/**
	 *  Sets current date time object.
	 *
	 *  @param Date dateTime
	 *
	 *  @return void
	 */
	setDateTime( dateTime : ?Date = null ) {
		if ( ! dateTime ) {
			dateTime = new Date();
		}

		if ( ( dateTime instanceof Date ) === false ) {
			throw new Error( `Must be instance of Date` );
		}

		this.dateTime = dateTime;
		this.aggregateDateTime();
	}

	/**
	 *  Returns current date time object.
	 *
	 *  @return Date
	 */
	getDateTime() : Date {
		return this.dateTime;
	}

	/**
	 *  Sets current time zone.
	 *
	 *  @param string timeZone
	 *
	 *  @return void
	 */
	setTimeZone( timeZone : string ) {
		this.timeZone = timeZone;
	}

	/**
	 *  Returns current time zone.
	 *
	 *  @return string
	 */
	getTimeZone() : string {
		return this.timeZone;
	}

	/**
	 *  Sets current locale.
	 *
	 *  @param string locale
	 *
	 *  @return void
	 */
	setLocale( locale : string ) {
		this.locale = locale;
	}

	/**
	 *  Returns current locale.
	 *
	 *  @return string
	 */
	getLocale() : string {
		return this.locale;
	}

	/**
	 *  @prop bool isLeapYear
	 */
	get isLeapYear() : boolean {
		const year = this.dateTime.getFullYear();

		return ( ( ( year % 4 === 0 ) && ( year % 100 !== 0 ) ) || ( year % 400 === 0 ) );
	}

	/**
	 *  @prop number daysInYear
	 */
	get daysInYear() : 366 | 365 {
		return ( this.isLeapYear ) ? 366 : 365;
	}

	/**
	 *  Returns the number of days in input month.
	 *
	 *  @param number monthOffset
	 *
	 *  @return number
	 */
	getDaysInMonth( monthOffset : number ) : number {
		let daysInMonths = [ 31, ( this.isLeapYear ? 29 : 28 ), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

		if ( monthOffset > 11 ) monthOffset = 11;
		if ( monthOffset < 0 ) monthOffset = 0;

		return daysInMonths[ monthOffset ];
	}

	/**
	 *  @prop number daysInMonth
	 */
	get daysInMonth() : number {
		return this.getDaysInMonth( this.dateTime.getMonth() );
	}

	/**
	 *  Returns the duration of a granularity of time, such as seconds, minutes up to weeks.
	 *
	 *  @param number value
	 *  @param string granularity
	 *
	 *  @return number
	 */
	durationOf( value : number , granularity : string ) : ?number {
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
			let duration : ?number = this.durationOf( decrementValue, granularity );

			this.dateTime = new Date( Math.abs( timestamp - parseInt( duration ) ) );
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
	next( granularity : string, incrementValue : number = 1 ) : DateTime {
		if ( granularity.match( /years?/ ) ) {
			const nextFullYear = this.dateTime.getFullYear() + Math.abs( Math.ceil( incrementValue ) );

			this.dateTime.setFullYear( nextFullYear );
		} else if ( granularity.match( /months?/ ) ) {
			const nextMonths = this.dateTime.getMonth() + Math.abs( Math.ceil( incrementValue ) );

			this.dateTime.setMonth( nextMonths );
		} else {
			let timestamp : number = this.dateTime.getTime();
			let duration : ?number = this.durationOf( incrementValue, granularity );

			this.dateTime = new Date( timestamp + parseInt( duration ) );
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

		this.dateTime.setMonth( month - 1 );

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

		this.dateTime.setDate( day );

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
	 *	Returns an array of date strings for current month.
	 *
	 *	@return Array<string>
	 */
	getDays() : Array<string> {
		const y : number = this.getYear();
		const m : number = this.getMonth();
		let d : string;

		let daysInMonth : Array<string> = Array( this.daysInMonth ).fill('');
		daysInMonth = daysInMonth.map( n => {
			d = ( n + 1 ).toString().padStart( 2, '0' );
			return `${y}-${m}-${d}T12:00:00Z`;
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
	setTime( hour : number = 0, minute : number = 0, second : number = 0, milliSecond : number = 0 ) : DateTime {
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
	 *	Sets current timestamp to mid-day.
	 *
	 *	@return self
	 */
	setTimeToMidday() : DateTime {
		return this.setTime( 12, 0, 0, 0 );
	}

	/**
	 *	Sets current timestamp to midnight.
	 *
	 *	@return self
	 */
	setTimeToMidnight() : DateTime {
		return this.setTime( 0, 0, 0, 1 );
	}

	/**
	 *	Validates if current DateTime is between two dates.
	 *
	 *	@param Date startDateTime
	 *	@param Date endDateTime
	 *
	 *	@return boolean
	 */
	isBetween( startDateTime : Date , endDateTime : Date ) : boolean {
		const startDateTimestamp : number  = startDateTime.getTime();
		const endDateTimestamp : number  = endDateTime.getTime();
		const currentTimestamp : number = this.dateTime.getTime();

		return ( currentTimestamp >= startDateTimestamp && currentTimestamp <= endDateTimestamp );
	}

	/**
	 *	Validates if input date is before current DateTime.
	 *
	 *	@param Date dateTime
	 *
	 *	@return boolean
	 */
	isBefore( dateTime : Date ) : boolean {
		const startDateTimestamp : number = this.dateTime.getTime();
		const endDateTimestamp : number = dateTime.getTime();

		return ( startDateTimestamp <= endDateTimestamp );
	}

	/**
	 *	Validates if input date is after current DateTime.
	 *
	 *	@param Date dateTime
	 *
	 *	@return boolean
	 */
	isAfter( dateTime : Date ) : boolean {
		const startDateTimestamp : number = this.dateTime.getTime();
		const endDateTimestamp : number = dateTime.getTime();

		return ( startDateTimestamp >= endDateTimestamp );
	}

	/**
	 *	Validates if input date is today.
	 *
	 *	@param Date dateTime
	 *
	 *	@return boolean
	 */
	isToday( dateTime : Date ) : boolean {
		let adjustedDateTime = ( new DateTime( dateTime ) ).setTimeToMidday().getDateTime();

		const today : Date = new Date();
		today.setHours( 12, 0, 0, 0 );

		return ( +today === +adjustedDateTime );
	}

	/**
	 *	Validates if input date is same as instance date.
	 *
	 *	@param Date dateTime
	 *
	 *	@return boolean
	 */
	sameDay( dateTime : Date ) : boolean {
		let currentDateTime = this.clone().setTimeToMidday().getDateTime();
		let adjustedDateTime = ( new DateTime( dateTime ) ).setTimeToMidday().getDateTime();

		return ( +currentDateTime === +adjustedDateTime );
	}

	/**
	 *	Returns an array of {@see CalendarDateType}
	 *
	 *	@return array
	 */
	getCalendar() : Array<mixed> {
		let calendar : Array<mixed> = [];
		const weekStartsAt : number = 1;
		const daysInPreviousMonth : number = ( 7 + this.startOfMonth.getDay() - weekStartsAt ) % 7;
		const calendarWeeks : number = Math.ceil( ( this.daysInMonth + daysInPreviousMonth ) / 7 );
		let currentDay : number = 1 - daysInPreviousMonth;
		let weekDays : Array<CalendarDateType>;
		let date : DateTime;

		for ( let week = 0; week < calendarWeeks; week++ ) {
			weekDays = [];
			let dateIndex;

			for ( let weekDay = 0; weekDay < 7; weekDay++ ) {
				dateIndex = weekDay + currentDay;
				date = this.clone().setTimeToMidday();
				date.dateTime.setDate( dateIndex );

				let sameMonth : boolean = ( dateIndex >= 1 && dateIndex <= this.daysInMonth );

				weekDays.push({
					dateTime : date,
					isToday : this.isToday( date.getDateTime() ),
					sameMonth
				});
			}

			currentDay += 7;
			calendar.push( weekDays );
		}

		return calendar;
	}

	/**
	 *	Returns localized calendar date (month and year).
	 *
	 *	@return string
	 */
	toCalendarDateString() : string {
		return this.dateTime.toLocaleDateString( this.locale, {
			year : 'numeric',
			month : 'long'
		});
	}

	/**
	 *	Returns localized time string.
	 *
	 *	@return string
	 */
	toTimeString() : string {
		return this.dateTime.toLocaleTimeString( this.locale, {
			hour : '2-digit',
			minute : '2-digit'
		});
	}

	/**
	 *	Returns localized weekday.
	 *
	 *	@param string formatLength
	 *
	 *	@return string
	 */
	toWeekdayString( formatLength : string = 'long' ) : string {
		return this.dateTime.toLocaleDateString( this.locale, {
			weekday : formatLength
		});
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
