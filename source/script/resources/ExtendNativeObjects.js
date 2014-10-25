// Add some functions to the String and Array prototype, namespaced by "IC".
(function() {
	// "Internal" function to add functions to native objects with the usage of an namespace.
	var _addNamespacedFunctions = function(io_parent, is_namespaceName, io_functionsToAdd) {
		var lo_functionStorage = {};
		
		var lf_createGetter = function(is_functionName) {
			return function() {
				return function() {
					return io_functionsToAdd[is_functionName].apply(go_self, arguments);
				};
			};
		};
		
		for(var ls_functionName in io_functionsToAdd) {
			if(io_functionsToAdd.hasOwnProperty(ls_functionName)) {
				lo_functionStorage.__defineGetter__(ls_functionName, lf_createGetter(ls_functionName));
			}
		}
		
		io_parent.prototype.__defineGetter__(is_namespaceName, function() {
			go_self = this;
			return lo_functionStorage;
		});
	};
	
	/**
	 * Additional methods for processing strings.
	 * 
	 * @namespace	String.IC
	 */
	_addNamespacedFunctions(String, 'IC', {
		/**
		 * Replaces characters or whitespaces at the beginning of a string.
		 * 
		 * @function ltrim
		 * @memberof String.IC
		 * 
		 * @param	{string}	is_toRemove
		 *   A string containing the characters to remove (optional, if not set: trim whitespaces).
		 *
		 * @return	{string}
		 *   The trimmed string.
		 */
		ltrim: function(is_toRemove) {
			return !!is_toRemove ? this.replace(new RegExp('^[' + is_toRemove + ']+'), '') : this.replace(/^\s+/, '');
		},
		/**
		 * Replaces characters or whitespaces at the end of a string.
		 *
		 * @function rtrim
		 * @memberof String.IC
		 * 
		 * @param	{string}	is_toRemove
		 *   A string containing the characters to remove (optional, if not set: trim whitespaces).
		 *
		 * @return	{string}
		 *   The trimmed string.
		 */
		rtrim: function(is_toRemove) {
			return !!is_toRemove ? this.replace(new RegExp('[' + is_toRemove + ']+$'), '') : this.replace(/\s+$/, '');
		},
		/**
		 * Replaces characters or whitespaces at the beginning and end of a string.
		 *
		 * @function trim
		 * @memberof String.IC
		 * 
		 * @param	{string}	is_toRemove
		 *   A string containing the characters to remove (optional, if not set: trim whitespaces).
		 *
		 * @return	{string}
		 *   The trimmed string.
		 */
		trim: function(is_toRemove) {
			return this.IC.ltrim(is_toRemove).IC.rtrim(is_toRemove);
		},
		/**
		 * Encodes HTML-special characters in a string.
		 *
		 * @function encodeHTML
		 * @memberof String.IC
		 * 
		 * @return	{string}
		 *   The encoded string.
		 */
		encodeHTML: function() {
			// Set the characters to encode.
			var lo_characters = {
				'&':	'&amp;',
				'"':	'&quot;',
				'\'':	'&apos;',
				'<':	'&lt;',
				'>':	'&gt;'
			};
			
			return this.replace(/([\&"'<>])/g, function(is_string, is_symbol) { return lo_characters[is_symbol]; });
		},
		/**
		 * Decodes HTML-special characters in a string.
		 *
		 * @function decodeHTML
		 * @memberof String.IC
		 * 
		 * @return	{string}
		 *   The decoded string.
		 */
		decodeHTML: function() {
			// Set the characters to decode.
			var lo_characters = {
				'&amp;':	'&',
				'&quot;':	'"',
				'&apos;':	'\'',
				'&lt;':		'<',
				'&gt;':		'>'
			};
			
			return this.replace(/(&quot;|&apos;|&lt;|&gt;|&amp;)/g, function(is_string, is_symbol) { return lo_characters[is_symbol]; });
		},
		/**
		 * Repeats a string a specified number of times.
		 * 
		 * @function repeat
		 * @memberof String.IC
		 * 
		 * @param	{int}	ii_nr
		 *   The number of times to repeat the string.
		 * 
		 * @return	{string}
		 *   The repeated string.
		 */
		repeat: function(ii_nr) {
			var rs_repeated = this;
			
			for(var i = 1; i < ii_nr; i++) {
				rs_repeated += this;
			}
			
			return rs_repeated;
		}
	});
	
	/**
	 * Additional methods for processing arrays.
	 * 
	 * @namespace	Array
	 */
	_addNamespacedFunctions(Array, 'IC', {
		/**
		 * Inserts an element at a specified position into an array.
		 * 
		 * @function insert
		 * @memberof Array.IC
		 * 
		 * @param	{mixed}	im_item
		 *   The item which should be inserted.
		 * @param	{int}	ii_index
		 *   The position where the element should be added. If not set, the element will be added at the end.
		 */
		insert: function(im_item, ii_index) {
			var li_maxIndex = this.length;
			
			// Get the index to insert.
			var li_index = !ii_index && ii_index != 0 ? li_maxIndex : ii_index;
			li_index = Math.max(li_index, 0);			// No negative index.
			li_index = Math.min(li_index, li_maxIndex);	// No index bigger than the array length.
			
			this.splice(li_index, 0, im_item);
		},
		/**
		 * Deletes an element at a specified position from an array.
		 * 
		 * @function remove
		 * @memberof Array.IC
		 * 
		 * @param	{int}	ii_index
		 *   The position of the element which should be deleted.
		 */
		remove: function(ii_index) {
			if(ii_index >= 0 && ii_index < this.length) {
				this.splice(ii_index, 1);
			}
		}
	});
	
	/**
	 * Additional methods for processing dates.
	 * 
	 * @namespace	Date
	 */
	_addNamespacedFunctions(Date, 'IC', {
		/**
		 * Formats a date / time.
		 * 
		 * Options:
		 *   yyyy:	year, four digits
		 *   yy:	year, two digits
		 *   MM:	month, leading 0
		 *   M:		month, no leading 0
		 *   dd:	day, leading 0
		 *   d:		day, no leading 0
		 *   hh:	hour, 1-12, leading 0
		 *   h:		hour, 1-12, no leading 0
		 *   HH:	hour, 0-23, leading 0
		 *   H:		hour, 0-23, no leading 0
		 *   mm:	minute, leading 0
		 *   m:		minute, no leading 0
		 *   ss:	seconds, leading 0
		 *   s:		seconds, no leading 0
		 *   SSS:	milliseconds, leading 0
		 *   S:		milliseconds, no leading 0
		 *   a:		AM / PM
		 * 
		 * Example:
		 *   'yyyy-MM-dd HH:mm:ss.SSS'
		 * 
		 * @function format
		 * @memberof Date.IC
		 * 
		 * @param	{string}	is_pattern
		 *   The pattern for the output.
		 */
		format: function(is_pattern) {
			var lo_possibleOptions = {
				'yyyy':	this.getFullYear(),		// year, four digits
				'yy':	this.getYear() % 100,	// year, two digits
				'MM':	this.getMonth() + 1,	// month, leading 0
				'M':	this.getMonth() + 1,	// month, no leading 0
				'dd':	this.getDate(),			// day, leading 0
				'd':	this.getDate(),			// day, no leading 0
				'hh':	this.getHours() + 1,	// hour, 1-12, leading 0
				'h':	this.getHours() + 1,	// hour, 1-12, no leading 0
				'HH':	this.getHours(),		// hour, 0-23, leading 0
				'H':	this.getHours(),		// hour, 0-23, no leading 0
				'mm':	this.getMinutes(),		// minute, leading 0
				'm':	this.getMinutes(),		// minute, no leading 0
				'ss':	this.getSeconds(),		// seconds, leading 0
				's':	this.getSeconds(),		// seconds, no leading 0
				'SSS':	this.getMilliseconds(),	// milliseconds, ledaing 0
				'S':	this.getMilliseconds(),	// milliseconds, no leading 0
				'a':	'AM'					// AM / PM
			};
			
			if(lo_possibleOptions.MM < 10)	lo_possibleOptions.MM = '0' + lo_possibleOptions.MM;
			if(lo_possibleOptions.dd < 10)	lo_possibleOptions.dd = '0' + lo_possibleOptions.dd;
			if(lo_possibleOptions.h > 12)	lo_possibleOptions.hh = lo_possibleOptions.h = lo_possibleOptions.h - 12;
			if(lo_possibleOptions.hh < 10)	lo_possibleOptions.hh = '0' + lo_possibleOptions.hh;
			if(lo_possibleOptions.HH < 10)	lo_possibleOptions.HH = '0' + lo_possibleOptions.HH;
			if(lo_possibleOptions.mm < 10)	lo_possibleOptions.mm = '0' + lo_possibleOptions.mm;
			if(lo_possibleOptions.ss < 10)	lo_possibleOptions.ss = '0' + lo_possibleOptions.ss;
			if(lo_possibleOptions.S < 100)	lo_possibleOptions.SSS = '0' + lo_possibleOptions.SSS;
			if(lo_possibleOptions.S < 10)	lo_possibleOptions.SSS = '0' + lo_possibleOptions.SSS;
			if(lo_possibleOptions.H > 11)	lo_possibleOptions.a = 'PM';
			
			var rs_pattern = is_pattern;
			
			for(var ls_option in lo_possibleOptions) {
				rs_pattern = rs_pattern.replace(new RegExp('(' + ls_option + ')', 'g'), lo_possibleOptions[ls_option]);
			}
			
			return rs_pattern;
		}
	});
})();