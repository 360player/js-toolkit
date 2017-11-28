/* @dependencies */
import only from '../src/only';

describe('only.js', () => {
	it('keeps input key from source object', () => {
		const source = { a: 'a', b: 'b', c: 'c' };
		const expected = { b: 'b' };
		const filtered = only( source, 'b' );

		expect( filtered ).toEqual( expected );
	});
});
