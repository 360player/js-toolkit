/* @dependencies */
import levenshtein from '../src/levenshtein';

describe('levenshtein', () => {
	it('levenstein distance is one', () => {
		const expectedDistance = 1;
		const calculatedDistance = levenshtein( 'kittens', 'mittens' );

		expect( calculatedDistance ).toEqual( expectedDistance );
	});

	it('levenstein distance is five', () => {
		const expectedDistance = 5;
		const calculatedDistance = levenshtein( 'sunday', 'saturday' );

		expect( calculatedDistance ).toEqual( expectedDistance );
	});
});
