/* @flow */

/* @dependencies */
import levenshtein from './levenshtein';

/**
 *	Filters an array of strings using {@see levenshtein}.
 *
 *	@param array list
 *	@param string keyword
 *	@param number minDistance
 *
 *	@return array
 */
export default function filterList( list : Array<string>, keyword : string, minDistance : number = 1 ) : Array<string> {
	if ( minDistance < 2 ) minDistance = 1;

	return list
		.filter( item => item )
		.filter( item => levenshtein( keyword, item ) <= minDistance );
}
