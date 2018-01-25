/* @dependencies */
import WeakStorage from '../../src/storage/weakstorage';

const weakStorage = new WeakStorage();

describe('WeakStorage', () => {

	it('can set item to storage', () => {
		weakStorage.setItem( 'greet', 'Hejsan!' );
		const hasItem = ( weakStorage.getItem( 'greet' ) !== null );

		expect( hasItem ).toBe( true );
	});

	it('can get item from storage', () => {
		weakStorage.setItem( 'greet', 'Hejsan!' );
		const greeting = weakStorage.getItem( 'greet' );
		const expectedGreeting = 'Hejsan!';

		expect( greeting ).toEqual( expectedGreeting );
	});

	it('removes item from store', () => {
		weakStorage.setItem( 'greet', 'Hejsan!' );
		weakStorage.removeItem( 'greet' );

		const greeting = weakStorage.getItem( 'greet' );

		expect( greeting ).toBe( null );
	});


	it('increases length when adding items', () => {
		const initialLength = weakStorage.length;

		weakStorage.setItem( 'greet', 'Hejsan!' );
		const lengthAfterSet = weakStorage.length;

		expect( lengthAfterSet ).toBeGreaterThan( initialLength );
	});

	it('clears storage', () => {
		weakStorage.clear();

		expect( weakStorage.length ).toEqual( 0 );
	});

});
