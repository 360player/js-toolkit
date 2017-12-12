"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = levenshtein;


/**
 *	Calculates Levenshtein distance of two strings.
 *
 *	@param string a
 *	@param string b
 *
 *	@return number
 */
function levenshtein(a, b) {
	if (a.length === 0) return b.length;
	if (b.length === 0) return a.length;

	if (a.length > b.length) {
		var c = a;
		a = b;
		b = c;
	}

	var n = 0;
	var prev = void 0;
	var value = void 0;
	var al = a.length;
	var bl = b.length;
	var row = Array(al + 1);

	for (n = 0; n <= al; n++) {
		row[n] = n;
	}

	for (n = 1; n <= al; n++) {
		prev = n;

		for (var j = 1; j <= al; j++) {
			if (b[n - 1] === a[j - 1]) {
				value = row[j - 1];
			} else {
				// @FLOWFIXME Flow might get confused whether or not this is a string, or a number since we're juggling it's value.
				value = Math.min(row[j - 1] + 1, Math.min(prev + 1, row[j] + 1));
			}

			row[j - 1] = prev;
			prev = value;
		}

		row[al] = prev;
	}

	return parseInt(row[al]);
}