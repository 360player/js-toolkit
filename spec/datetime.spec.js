/* @dependencies */
import DateTime, { DEFAULT_TIMEZONE, DEFAULT_LOCALE } from '../src/datetime';

describe('DateTime', () => {

	beforeEach(() => {
		// Make sure we use the same locale in each test.
		DateTime.setTimeZone( DEFAULT_TIMEZONE );
		DateTime.setLocale( DEFAULT_LOCALE );
	});

	it('can override timezone globally', () => {
		const initialTimeZone = DateTime.getTimeZone();

		DateTime.setTimeZone('Europe/Copenhagen');
		const updatedTimeZone = DateTime.getTimeZone();

		expect( updatedTimeZone ).not.toEqual( initialTimeZone );
	});

	it('can override locale globally', () => {
		const initialLocale = DateTime.getLocale();

		DateTime.setLocale('sv');
		const updatedLocale = DateTime.getLocale();

		expect( updatedLocale ).not.toEqual( initialLocale );
	});

	it('correctly aggregates localized meridiems', () => {
		const date = new Date();
		const dateTime = new DateTime( date );
		dateTime.aggregateMeridiemLocaleObject();

		const { am, pm } = dateTime.meridiemLocaleObject;

		expect( am ).not.toEqual( pm );
	});

	it('validates valid leap year', () => {
		expect( DateTime.isLeapYear( 2016 ) ).toBe( true );
	});

	it('invalidates invalid leap year', () => {
		expect( DateTime.isLeapYear( 2018 ) ).not.toBe( true );
	});

	it('returns the correct number of days in a leap year', () => {
		expect( DateTime.daysInYear( 2016 ) ).toBe( 366 );
	});

	it('returns the correct number of days in a year', () => {
		expect( DateTime.daysInYear( 2018 ) ).toBe( 365 );
	});

	it('returns the correct number of days in february on a leap year', () => {
		expect( DateTime.getDaysInMonth( 2016, 2 ) ).toBe( 29 );
	});

	it('returns the correct number of days in february', () => {
		expect( DateTime.getDaysInMonth( 2018, 2 ) ).toBe( 28 );
	});

	it('creates a new instace', () => {
		const date = new Date();
		const dateTime = new DateTime( date );

		expect( dateTime ).toBeInstanceOf( DateTime );
	});

	it('creates a new instance from DateTime.now', () => {
		expect( DateTime.now() ).toBeInstanceOf( DateTime );
	});

	it('throws error if date argument is invalid when creating new instace', () => {
		expect(() => {
			let errorDateTime = new DateTime('Hello');
		}).toThrow();
	});

	it('has aggregated time offsets', () => {
		const dateTime = DateTime.now();

		expect( dateTime.startOfDay ).toBeDefined();
		expect( dateTime.endOfDay ).toBeDefined();
		expect( dateTime.startOfMonth ).toBeDefined();
		expect( dateTime.endOfMonth ).toBeDefined();
	});

	it('does not aggregate time offsets if explicitly set to skip', () => {
		const date = new Date();
		const dateTime = new DateTime( date, true );

		expect( dateTime.startOfDay ).not.toBeDefined();
		expect( dateTime.endOfDay ).not.toBeDefined();
		expect( dateTime.startOfMonth ).not.toBeDefined();
		expect( dateTime.endOfMonth ).not.toBeDefined();
	});

	it('does not have meridiem locale aggregated by default', () => {
		const dateTime = DateTime.now();

		expect( dateTime.meridiemLocaleObject ).not.toBeDefined();
	});

	it('aggregates meridiem locale object', () => {
		const dateTime = DateTime.now();
		dateTime.aggregateMeridiemLocaleObject();

		expect( dateTime.meridiemLocaleObject ).toBeDefined();
	});

	it('returns the duration 2 hours in milliseconds', () => {
		const expectedMilliseconds = 2 * 60 * 60 * 1000;

		expect( DateTime.durationOf( 2, 'hours' ) ).toBe( expectedMilliseconds );
	});

	it('can manipulate year', () => {
		const dateTime = DateTime.now();
		const currentYear = dateTime.getYear();
		dateTime.setYear( 2019 );

		expect( dateTime.getYear() ).not.toEqual( currentYear );
	});

	it('can manipulate month', () => {
		const dateTime = DateTime.now();
		const currentMonth = dateTime.getMonth();
		dateTime.setMonth( currentMonth + 1 );

		expect( dateTime.getMonth() ).not.toEqual( currentMonth );
	});

	it('can manipulate day', () => {
		const dateTime = DateTime.now();
		dateTime.setDay( 1 );

		expect( dateTime.getDay() ).toBe( 1 );
	});

	it('returns month offset', () => {
		const dateTime = DateTime.now();
		const currentMonth = dateTime.getMonth();

		expect( dateTime.getMonthOffset() ).toBe( currentMonth - 1 );
	});

	it('returns timestamp in milliseconds', () => {
		const dateTime = DateTime.now();

		expect( dateTime.getTimestamp() ).toBeDefined();
	});

	it('returns UNIX timestamp', () => {
		const dateTime = DateTime.now();

		expect( dateTime.getUnixTimestamp() ).toBeDefined();
	});

	it('can increment 5 years to current date', () => {
		const dateTime = DateTime.now();
		const currentYear = dateTime.getYear();
		dateTime.next( 'years', 5 );

		expect( dateTime.getYear() ).toBe( currentYear + 5 );
	});

	it('can decrement 5 years from current date', () => {
		const dateTime = DateTime.now();
		const currentYear = dateTime.getYear();
		dateTime.prev( 'years', 5 );

		expect( dateTime.getYear() ).toBe( currentYear - 5 );
	});

	it('can increment to next month', () => {
		const dateTime = DateTime.now();
		const currentMonth = dateTime.getMonth();
		dateTime.next('month');

		if ( currentMonth === 12 ) {
			dateTime.setMonth( 11 );
		}

		expect( dateTime.getMonth() ).toBe( currentMonth + 1 );
	});

	it('can decrement to prev month', () => {
		const dateTime = DateTime.now();
		const currentMonth = dateTime.getMonth();
		dateTime.prev('month');

		if ( currentMonth === 1 ) {
			dateTime.setMonth( 2 );
		}

		expect( dateTime.getMonth() ).toBe( currentMonth - 1 );
	});

});
