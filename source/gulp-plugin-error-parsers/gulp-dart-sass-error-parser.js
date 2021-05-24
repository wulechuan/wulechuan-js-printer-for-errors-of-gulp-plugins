module.exports = function parseGulpSassPluginError(error) {
	if (typeof error !== 'object') {
		return null;
	}

	const shouldPrintErrorObjectForDebugging = false;
	if (shouldPrintErrorObjectForDebugging) {
		require('../utils/print-javascript-object')(error);
		return;
	}

	const {
		status:          sassErrorStatusNumber,
		messageOriginal: conclusionMessage,
		message,         // for gulp-dart-sass, this property is only used for asserting the error to a valid one
		formatted:       messageThatContainsInvolvedSnippet,
		name:            errorRawType,
		file:            stackTopItemFilePath, // also available as fileName (camel case).
		line:            stackTopItemLineNumber,
		column:          stackTopItemColumnNumber,
	} = error;

	if (! message) {
		return null;
	}

	if (! stackTopItemFilePath) {
		return null;
	}



	let involvedErrorLine;
	// let sassErrorDecorationLine;
	// let errorDecorationLine;

	const matchingResult1 =  messageThatContainsInvolvedSnippet.match(/ss\n>> ([^\n]+)\n/);
	if (matchingResult1) {
		[ , involvedErrorLine ] = matchingResult1;
	}

	const involvedSnippet = [ involvedErrorLine ];

	return {
		errorType: `${errorRawType}(${sassErrorStatusNumber})`,

		stackTopItem: {
			path:                                  stackTopItemFilePath,
			lineNumber:                            stackTopItemLineNumber,
			columnNumber:                          stackTopItemColumnNumber,
			involvedSnippet,

			involvedSnippetKeyLineIndexInTheArray: 0,

			conclusionMessage,
		},

		deeperStacks: null,
	};
};
