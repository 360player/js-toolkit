/* @dependencies */
import DateTime from '../src/datetime';

describe('DateTime', () => {

	it('correctly aggregates localized meridiems', () => {
		const date = new Date();
		const dateTime = new DateTime( date );
		dateTime.aggregateMeridiemLocaleObject();

		const { am, pm } = dateTime.meridiemLocaleObject;

		expect( am ).not.toEqual( pm );
	});

});
