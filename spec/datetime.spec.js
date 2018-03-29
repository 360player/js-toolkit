/* @dependencies */
import DateTime, { Calendar } from '../src/datetime';

describe('Calendar', () => {

	it('can generate a month', () => {

		console.time('execTime');
		console.log( Calendar.generate( 2018, 3 ) );
		console.timeEnd('execTime');

	});

});
