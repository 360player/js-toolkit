/* @dependencies */
import filterList from '../src/filterlist';

const weekDays = [ 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday' ];

describe('filterList', () => {
	it('filteres a list with a minimum distance of one', () => {
		const expected = [ 'monday', 'sunday' ];
		const filtered = filterList( weekDays, 'sonday' );

		expect( filtered ).toEqual( expected );
	});

	it('filteres a list with a minimum distance of three', () => {
		const expected = [ 'monday', 'friday', 'sunday' ];
		const filtered = filterList( weekDays, 'funday', 3 );

		expect( filtered ).toEqual( expected );
	});
});
