/* @dependencies */
import serialize from '../src/serialize';

describe('serialize.js', () => {
	it('serializes an object into a serialized string', () => {
		const expected = 'foo=Hello&bar=World&isAwesome=true&meaningOfLife=42';
		const serialized = serialize({
			foo: 'Hello',
			bar: 'World',
			isAwesome: true,
			meaningOfLife: 42
		});

		expect( serialized ).toEqual( expected );
	});
});
