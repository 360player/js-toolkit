/* @dependencies */
import only from '../src/only';

describe('only', () => {
	it('keeps input key from source object', () => {
		const source = { a: 'a', b: 'b', c: 'c' };
		const expected = { b: 'b' };
		const filtered = only( source, 'b' );

		expect( filtered ).toEqual( expected );
	});

	it('returns empty object when keep key does not exist', () => {
		const source = { a: 'a', b: 'b'  };
		const expected = {};
		const filtered = only( source, 'c' );

		expect( filtered ).toEqual( expected );
	});
});
