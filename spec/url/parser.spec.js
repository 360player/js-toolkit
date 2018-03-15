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

	it('does not transform empty params', () => {
		const expected = '/users';
		const transformed = parser.transform( '/users/:userId' );

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

	it('parses query string', () => {
		const expected = {
			match : true,
			params: {
				userId: 42
			},
			query: {
				includeMeta : true
			},
			path: '/users/42',
			pattern: '/users/:userId'
		};

		const parsed = parser.parse( '/users/:userId', '/users/42?includeMeta=true' );

		expect( parsed ).toEqual( expected );
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

	it('parses but does not match', () => {
		const expected = {
			match : false,
			params: {},
			query: {},
			path: '/users/42/friends',
			pattern: '/users/:userId'
		};

		const parsed = parser.parse( '/users/:userId', '/users/42/friends' );

		expect( parsed ).toEqual( expected );
	});

	it('transforms even if querystring is already present', () => {
		const initialUri = '/users/:userId/friends?sortBy=firstName:ASC';
		const expected = '/users/1337/friends?sortBy=email%3ADESC';
		const transformed = parser.transform( initialUri, {
			userId: 1337,
			sortBy: 'email:DESC'
		} );

		expect( transformed ).toEqual( expected );
	});

	it('matches root pattern', () => {
		const expected = {
			match : true,
			params: {},
			query: {},
			path: '/',
			pattern: '/',
		};

		const parersed = parser.parse( '/', '/' );

		expect( parersed ).toEqual( expected );
	});


	it('matches root pattern with excessive slashes', () => {
		const expected = {
			match : true,
			params: {},
			query: {},
			path: '/',
			pattern: '/',
		};

		const parersed = parser.parse( '/', '/////////////' );

		expect( parersed ).toEqual( expected );
	});
});
