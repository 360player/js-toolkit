/* @dependencies */
import serialize from '../src/serialize';

describe('serialize', () => {
	it('serializes an object into string', () => {
		const expected = 'foo=Hello&bar=World&isAwesome=true&meaningOfLife=42';
		const serialized = serialize({
			foo: 'Hello',
			bar: 'World',
			isAwesome: true,
			meaningOfLife: 42
		});

		expect( serialized ).toEqual( expected );
	});

	it('serializes object without values', () => {
		const expected = 'foo=Hello&bar';
		const serialized = serialize({
			foo: 'Hello',
			bar: null
		});

		expect( serialized ).toEqual( expected );
	});
});
