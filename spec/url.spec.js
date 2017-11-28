/* @dependencies */
import {
	cleanUriPath,
	serializeParameters,
	transformUrlParameters
} from '../src/url';

describe('cleanUriPath', () => {
	it('removes exessive slashes', () => {
		const expected = '/users';
		const filtered = cleanUriPath( '//users//' );

		expect( filtered ).toEqual( expected );
	});
});

describe('serializeParameters', () => {
	it('serializes an object into a serialized string', () => {
		const expected = 'foo=Hello&bar=World&isAwesome=true&meaningOfLife=42';
		const serialized = serializeParameters({
			foo: 'Hello',
			bar: 'World',
			isAwesome: true,
			meaningOfLife: 42
		});

		expect( serialized ).toEqual( expected );
	});
});

describe('transformUrlParameters', () => {
	it('transforms parameterized path', () => {
		const expected = '/users/42';
		const transformed = transformUrlParameters( '/users/:userId', { userId: 42 } );

		expect( transformed ).toEqual( expected );
	});

	it('appends querystring if replacement map contains unused parameters', () => {
		const expected = '/users/42/friends?sortBy=email%3ADESC';
		const transformed = transformUrlParameters( '/users/:userId/friends', {
			userId: 42,
			sortBy: 'email:DESC'
		} );

		expect( transformed ).toEqual( expected );
	});
});
