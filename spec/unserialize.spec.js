/* @dependencies */
import unserialize from '../src/unserialize';

describe('unserialize', () => {
	it('unserializes a string into object', () => {
		const expected = {
			foo: 'Hello',
			bar: 'World',
			isAwesome: true,
			meaningOfLife: 42
		};

		const unserialized = unserialize( 'foo=Hello&bar=World&isAwesome=true&meaningOfLife=42' );

		expect( unserialized ).toEqual( expected );
	});
});
