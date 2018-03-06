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
export type ParserParamsType = { [ key : string ] : mixed };

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
	 *	Transforms URI path and populates parameters in that path.
	 *
	 *	@param string uriPattern
	 *	@param ParserParamsType uriParams
	 *
	 *	@return string
	 */
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

		let queryString : string;
		let queryParams : MixedObjectType = {};
		const queryPosition : number = uriPattern.indexOf( '?' );
		const hasQueryInPattern : boolean = ( queryPosition > -1 );

		if ( hasQueryInPattern ) {
			queryString = uriPattern.substring( queryPosition + 1 );
			uriPattern = uriPattern.substring( 0, queryPosition );

			queryParams = unserialize( queryString );
		}

		const transformedUrl : string = this.clean( uriPattern ).replace( REGEX_REPLACE_PATTERN, replaceMatch );
		queryString = serialize( Object.assign( {}, queryParams, omit( uriParams, ...omitKeys ) ) );
		const urlSuffix : string = ( queryString.length > 0 ) ? `?${queryString}` : '';

		return this.clean( transformedUrl + urlSuffix );
	}

	/**
	 *	Parses URI using URI pattern.
	 *
	 *	@param string uriPattern
	 *	@param string uriPath
	 *
	 *	@return ParserResultType
	 */
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
			if ( uriMatches.length <= 1 ) {
				uriMatches.push( '', '' );
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
				parserResult.match = true;

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

		return parserResult;
	}

}
