/* @dependencies */
import Parser from '../../src/url/parser';

const parser = new Parser();

describe('Parser', () => {

	it('removes excessive slashes', () => {
		const expected = '/users';
		const filtered = parser.clean( '//users//' );

		expect( filtered ).toEqual( expected );
	});

	it('transforms parameterized path', () => {
		const expected = '/users/42';
		const transformed = parser.transform( '/users/:userId', { userId: 42 } );

		expect( transformed ).toEqual( expected );
	});

	it('appends querystring if replacement map contains unused parameters', () => {
		const expected = '/users/42/friends?sortBy=email%3ADESC';
		const transformed = parser.transform( '/users/:userId/friends', {
			userId: 42,
			sortBy: 'email:DESC'
		} );

		expect( transformed ).toEqual( expected );
	});

	it('parses match results', () => {
		const expected = {
			match : true,
			params: {
				userId: 42
			},
			query: {},
			path: '/users/42',
			pattern: '/users/:userId'
		};

		const parsed = parser.parse( '/users/:userId', '/users/42' );

		expect( parsed ).toEqual( expected );
	});

});
