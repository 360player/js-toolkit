/* @dependencies */
import DateTime from '../src/datetime';

/**
 *	@const string PAST_DATE
 */
const PAST_DATE = '2012-12-12T12:12:12Z';

/**
 *	@const string FUTURE_DATE
 */
const FUTURE_DATE = '2222-12-12T12:12:12Z';

/**
 *	@const string NOT_LEAP_DATE
 */
const NOT_LEAP_DATE = '2011-12-12T12:12:12Z';

describe('initial date time values', () => {

	it('defaults to today', () => {
		const date = new Date();
		const dateTime = new DateTime();

		expect( DateTime.isToday( date ) ).toBe( true );
	});

	it('sets initial date', () => {
		const date = new Date( PAST_DATE );
		const dateTime = new DateTime( date );

		expect( dateTime.toDate() ).toEqual( date );
	});

	it('expects a year to be leap year', () => {
		const date = new Date( PAST_DATE );
		const dateTime = new DateTime( date );

		expect( dateTime.isLeapYear ).toBe( true );
	});

	it('expects a year not to be leap year', () => {
		const date = new Date( NOT_LEAP_DATE );
		const dateTime = new DateTime( date );

		expect( dateTime.isLeapYear ).toBe( false );
	});

	it('expects february to have 29 days if leap year', () => {
		const date = new Date( PAST_DATE );
		const dateTime = new DateTime( date );
		dateTime.setMonth( 2 );

		expect( dateTime.daysInMonth ).toBe( 29 );
	});

	it('expects february to have 28 days if not leap year', () => {
		const date = new Date( NOT_LEAP_DATE );
		const dateTime = new DateTime( date );
		dateTime.setMonth( 2 );

		expect( dateTime.daysInMonth ).toBe( 28 );
	});

});
