/* @flow */

/* @dependencies */
import unserialize, { unserializeValue } from '../unserialize';
import serialize from '../serialize';
import associate from '../associate';
import omit from '../omit';

/* @type-dependencies */
import type { MixedObjectType } from '../generics';

/**
 *	@type ParserParamsType
 */
type ParserParamsType = { [ key : string ] : mixed };

/**
 *	@type ParserMatchType
 */
type ParserResultType = {
	match : boolean,
	path : string,
	pattern : string,
	params : ParserParamsType,
	query : ParserParamsType
};

/**
 *	@const RegExp REGEX_LOOKUP_PATTERN
 */
const REGEX_LOOKUP_PATTERN : RegExp = /(\:[^\/]+)/g;

/**
 *	@const RegExp REGEX_REPLACE_PATTERN
 */
const REGEX_REPLACE_PATTERN : RegExp = /\:([^\/]+)/;

/**
 *	@const string REGEX_LOOKUP_CAPTURE
 */
const REGEX_LOOKUP_CAPTURE : string = '([^\/]+)';

/**
 *	@const RegExp REGEX_LOOKUP_QUERY
 */
const REGEX_LOOKUP_QUERY : RegExp = /\S[^?]*(?:\?+|$)/g;


/**
 *	URL parser and matcher
 */
export default class Parser {

	/**
	 *	Removes excessive forward slashes.
	 *
	 *	@param string uriPath
	 *
	 *	@return string
	 */
	clean( uriPath : string ) : string {
		return uriPath
			.replace( /\/+/g, '/' )
			.replace( /\/+$/, '' );
	}

	/**
	 *	Converts URI path to RegExp.
	 *
	 *	@param string uriPattern
	 *
	 *	@return RegExp
	 */
	getPatternRegExp( uriPattern : string ) : RegExp {
		const pattern : string = this.clean( `/${uriPattern}` )
			.replace( /[-\/\\^$*+?.()|[\]{}]/g, '\\$&' )
			.replace( REGEX_LOOKUP_PATTERN, match => {
				return REGEX_LOOKUP_CAPTURE;
			});

		return new RegExp( `^${pattern}$`, 'i' );
	}

	/**
	 *	Parses path from input URI.
	 *
	 *	@param string uriPattern
	 *	@param string uriPath
	 *
	 *	@return ParserMatchType
	 */
	/*match( uriPattern : string, uriPath : string ) : ParserMatchType {
		const pattern : RegExp = this.getPatternRegExp( uriPattern );
		const parameterNames : null | ?Array<string> = uriPattern.match( REGEX_LOOKUP_PATTERN );

		const params = {};
		let path : string = '';
		let query : ParserParamsType = {};

		const regexMatches = uriPath.match( REGEX_LOOKUP_QUERY );

		if ( regexMatches ) {
			// @FLOWFIXME Fix for destructive assignment
			regexMatches.push('', '');
			// @FLOWFIXME Flow throws "possibly undefined", which is not reached (see line above)
			let [ path, query ] = regexMatches;
		}

		if ( typeof query === 'string' ) {
			query = unserialize( query );
		}

		path = path.replace( '?', '' );

		let matches : null | ?Array<string> = path.match( pattern );

		if ( matches ) {
			// @FLOWFIXME Flow throws "possibly undefined", which is not reached (see line above)
			let actualMatches : Array<string> = matches.slice( 1 );

			if ( actualMatches && parameterNames ) {
				// @FLOWFIXME Flow throws "possibly undefined", which is not reached (see line above)
				parameterNames.forEach(( parameter, n ) => {
					// @FLOWFIXME https://github.com/facebook/flow/issues/2221
					let value = unserializeValue( matches[ n ] );
					params[ parameter.replace( ':', '' ) ] = value;
				});
			}
		}

		let matchResults : ParserMatchType = {
			match : ( matches !== null ),
			pattern : uriPattern,
			path,
			params,
			query
		};

		return matchResults;
	}*/

	transform( uriPattern : string, uriParams : ParserParamsType = {} ) : string {
		let omitKeys : Array<string> = [];

		const replaceMatch = ( match : string, key : string ) : string => {
			if ( uriParams.hasOwnProperty( key ) === true ) {
				omitKeys.push( key );
				// @FLOWFIXME https://github.com/facebook/flow/issues/2221
				return uriParams[ key ];
			}

			return '';
		};

		const transformedUrl : string = this.clean( uriPattern ).replace( REGEX_REPLACE_PATTERN, replaceMatch );
		const queryString : string = serialize( omit( uriParams, ...omitKeys ) );
		const urlSuffix : string = ( queryString.length > 0 ) ? `?${queryString}` : '';

		return transformedUrl + urlSuffix;
	}

	parse( uriPattern : string, uriPath : string ) : ParserResultType {
		const uriPatternRegex : RegExp = this.getPatternRegExp( uriPattern );
		const parameterMatches : ?Array<string> = uriPattern.match( REGEX_LOOKUP_PATTERN );
		const uriMatches : ?Array<string> = uriPath.match( REGEX_LOOKUP_QUERY );

		const parserResult : ParserResultType = {
			match : false,
			path : uriPath,
			pattern : uriPattern,
			params : {},
			query : {}
		};

		if ( uriMatches !== null && uriMatches !== undefined ) {
			if ( uriMatches.length === 1 ) {
				uriMatches.push( '' );
			}

			const [ parsedUriPath, parsedUriQuery ] = uriMatches.map( match => match.replace( '?', '' ));
			const parsedUriMatches : ?Array<string> = parsedUriPath.match( uriPatternRegex );

			// @NOTE Update 'path' without eventual query string
			if ( typeof parsedUriPath === 'string' ) {
				parserResult.path = parsedUriPath;
			}

			// @NOTE Unserialize query string if it exists
			if ( typeof parsedUriQuery === 'string' && parsedUriQuery.length > 0 ) {
				const uriQueryObject : MixedObjectType = unserialize( parsedUriQuery );
				parserResult.query = uriQueryObject;
			}

			if ( parsedUriMatches !== null && parsedUriMatches !== undefined ) {
				// @NOTE Filter out any non strings and remove full match from result
				const filteredMatches : Array<string> = parsedUriMatches
					.filter( match => ( typeof match === 'string') )
					.slice( 1 );

				const hasFilteredMatches : boolean = ( filteredMatches !== null && filteredMatches !== undefined );
				const hasParameterMatches : boolean = ( parameterMatches !== null && parameterMatches !== undefined );

				if ( hasFilteredMatches === true && hasParameterMatches === true ) {
					// @FLOWFIXME Flow does not play nice with maybe types, supress Flow error (which will never occur).
					const keys : Array<string> = parameterMatches.map( match => match.replace( ':', '' ) );
					const values : Array<mixed> = filteredMatches.map( unserializeValue );

					const matchParams : ParserParamsType = associate( keys, values );

					parserResult.params = matchParams;
				}
			}
		}

		console.log( parserResult );

		return parserResult;
	}

}
