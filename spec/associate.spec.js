/* @dependencies */
import associate from '../src/associate';

describe('associate', () => {
	it('associates arrays into object', () => {
		const expected = { a : 'a', b : 'b' };
		const associated = associate( [ 'a', 'b' ], [ 'a', 'b' ] );

		expect( associated ).toEqual( expected );
	});

	it('throws error when array lengths mismatches', () => {
		const shouldThrowError = () => {
			const associated = associate( [ 'a', 'b' ], [ 'a', 'b', 'c' ] );
		};

		expect( shouldThrowError ).toThrow();
	});
});
