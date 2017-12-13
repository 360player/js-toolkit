/* @dependencies */
import dissect from '../src/dissect';

const source = { a : 'A', b: 'B' };

describe('dissect', () => {
	it('dissects source object', () => {
		const expected = [ { a: 'A' }, { b: 'B' } ];
		const dissected = dissect( source, 'a' );

		expect( dissected ).toEqual( expected );
	});

	it('throws error when trying to dissect into same as source', () => {
		const shouldThrowError = () => {
			const dissected = dissect( source, 'a', 'b' );
		};

		expect( shouldThrowError ).toThrow();
	});
});
