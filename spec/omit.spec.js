/* @dependencies */
import omit from '../src/omit';

describe('omit', () => {
	it('removes input key from source object', () => {
		const source = { a : 'a', b : 'b', c : 'c' };
		const expected = { a : 'a', b : 'b' };
		const filtered = omit( source, 'c' );

		expect( filtered ).toEqual( expected );
	});

	it('does not remove items that dies not exist', () => {
		const source = { a : 'a', b : 'b' };
		const expected = { a : 'a', b : 'b' };
		const filtered = omit( source, 'c' );

		expect( filtered ).toEqual( expected );
	});
});
