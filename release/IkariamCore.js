/**
 * Additional methods for processing strings.
 * 
 * @namespace	String
 */
/**
 * Additional methods for processing arrays.
 * 
 * @namespace	Array
 */
// This curly bracket is for easy folding of all prototype methods and has not other sense. Please don't remove. :)
{
	/**
	 * Replaces characters or whitespaces at the beginning of a string.
	 *
	 * @param	{string}	toRemove
	 *   A string containing the characters to remove (optional, if not set: trim whitespaces).
	 *
	 * @return	{string}
	 *   The trimmed string.
	 */
	String.prototype.ltrim = function(toRemove) {
		// Is there a string with the characters to remove?
		var special = !!toRemove;
	
		// Return the trimmed string.
		return special ? this.replace(new RegExp('^[' + toRemove + ']+'), '') : this.replace(/^\s+/, '');
	};
	
	/**
	 * Replaces characters or whitespaces at the end of a string.
	 *
	 * @param	{string}	toRemove
	 *   A string containing the characters to remove (optional, if not set: trim whitespaces).
	 *
	 * @return	{string}
	 *   The trimmed string.
	 */
	String.prototype.rtrim = function(toRemove) {
		// Is there a string with the characters to remove?
		var special = !!toRemove;
	
		// Return the trimmed string.
		return special ? this.replace(new RegExp('[' + toRemove + ']+$'), '') : this.replace(/\s+$/, '');
	};
	
	/**
	 * Replaces characters or whitespaces at the beginning and end of a string.
	 *
	 * @param	{string}	toRemove
	 *   A string containing the characters to remove (optional, if not set: trim whitespaces).
	 *
	 * @return	{string}
	 *   The trimmed string.
	 */
	String.prototype.trim = function(toRemove) {
		return this.ltrim(toRemove).rtrim(toRemove);
	};
	
	/**
	 * Encodes HTML-special characters in a string.
	 *
	 * @return	{string}
	 *   The encoded string.
	 */
	String.prototype.encodeHTML = function() {
		// Set the characters to encode.
		var characters = {
			'&':	'&amp;',
			'"':	'&quot;',
			'\'':	'&apos;',
			'<':	'&lt;',
			'>':	'&gt;'
		};
		
		// Return the encoded string.
		return this.replace(/([\&"'<>])/g, function(string, symbol) { return characters[symbol]; });
	};
	
	/**
	 * Decodes HTML-special characters in a string.
	 *
	 * @return	{string}
	 *   The decoded string.
	 */
	String.prototype.decodeHTML = function() {
		// Set the characters to decode.
		var characters = {
			'&amp;':	'&',
			'&quot;':	'"',
			'&apos;':	'\'',
			'&lt;':		'<',
			'&gt;':		'>'
		};
		
		// Return the decoded string.
		return this.replace(/(&quot;|&apos;|&lt;|&gt;|&amp;)/g, function(string, symbol) { return characters[symbol]; });
	};
	
	/**
	 * Repeats a string a specified number of times.
	 * 
	 * @param	{int}	nr
	 *   The number of times to repeat the string.
	 * 
	 * @return	{string}
	 *   The repeated string.
	 */
	String.prototype.repeat = function(nr) {
		var ret = this;
		
		// Repeat the string.
		for(var i = 1; i < nr; i++) {
			ret += this;
		}
		
		return ret;
	};
	
	/**
	 * Inserts an element at a specified position into an array.
	 * 
	 * @param	{mixed}	item
	 *   The item which should be inserted.
	 * @param	{int}	index
	 *   The position where the element should be added. If not set, the element will be added at the end.
	 */
	Array.prototype.insert = function (item, index) {
		var maxIndex = this.length;
		
		// Get the index to insert.
		index = !index && index != 0 ? maxIndex : index;
		index = Math.max(index, 0);			// No negative index.
		index = Math.min(index, maxIndex);	// No index bigger than the array length.
		
		this.splice(index, 0, item);
	};
	
	/**
	 * Deletes an element at a specified position from an array.
	 * 
	 * @param	{int}	index
	 *   The position of the element which should be deleted.
	 */
	Array.prototype.remove = function(index) {
		if(index >= 0 && index < this.length - 1) {
			this.splice(index, 1);
		}
	};
}

/**
 * Instantiate a new set of core functions.<br>
 * {@link https://www.assembla.com/spaces/ikariam-tools/ Script homepage}
 * 
 * @version	1.0
 * @author	Tobbe	<contact@ikascripts.de>
 * 
 * @global
 * 
 * @class
 * @classdesc	Core functions for Ikariam.
 */
function IkariamCore() {
	/**
	 * Storage for accessing <code>this</code> as reference to IkariamCore in subfunctions. Do <b>NOT</b> delete!
	 * 
	 * @private
	 * @inner
	 * 
	 * @type	IkariamCore
	 */
	var _this = this;
	
	/**
	 * A reference to the window / unsafeWindow.
	 * 
	 * @instance
	 * 
	 * @type	window
	 */
	this.win = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;
	
	/**
	 * Reference to window.ikariam.
	 * 
	 * @instance
	 * 
	 * @type	object
	 */
	this.ika = this.win.ikariam;
	
	// Set the console to the "rescued" debugConsole.
	var _console = this.win.debugConsole;
	
	// If debugging is disabled or the debug console not available, set all functions to "null".
	if(!scriptInfo.debug || !_console) {
		_console = {};
	}
	
	// Define all Firebug tags.
	var _tags = ['assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error', 'exception',
				'group', 'groupCollapsed', 'groupEnd', 'info', 'log', 'profile', 'profileEnd',
				'table', 'time', 'timeEnd', 'timeStamp', 'trace', 'warn'];
	
	// Check all firebug functions.
	for(var i = 0; i < _tags.length; i++) {
		// Get the key.
		var _key = _tags[i];
		
		// If the function is not set yet, set it to "null".
		if(!_console[_key]) {
			_console[_key] = function() { return; };
		}
	}
	
	/**
	 * Debugging console.
	 * For more information about commands that are available for the Firebug console see {@link http://getfirebug.com/wiki/index.php/Console_API Firebug Console API}.<br>
	 * Available commands: <code>assert, clear, count, debug, dir, dirxml, error, exception, group, groupCollapsed, groupEnd,
	 * info, log, profile, profileEnd, table, time, timeEnd, timeStamp, trace, warn</code><br>
	 * <br>
	 * The console is deactivated by the ikariam page but with the script {@link https://userscripts.org/scripts/show/158528 RescueConsole} you can use it.
	 * 
	 * @instance
	 * 
	 * @type	console
	 */
	this.con = _console;

	/**
	 * Instantiate a new set of myGM functions.
	 * 
	 * @inner
	 * 
	 * @class
	 * @classdesc	Functions for cross-browser compatibility of the GM_* functions.<br>Also there are some new functions implemented.
	 */
	function myGM() {
		/*--------------------------------------------*
		 * Private variables, functions and settings. *
		 *--------------------------------------------*/
		
		/**
		 * Storage for style sheets which will be added by the script.
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	element[]
		 */
		var _styleSheets = {};
		
		/**
		 * Storage for notification id for possibility to identify a notification popup.
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	int
		 */
		var _notificationId = 0;
		
		/**
		 * The prefix which schuld be added to the values stored in localStorage / cookies.
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	string
		 */
		var _prefix = 'script' + scriptInfo.id;
		
		/**
		 * If the Greasemonkey functions GM_setVaule, GM_getValue, GM_deleteValue and GM_listValues can be used.
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	boolean
		 */
		var _canUseGmStorage = !(typeof GM_getValue == 'undefined' || (typeof GM_getValue.toString == 'function' && GM_getValue.toString().indexOf('not supported') > -1))
									&& !(typeof GM_setValue == 'undefined' || (typeof GM_setValue.toString == 'function' && GM_setValue.toString().indexOf('not supported') > -1))
									&& !(typeof GM_deleteValue == 'undefined' || (typeof GM_deleteValue.toString == 'function' && GM_deleteValue.toString().indexOf('not supported') > -1))
									&& !(typeof GM_listValues == 'undefined' || (typeof GM_listValues.toString == 'function' && GM_listValues.toString().indexOf('not supported') > -1));
		
		/**
		 * If the Greasemonkey function GM_getResourceText can be used.
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	boolean
		 */
		var _canUseGmRessource = !(typeof GM_getResourceText == 'undefined' || (typeof GM_getResourceText.toString == 'function' && GM_getResourceText.toString().indexOf('not supported') > -1));
		
		/**
		 * If the Greasemonkey function GM_xmlhttpRequest can be used.
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	boolean
		 */
		var _canUseGmXhr = !(typeof GM_xmlhttpRequest == 'undefined' || (typeof GM_xmlhttpRequest.toString == 'function' && GM_xmlhttpRequest.toString().indexOf('not supported') > -1));
		
		/**
		 * If the local storage can be used.
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	boolean
		 */
		var _canUseLocalStorage = !!_this.win.localStorage;
		
		/*-------------------------------------------*
		 * Public variables, functions and settings. *
		 *-------------------------------------------*/
		
		/**
		 * Read only access to the script identifying prefix.
		 * 
		 * @instance
		 * 
		 * @return	{string}
		 *   The prefix for storing.
		 */
		this.prefix = function() {
			return _prefix;
		};
		
		/**
		 * Store a value specified by a key.
		 * 
		 * @instance
		 * 
		 * @param	{string}	key
		 *   The key of the value.
		 * @param	{mixed}	value
		 *   The value to store.
		 */
		this.setValue = function(key, value) {
			// Stringify the value to store also arrays.
			var toStore = _this.win.JSON.stringify(value);
	
			// If the use of the default GM_setValue ist possible, use it.
			if(_canUseGmStorage) {
				// Store the value.
				GM_setValue(key, toStore);
	
			// Otherwise use the local storage if possible.
			} else if(_canUseLocalStorage) {
				// Store the value.
				_this.win.localStorage.setItem(_prefix + key, toStore);
	
			// Otherwise use cookies.
			} else {
				// Prepare the cookie name and value.
				var data	= escape(_prefix + key) + '=' + escape(toStore);
	
				// Set the expire date to January 1st, 2020.
				var expire	= 'expires=' + (new Date(2020, 0, 1, 0, 0, 0, 0)).toGMTString();
	
				// Set the path to root.
				var path	= 'path=/';
	
				// Made the cookie accessible from all servers.
				var domain	= 'domain=ikariam.com';
	
				// Set the cookie.
				_this.win.document.cookie = data + ';' + expire + ';' + path + ';' + domain;
			}
		};
	
		/**
		 * Get a value and return it.
		 * 
		 * @instance
		 * 
		 * @param	{string}	key
		 *   The key of the value.
		 * @param	{mixed}		defaultValue
		 *   The value which is set if the value is not set.
		 *
		 * @return	{mixed}
		 *   The stored value.
		 */
		this.getValue = function(key, defaultValue) {
			// Put the default value to JSON.
			defaultValue = _this.win.JSON.stringify(defaultValue);
			
			// Storage for the value.
			var value = defaultValue;
	
			// If the use of the default GM_getValue ist possible, use it.
			if(_canUseGmStorage) {
				// Get the value.
				value = GM_getValue(key, defaultValue);
	
			// Otherwise use the local storage if possible.
			} else if(_canUseLocalStorage) {
				// Get the value.
				var valueTmp = _this.win.localStorage.getItem(_prefix + key);
	
				// If the value is not set, let the default value set.
				if(valueTmp) {
					value = valueTmp;
				}
	
			// Otherwise use cookies.
			} else {
				// Get all cookies.
				var allCookies = document.cookie.split("; ");
	
				// Loop over all cookies.
				for(var i = 0; i < allCookies.length; i++) {
					// Get the key and value of a cookie.
					var oneCookie = allCookies[i].split("=");
	
					// If the key is the correct key, get the value.
					if(oneCookie[0] == escape(_prefix + key)) {
						// Get the value and abort the loop.
						value = unescape(oneCookie[1]);
						break;
					}
				}
			}
			
			// Return the value (parsed for the correct return type).
			return _this.win.JSON.parse(value);
		};
	
		/**
		 * Delete a value specified by a key.
		 * 
		 * @instance
		 * 
		 * @param	{string}	key
		 *   The key of the value.
		 */
		this.deleteValue = function(key) {
			// If the use of the default GM_deleteValue ist possible, use it.
			if(_canUseGmStorage) {
				// Delete the value.
				GM_deleteValue(key);
	
			// Otherwise use the local storage if possible.
			} else if(_canUseLocalStorage) {
				// Remove the value.
				_this.win.localStorage.removeItem(_prefix + key);
	
			// Otherwise use cookies.
			} else {
				// Prepare the cookie name.
				var data	= escape(_prefix + key) + '=';
	
				// Set the expire date to January 1st, 2000 (this will delete the cookie).
				var expire	= 'expires=' + (new Date(2000, 0, 1, 0, 0, 0, 0)).toGMTString();
	
				// Set the path to root.
				var path	= 'path=/';
	
				// Made the cookie accessible from all servers.
				var domain	= 'domain=ikariam.com';
	
				// Set the cookie.
				_this.win.document.cookie = data + ';' + expire + ';' + path + ';' + domain;
			}
		};
	
		/**
		 * Returns an array with the keys of all values stored by the script.
		 * 
		 * @instance
		 * 
		 * @return	{mixed[]}
		 *   The array with all keys.
		 */
		this.listValues = function() {
			// Create an array for the storage of the values keys.
			var key = new Array();
	
			// If the use of the default GM_listValues ist possible, use it.
			if(_canUseGmStorage) {
				// Store the key(s) to the array.
				key = GM_listValues();
	
			// Otherwise use the local storage if possible.
			} else if(_canUseLocalStorage) {
				// Loop over all stored values.
				for(var i = 0; i < _this.win.localStorage.length; i++) {
					// Get the key name of the key with the number i.
					var keyName = _this.win.localStorage.key(i);
	
					// If the value is set by the script, push the key name to the array.
					if(keyName.indexOf(_prefix) != -1) {
						key.push(keyName.replace(_prefix, ''));
					}
				}
	
			// Otherwise use cookies.
			} else {
				// Get all cookies.
				var allCookies = document.cookie.split("; ");
	
				// Loop over all cookies.
				for(var i = 0; i < allCookies.length; i++) {
					// Get the key name of a cookie.
					var keyName = unescape(allCookies[i].split("=")[0]);
	
					// If the key value is set by the script, push the key name to the array.
					if(keyName.indexOf(_prefix) != -1) {
						key.push(keyName.replace(_prefix, ''));
					}
				}
			}
	
			// Return all keys.
			return key;
		};
	
		/**
		 * Adds a style element to the head of the page and return it.
		 * 
		 * @instance
		 * 
		 * @param	{string}	styleRules
		 *   The style rules to be set.
		 * @param	{string}	id
		 *   An id for the style set, to have the possibility to delete it. (optional, if none is set, the stylesheet is not stored)
		 * @param	{boolean}	overwrite
		 *   If a style with id should overwrite an existing style.
		 *
		 * @return	{boolean}
		 *    If the stylesheet was stored with the id.
		 */
		this.addStyle = function(styleRules, id, overwrite) {
			// If the element was stored is saved here.
			var storedWithId = false;
	
			// If overwrite, remove the old style sheet.
			if(overwrite && overwrite == true) {
				this.removeStyle(id);
			}
	
			// If the stylesheet doesn't exists.
			if(!id || (id && !_styleSheets[id])) {
				// Create a new style element and set the style rules.
				var style = this.addElement('style', document.head);
				style.type	= 'text/css';
				style.innerHTML	= styleRules;
	
				// If an id is set, store it.
				if(id) {
					_styleSheets[id] = style;
					storedWithId = true;
				}
			}
	
			// Return if the stylesheet was stored with an id.
			return storedWithId;
		};
	
		/**
		 * Removes a style element set by the script.
		 * 
		 * @instance
		 * 
		 * @param	{string}	id
		 *   The id of the stylesheet to delete.
		 *
		 * @return	{boolean}
		 *    If the stylesheet could be deleted.
		 */
		this.removeStyle = function(id) {
			// Stores if the stylesheet could be removed.
			var removed = false;
	
			// If there is an id set and a stylesheet with the id exists.
			if(id && _styleSheets[id]) {
				// Remove the stylesheet from the page.
				document.head.removeChild(_styleSheets[id]);
	
				// Remove the stylesheet from the array.
				delete	_styleSheets[id];
	
				// Set removed to true.
				removed = true;
			}
	
			// Return if the stylesheet could be removed.
			return removed;
		};
		
		/**
		 * Makes a cross-site XMLHttpRequest.
		 * 
		 * @instance
		 * 
		 * @param	{mixed[]}	args
		 *   The arguments the request needs. (specified here: {@link http://wiki.greasespot.net/GM_xmlhttpRequest GM_xmlhttpRequest})
		 * 
		 * @return	{mixed}
		 *   The response text or a hint indicating an error.
		 */
		this.xhr = function(args) {
			// Storage for the result of the request.
			var responseText;
	
			// Check if all required data is given.
			if(!args.method || !args.url || !args.onload) {
				return false;
			}
	
			// If the use of the default GM_xmlhttpRequest ist possible, use it.
			if(_canUseGmXhr) {
				// Sent the request.
				var response = GM_xmlhttpRequest(args);
	
				// Get the response text.
				responseText = response.responseText;
	
			// Otherwise show a hint for the missing possibility to fetch the data.
			} else {
				// Storage if the link fetches metadata from userscripts.org
				var isJSON		= (args.url.search(/\.json$/i) != -1);
	
				// Otherwise if it is JSON.
				if(isJSON) {
					// Do the request with a string indicating the error.
					args.onload('{ "is_error": true }');
	
					// Return a string indicating the error.
					responseText = '{ "is_error": true }';
	
				// Otherwise.
				} else {
					responseText = false;
				}
			}
	
			// Return the responseText.
			return responseText;
		};
		
		/**
		 * Returns the content of a resource parsed with JSON.parse.
		 * 
		 * @instance
		 * 
		 * @param	{string}	name
		 *   The name of the resource to parse.
		 */
		this.getResourceParsed = function(name, xhrUrl) {
			// Storage for the response text.
			var responseText = '';
	
			// Function for safer parsing.
			var safeParse = function(key, value) {
				// If the value is a function, return just the string, so it is not executable.
				if(typeof value === 'function' || Object.prototype.toString.apply(value) === '[object function]') {
					return value.toString();
				}

				// Return the value.
				return value;
			};
	
			// If the use of the default GM_getRessourceText ist possible, use it.
			if(_canUseGmRessource) {
				// Set the parsed text.
				responseText = GM_getResourceText(name);
	
			// Otherwise perform a xmlHttpRequest.
			} else {
				// Perform the xmlHttpRequest.
				responseText = this.xhr({
					method:			'GET',
					url:			xhrUrl,
					headers:		{ 'User-agent': navigator.userAgent, 'Accept': 'text/html' },
					synchronous:	true,
					onload:			function(response) { return false; }
				});
			}
	
			// Return the parsed resource text.
			return _this.win.JSON.parse(responseText, safeParse);
		};
		
		/**
		 * Gets the first matching child element by a query and returns it.
		 * 
		 * @instance
		 * 
		 * @param	{string}	query
		 *   The query for the element.
		 * @param	{element}	parent
		 *   The parent element. (optional, default document)
		 *
		 * @return	{element}
		 *   The element.
		 */
		this.$ = function(query, parent) {
			return this.$$(query, parent)[0];
		};
	
		/**
		 * Gets all matching child elements by a query and returns them.
		 * 
		 * @instance
		 * 
		 * @param	{string}	query
		 *   The query for the elements.
		 * @param	{element}	parent
		 *   The parent element. (optional, default document)
		 *
		 * @return	{element[]}
		 *   The elements.
		 */
		this.$$ = function(query, parent) {
			// If there is no parent set, set it to document.
			if(!parent)	parent = document;
			
			// Return the elements.
			return Array.prototype.slice.call(parent.querySelectorAll(query));
		};
		
		/**
		 * Returns the value of the selected option of a select field.
		 *
		 * @param	{string}	id
		 *   The last part of the id of the element.
		 * @param	{boolean}	hasNoPrefix
		 *   Says if the id has no prefix.
		 * @param	{boolean}	addNoSelect
		 *   Says if there should not be added a "Select" at the end of the id.
		 *
		 * @return	{string}
		 *   The value.
		 */
		this.getSelectValue = function(id, hasNoPrefix, addNoSelect) {
			// Get the select field.
			var select = this.$('#' + (hasNoPrefix ? '' : _prefix) + id + (addNoSelect ? '' : 'Select'));
	
			// Return the value.
			return select.options[select.selectedIndex].value;
		};
		
		/**
		 * Creates a new element and adds it to a parent.
		 * 
		 * @instance
		 * 
		 * @param	{string}				type
		 *   The type of the new element.
		 * @param	{element}				parent
		 *   The parent of the new element.
		 * @param	{string}				id
		 *   The last part of the id of the element. (optional, if not set, no id will be set)
		 * @param	{string || String[]}	classes
		 *   The class(es) of the element. (optional, if not set, no class will be set)
		 * @param	{mixed[]}				style
		 *   The styles of the element. (optional, if not set, no style will be set)
		 * @param	{boolean || boolean[]}	hasPrefix
		 *   If no prefix should be used. (optional, if not set, a prefix will be used for id and no prefix will be used for classes)
		 * @param	{element}				nextSib
		 *   The next sibling of the element. (optional, if not set, the element will be added at the end)
		 *
		 * @return	{element}
		 *   The new element.
		 */
		this.addElement = function(type, parent, id, classes, style, hasPrefix, nextSib) {
			// Create the new Element.
			var newElement = document.createElement(type);
	
			// If there is a id, set it.
			if(id) {
				// Get the id prefix.
				var idPrefix = !(hasPrefix == false || (hasPrefix && hasPrefix.id == false)) ? _prefix : '';
	
				// Set the id.
				newElement.id = idPrefix + id;
			}
	
			// Add all classes.
			if(classes && classes != '') {
				// Get the class prefix.
				var classPrefix = !!(hasPrefix == true || (hasPrefix && hasPrefix.classes == true)) ? _prefix : '';
	
				// Set the class(es).
				if(typeof classes == 'string') {
					newElement.classList.add(classPrefix + classes);
				} else {
					for(var i = 0; i < classes.length; i++) {
						if(classes[i] != '') {
							newElement.classList.add(classPrefix + classes[i]);
						}
					}
				}
			}
	
			if(style) {
				for(var i = 0; i < style.length; i++) {
					newElement.style[style[i][0]] = style[i][1];
				}
			}
	
			// Insert the element.
			parent.insertBefore(newElement, nextSib);
	
			// Return the new element.
			return newElement;
		};
		
		/**
		 * Creates new checkboxes and adds it to a parent.
		 * 
		 * @instance
		 * 
		 * @param	{element}	parent
		 *   The parent of the new checkboxes.
		 * @param	{mixed[]}	cbData
		 *   An array containing the data (id, label, checked) of each checkbox.
		 */
		this.addCheckboxes = function(parent, cbData) {
			// Create the checkboxes.
			for(var i = 0; i < cbData.length; i++) {
				// Create the wrapper for the checkbox and the label.
				var wrapper	= _this.myGM.addElement('div', parent, null, 'cbWrapper');
				
				// Create the checkbox and set the attributes.
				var cb		= _this.myGM.addElement('input', wrapper, cbData[i]['id'] + 'Cb', 'checkbox');
				cb.type		= 'checkbox';
				cb.title	= cbData[i]['label'];
				cb.checked	= cbData[i]['checked'] ? 'checked' : '';
			}
			
			// Replace the checkboxes for better appearance.
			_this.ika.controller.replaceCheckboxes();
		};
	
		/**
		 * Creates a new select field and adds it to a parent table.
		 * 
		 * @instance
		 * 
		 * @param	{element}	parentTable
		 *   The parent table of the new select field.
		 * @param	{string}	id
		 *   The last part of the id of the select field.
		 * @param	{mixed}		selected
		 *   The value of the selected option.
		 * @param	{mixed[]}	opts
		 *   An array with the names an values of the options.<br>
		 *   Signature: <code>[{ value: 'val', name: 'name' }]</code>
		 * @param	{string}	labelText
		 *   The text of the select label.
		 */
		this.addSelect = function(parentTable, id, selected, opts, labelText) {
			// Create table row.
			var tr	= _this.myGM.addElement('tr', parentTable);
			
			// Create cells.
			var labelCell	= _this.myGM.addElement('td', tr);
			var selectCell	= _this.myGM.addElement('td', tr, null, 'left');
			
			// Create label.
			var selectLabel			= _this.myGM.addElement('span', labelCell);
			selectLabel.innerHTML	= labelText;
			
			// Create the wrapper for the select.
			var wrapper	= _this.myGM.addElement('div', selectCell, id + 'SelectContainer', ['select_container', 'size175'], new Array(['position', 'relative']));
			
			// Create the select field.
			var select	= _this.myGM.addElement('select', wrapper, id + 'Select', 'dropdown');
			
			// Add the Options.
			for(var i = 0; i < opts.length; i++) {
				// Create an option.
				var option			= _this.myGM.addElement('option', select);
				
				// Set the value and the name.
				option.value		= opts[i].value;
				option.innerHTML	= opts[i].name;
				
				// If the option is selected, set selected to true.
				if(option.value == selected) {
					option.selected = 'selected';
				}
			}
			
			// Replace the dropdown for better appearance.
			_this.ika.controller.replaceDropdownMenus();
		};
	
		/**
		 * Creates a button and adds it to a parent.
		 * 
		 * @instance
		 * 
		 * @param	{element}	parent
		 *   The parent element.
		 * @param	{string}	value
		 *   The value of the button.
		 * @param	{function}	callback
		 *   A callback which should be called when the user clicks on the button.<br>
		 *   Signature: <code>function() : void</code>
		 */
		this.addButton = function(parent, value, callback) {
			// Create the button wrapper.
			var buttonWrapper		= _this.myGM.addElement('div', parent, null, 'centerButton');
			
			// Create the button.
			var button			= _this.myGM.addElement('input', buttonWrapper, null, 'button');
			button.type			= 'button';
			button.value		= value;
			
			// Add a click action to the button.
			button.addEventListener('click', callback, false);
			
			return button;
		};
		
		/**
		 * Shows a notification to the user. You can either create a notification field or an input / output field.
		 * If the field should be an input field, the field is given to the callbacks as parameter.
		 * The abort button is only shown if the abort callback is set.
		 * Also it is possible to have two body parts or just one body part.
		 * This functionality is set by the notification text.<br><br>
		 * 
		 * Possible notification texts:<br>
		 * <code>&#09;text.header (optional)<br>
		 * &#09;text.body or text.bodyTop & text.bodyBottom<br>
		 * &#09;text.confirm (optional)<br>
		 * &#09;text.abort (optional)</code>
		 * 
		 * @instance
		 * 
		 * @param	{string[]}		text
		 *   The notification texts.
		 * @param	{function[]}	callback
		 *   The callbacks for confirm and abort. (optional, default: close panel)<br>
		 *   Signature with input: <code>function(textarea : element) : void</code>
		 *   Signature without input:  <code>function() : void</code>
		 * @param	{boolean}		input
		 *   If a input field should be used. (optional, default: false)
		 * 
		 * @return	{int}
		 *   The notification id.
		 */
		this.notification = function(text, callback, input) {
			// Raise the notification id.
			_notificationId += 1;
			
			// Set a local notification id to be able to have more than 1 notification panels.
			var localNotificationId = _notificationId;
			
			// Function to close the notification panel.
			var closeNotificationPanel = function() {
				// Remove the notification background.
				document.body.removeChild(_this.myGM.$('#' + _prefix + 'notificationBackground' + localNotificationId));
	
				// Remove the notification panel.
				document.body.removeChild(_this.myGM.$('#' + _prefix + 'notificationPanelContainer' + localNotificationId));
			};
			
			// Create the background and the container.
			this.addElement('div', document.body, 'notificationBackground' + localNotificationId, 'notificationBackground', null, true);
			var notificationPanelContainer		= this.addElement('div', document.body, 'notificationPanelContainer' + localNotificationId, 'notificationPanelContainer', null, true);
			var notificationPanel				= this.addElement('div', notificationPanelContainer, 'notificationPanel' + localNotificationId, 'notificationPanel', null, true);
	
			// Create the notification panel header.
			var notificationPanelHeader			= this.addElement('div', notificationPanel, 'notificationPanelHeader' + localNotificationId, 'notificationPanelHeader', null, true);
			var notificationPanelHeaderL		= this.addElement('div', notificationPanelHeader, 'notificationPanelHeaderL' + localNotificationId, 'notificationPanelHeaderL', null, true);
			var notificationPanelHeaderR		= this.addElement('div', notificationPanelHeaderL, 'notificationPanelHeaderR' + localNotificationId, 'notificationPanelHeaderR', null, true);
			var notificationPanelHeaderM		= this.addElement('div', notificationPanelHeaderR, 'notificationPanelHeaderM' + localNotificationId, 'notificationPanelHeaderM', null, true);
			notificationPanelHeaderM.innerHTML	= (text.header ? text.header : _this.Language.$('default_notification_header'));
			var notificationPanelClose			= this.addElement('div', notificationPanelHeaderM, 'notificationPanelClose' + localNotificationId, 'notificationPanelClose', null, true);
			notificationPanelClose.addEventListener('click', closeNotificationPanel, false);
			
			// Create the notification panel body.
			var notificationPanelBody			= this.addElement('div', notificationPanel, 'notificationPanelBody' + localNotificationId, 'notificationPanelBody', null, true);
			var notificationPanelBodyL			= this.addElement('div', notificationPanelBody, 'notificationPanelBodyL' + localNotificationId, 'notificationPanelBodyL', null, true);
			var notificationPanelBodyR			= this.addElement('div', notificationPanelBodyL, 'notificationPanelBodyR' + localNotificationId, 'notificationPanelBodyR', null, true);
			var notificationPanelBodyM			= this.addElement('div', notificationPanelBodyR, 'notificationPanelBodyM' + localNotificationId, 'notificationPanelBodyM', null, true);
			var bodyType = input ? 'textarea' : 'div';
			var body;
			if(text.body) {
				var notificationPanelBodyMContent		= this.addElement(bodyType, notificationPanelBodyM, 'notificationPanelBodyMContent' + localNotificationId, 'notificationPanelBodyMContent', null, true);
				notificationPanelBodyMContent.innerHTML	= text.body;
				body = input ? notificationPanelBodyMContent : null;
			} else {
				var notificationPanelBodyMTop			= this.addElement('div', notificationPanelBodyM, 'notificationPanelBodyMTop' + localNotificationId, 'notificationPanelBodyMTop', null, true);
				notificationPanelBodyMTop.innerHTML		= text.bodyTop ? text.bodyTop : '';
				var notificationPanelBodyMBottom		= this.addElement(bodyType, notificationPanelBodyM, 'notificationPanelBodyMBottom' + localNotificationId, 'notificationPanelBodyMBottom', null, true);
				notificationPanelBodyMBottom.innerHTML	= text.bodyBottom ? text.bodyBottom : '';
				body = input ? notificationPanelBodyMBottom : null;
			}
			this.addElement('div', notificationPanelBodyM, 'notificationPanelBodyPlaceholder' + localNotificationId, 'notificationPanelBodyPlaceholder', null, true);
	
			// Create the notification panel footer.
			var notificationPanelFooter			= this.addElement('div', notificationPanel, 'notificationPanelFooter' + localNotificationId, 'notificationPanelFooter', null, true);
			var notificationPanelFooterL		= this.addElement('div', notificationPanelFooter, 'notificationPanelFooterL' + localNotificationId, 'notificationPanelFooterL', null, true);
			var notificationPanelFooterR		= this.addElement('div', notificationPanelFooterL, 'notificationPanelFooterR' + localNotificationId, 'notificationPanelFooterR', null, true);
			var notificationPanelFooterM		= this.addElement('div', notificationPanelFooterR, 'notificationPanelFooterM' + localNotificationId, 'notificationPanelFooterM', null, true);
			notificationPanelFooterM.innerHTML	= scriptInfo.name + ' v' + scriptInfo.version;
			
			// Create the button wrapper.
			var notificationPanelButtonWrapper	= this.addElement('div', notificationPanel, 'notificationPanelButtonWrapper' + localNotificationId, 'notificationPanelButtonWrapper', null, true);
			
			// Create the confirm button.
			var notificationPanelConfirm		= this.addElement('input', notificationPanelButtonWrapper, 'notificationPanelConfirm' + localNotificationId, ['notificationPanelButton', 'notificationPanelButtonConfirm'], null, true);
			notificationPanelConfirm.type		= 'button';
			notificationPanelConfirm.value		= text.confirm ? text.confirm : _this.Language.$('default_notification_button_confirm');
			if(callback && callback.confirm) {
				if(body) {
					notificationPanelConfirm.addEventListener('click', function() { closeNotificationPanel(); callback.confirm(body); }, false);
				} else {
					notificationPanelConfirm.addEventListener('click', function() { closeNotificationPanel(); callback.confirm(); }, false);
				}
			} else {
				notificationPanelConfirm.addEventListener('click', closeNotificationPanel, false);
			}
			
			// Create the abort button if needed.
			if(callback && callback.abort) {
				var notificationPanelAbort			= this.addElement('input', notificationPanelButtonWrapper, 'notificationPanelAbort' + localNotificationId, ['notificationPanelButton', 'notificationPanelButtonAbort'], null, true);
				notificationPanelAbort.type			= 'button';
				notificationPanelAbort.value		= text.abort ? text.abort : _this.Language.$('default_notification_button_abort');
				if(body) {
					notificationPanelAbort.addEventListener('click', function() { closeNotificationPanel(); callback.abort(body); }, false);
				} else {
					notificationPanelAbort.addEventListener('click', function() { closeNotificationPanel(); callback.abort(); }, false);
				}
			}
			
			return localNotificationId;
		};
		
		/**
		 * Toogle the show / hide Button image and title.
		 * 
		 * @instance
		 * 
		 * @param  {element}	button
		 *   The button to toggle.
		 */
		this.toggleShowHideButton = function(button) {
			// Switch the button picture.
			button.classList.toggle('minimizeImg');
			button.classList.toggle('maximizeImg');
			
			// Switch the button title.
			button.title = (button.title == _this.Language.$('general_fold')) ? _this.Language.$('general_expand') : _this.Language.$('general_fold');
		};
		
		/**
		 * Runs a callback on every property of an object which is not in the prototype.
		 * 
		 * @param	{object}	obj
		 *   The Object where forEach should be used.
		 * @param	{function}	callback
		 *   The callback which should be called.<br>
		 *   Signature: <code>function(propertyValue : mixed, propertyKey : string) : void</code>
		 */
		this.forEach = function(obj, callback) {
			for(var key in obj) {
				if(Object.prototype.hasOwnProperty.call(obj, key)) {
						callback(key, obj[key]);
					}
				}
		};
		
		/*--------------------*
		 * Set some settings. *
		 *--------------------*/
		
		// Set the notification style.
		this.addStyle(
				"." + _prefix + "notificationBackground					{ z-index: 1000000000000; position: fixed; visibility: visible; top: 0px; left: 0px; width: 100%; height: 100%; padding: 0; background-color: #000; opacity: .7; } \
				 ." + _prefix + "notificationPanelContainer				{ z-index: 1000000000001; position: fixed; visibility: visible; top: 100px; left: 50%; width: 500px; height: 370px; margin-left: -250px; padding: 0; text-align: left; color: #542C0F; font: 12px Arial,Helvetica,sans-serif; } \
				 ." + _prefix + "notificationPanel						{ position: relative; top: 0px; left: 0px; background-color: transparent; border: 0 none; overflow: hidden; } \
				 ." + _prefix + "notificationPanelHeader				{ height: 39px; background: none repeat scroll 0 0 transparent; font-weight: bold; line-height: 2; white-space: nowrap; } \
				 ." + _prefix + "notificationPanelHeaderL				{ height: 39px; background-image: url('skin/layout/notes_top_left.png'); background-position: left top; background-repeat: no-repeat; } \
				 ." + _prefix + "notificationPanelHeaderR				{ height: 39px; background-image: url('skin/layout/notes_top_right.png'); background-position: right top; background-repeat: no-repeat; } \
				 ." + _prefix + "notificationPanelHeaderM				{ height: 39px; margin: 0 14px 0 38px; padding: 12px 0 0; background-image: url('skin/layout/notes_top.png'); background-position: left top; background-repeat: repeat-x; color: #811709; line-height: 1.34em; } \
				 ." + _prefix + "notificationPanelBody					{ max-height: 311px; height: 100%; background: none repeat scroll 0 0 transparent; } \
				 ." + _prefix + "notificationPanelBodyL					{ height: 100%; background-image: url('skin/layout/notes_left.png'); background-position: left top; background-repeat: repeat-y; } \
				 ." + _prefix + "notificationPanelBodyR					{ height: 100%; background-image: url('skin/layout/notes_right.png'); background-position: right top; background-repeat: repeat-y; } \
				 ." + _prefix + "notificationPanelBodyM					{ height: 100%; background-color: #F7E7C5; background-image: none;  margin: 0 6px; padding: 0 10px; font-size: 14px; } \
				 ." + _prefix + "notificationPanelBodyMTop				{ max-height: 100px; line-height: 2; } \
				 ." + _prefix + "notificationPanelBodyMTop b			{ line-height: 3.5; font-size:110%; } \
				 ." + _prefix + "notificationPanelBodyM a				{ color: #811709; font-weight: bold; } \
				 ." + _prefix + "notificationPanelBodyM h2				{ font-weight: bold; } \
				 ." + _prefix + "notificationPanelBodyMContent			{ max-height: 270px; padding: 10px; background: url('skin/input/textfield.png') repeat-x scroll 0 0 #FFF7E1; border: 1px dotted #C0C0C0; font: 14px Arial,Helvetica,sans-serif; color: #000000; border-collapse: separate; overflow-y:auto; } \
				 ." + _prefix + "notificationPanelBodyMBottom			{ max-height: 170px; padding: 10px; background: url('skin/input/textfield.png') repeat-x scroll 0 0 #FFF7E1; border: 1px dotted #C0C0C0; font: 14px Arial,Helvetica,sans-serif; color: #000000; border-collapse: separate; overflow-y:auto; } \
				 textarea." + _prefix + "notificationPanelBodyMContent	{ height: 270px; width: 445px; resize: none; } \
				 textarea." + _prefix + "notificationPanelBodyMBottom	{ height: 170px; width: 445px; resize: none; } \
				 ." + _prefix + "notificationPanelBodyPlaceholder		{ height: 20px; } \
				 ." + _prefix + "notificationPanelFooter				{ height: 20px; background: none repeat scroll 0 0 transparent; } \
				 ." + _prefix + "notificationPanelFooterL				{ height: 100%; background-image: url('skin/layout/notes_left.png'); background-position: left top; background-repeat: repeat-y; border: 0 none; } \
				 ." + _prefix + "notificationPanelFooterR				{ height: 21px; background-image: url('skin/layout/notes_br.png'); background-position: right bottom; background-repeat: no-repeat; } \
				 ." + _prefix + "notificationPanelFooterM				{ background-color: #F7E7C5; border-bottom: 3px solid #D2A860; border-left: 2px solid #D2A860; margin: 0 23px 0 3px; padding: 3px 0 2px 3px; font-size: 77%; } \
				 ." + _prefix + "notificationPanelClose					{ cursor: pointer; position: absolute; top: 12px; right: 8px; width: 17px; height: 17px; background-image: url('skin/layout/notes_close.png'); } \
				 ." + _prefix + "notificationPanelButtonWrapper			{ bottom: -4px; position: absolute; margin: 10px auto; width: 100%; text-align: center; } \
				 ." + _prefix + "notificationPanelButton				{ background: url('skin/input/button.png') repeat-x scroll 0 0 #ECCF8E; border-color: #C9A584 #5D4C2F #5D4C2F #C9A584; border-style: double; border-width: 3px; cursor: pointer; display: inline; font-weight: bold; margin: 0px 5px; padding: 2px 10px; text-align: center; font-size: 12px; width: 100px; } \
				 ." + _prefix + "notificationPanelButton:hover			{ color: #B3713F; } \
				 ." + _prefix + "notificationPanelButton:active			{ border-color: #5D4C2F #C9A584 #C9A584 #5D4C2F; border-style: double; border-width: 3px; padding: 3px 10px 1px; } \
				 ." + _prefix + "notificationPanelButtonConfirm			{  } \
				 ." + _prefix + "notificationPanelButtonAbort			{  }",
				'notification', true
			);
		
		// Add the buttons for toggle buttons used styles.
		this.addStyle(
				".minimizeImg, .maximizeImg		{ background: url('skin/interface/window_control_sprite.png') no-repeat scroll 0 0 transparent; cursor: pointer; display: block; height: 18px; width: 18px; } \
				 .minimizeImg					{ background-position: -144px 0; } \
				 .minimizeImg:hover				{ background-position: -144px -19px; } \
				 .maximizeImg					{ background-position: -126px 0; } \
				 .maximizeImg:hover				{ background-position: -126px -19px; }",
				'toggleShowHideButton', true
			);
	}
	
	/**
	 * myGM for cross-browser compatibility of the GM_* functions. (use myGM.* instead of GM_*)<br>
	 * Also there are general used functions stored.
	 * 
	 * @instance
	 * 
	 * @type	IkariamCore~myGM
	 */
	this.myGM = new myGM;
	
	/**
	 * Instantiate a new set of Ikariam specific functions.
	 * 
	 * @inner
	 * 
	 * @class
	 * @classdesc	Ikariam specific functions.
	 */
	function Ikariam() {
		/*-------------------------------------------*
		 * Public variables, functions and settings. *
		 *-------------------------------------------*/
		
		/**
		 * Returns the name of the actual selected view (world, island, town).
		 * 
		 * @instance
		 * 
		 * @return	{string}
		 *   The name of the view.
		 */
		this.view = function() {
			// Get the id of the body.
			var viewId = document.body.id;
			var view = '';
			
			// Get the name of the view depending on the body id.
			switch(viewId) {
				case 'worldmap_iso':
					view = 'world';
				  break;
	
				case 'island':
					view = 'island';
				  break;
	
				case 'city':
					view = 'town';
				  break;
			}
			
			// Return the view name.
			return view;
		};
		
		/**
		 * Parses a string number to an int value.
		 * 
		 * @instance
		 * 
		 * @param	{string}	txt
		 *   The number to format.
		 *
		 * @return	{int}
		 *   The formatted value.
		 */
		this.getInt = function(txt) {
			// Return the formated number.
			return parseInt(txt.replace(/(\.|,)/g, ''));
		};
		
		/**
		 * Formats a number to that format that is used in Ikariam.
		 *
		 * @param	{int}					num
		 *   The number to format.
		 * @param	{boolean || boolean[]}	addColor
		 *   If the number should be coloured. (optional, if not set, a color will be used for negative and no color will be used for positive numbers)
		 * @param	{boolean}				usePlusSign
		 *   If a plus sign should be used for positive numbers.
		 * 
		 * @return	{string}
		 *   The formated number.
		 */
		this.formatToIkaNumber = function(num, addColor, usePlusSign) {
			var txt = num + '';
	
			// Set a seperator every 3 digits from the end.
			txt = txt.replace(/(\d)(?=(\d{3})+\b)/g, '$1' + Language.$('settings_kiloSep'));
	
			// If the number is negative and it is enabled, write it in red.
			if(num < 0 && !(addColor == false || (addColor && addColor.negative == false))) {
				txt = '<span class="red bold">' + txt + '</span>';
			}
	
			// If the number is positive.
			if(num > 0) {
				// Add the plus sign if wanted.
				txt = (usePlusSign ? '+' : '') + txt;
	
				// Color the text green if wanted.
				if(!!(addColor == true || (addColor && addColor.positive == true))) {
					txt = '<span class="green bold">' + txt + '</span>';
				}
			}
	
			// Return the formated number.
			return txt;
		};
		
		/**
		 * Returns if the user is logged in to the mobile version.
		 * 
		 * @instance
		 * 
		 * @return	{boolean}
		 *   The login-status to mobile.
		 */
		this.isMobileVersion = function() {
			return (top.location.href.search(/http:\/\/m/) > -1);
		},
	
		/**
		 * Returns a code consisting of the server name and the country code.
		 * 
		 * @instance
		 * 
		 * @return	{string}
		 *   The code.
		 */
		this.getServerCode = function() {
			// Split the host string.
			var code = top.location.host.split('.');
	
			// Set the language name.
			return (code ? code[1] + '_' + code[0] : 'undefined');
		};
		
		/**
		 * Shows a hint to the user (desktop).
		 * 
		 * @instance
		 * 
		 * @param	{string}	located
		 *   The location of the hint. Possible are all advisors, a clicked element or a committed element.
		 * @param	{string}	type
		 *   The type of the hint. Possible is confirm, error, neutral or follow the mouse.
		 * @param	{string}	msgText
		 *   The hint text.
		 * @param	{string}	msgBindTo
		 *   The JQuery selector of the element the tooltip should be bound to.
		 * @param	{boolean}	msgIsMinSize
		 *   If the message is minimized (only used if type = followMouse).
		 */
		this.showTooltip = function(located, type, msgText, msgBindTo, msgIsMinSize) {
			// Get the message location.
			var msgLocation = -1;
			switch(located) {
				case 'cityAdvisor':
					msgLocation = 1;
				  break;
	
				case 'militaryAdvisor':
					msgLocation = 2;
				  break;
	
				case 'researchAdvisor':
					msgLocation = 3;
				  break;
	
				case 'diplomacyAdvisor':
					msgLocation = 4;
				  break;
	
				case 'clickedElement':
					msgLocation = 5;
				  break;
	
				case 'committedElement':
					msgLocation = 6;
				  break;
			}
	
			// Get the message type.
			var msgType = -1;
			switch(type) {
				case 'confirm':
					msgType = 10;
				  break;
	
				case 'error':
					msgType = 11;
				  break;
	
				case 'neutral':
					msgType = 12;
				  break;
	
				case 'followMouse':
					msgType = 13;
				  break;
			}
			
			// Show the tooltip.
			_this.ika.controller.tooltipController.bindBubbleTip(msgLocation, msgType, msgText, null, msgBindTo, msgIsMinSize);
		};
	}
	
	/**
	 * Ikariam specific functions like converting a number from Ikariam format to int.
	 * 
	 * @instance
	 * 
	 * @type	IkariamCore~Ikariam
	 */
	this.Ikariam = new Ikariam;
	
	/**
	 * Instantiate a new set of localisation functions.
	 * 
	 * @inner
	 * 
	 * @class
	 * @classdesc	Functions for localisating the script.
	 */
	function Language() {
		/*--------------------------------------------*
		 * Private variables, functions and settings. *
		 *--------------------------------------------*/
		
		/**
		 * Default ikariam language code - default for this server.
		 * 
		 * @private
		 * @inner
		 * 
		 * @default	en
		 * 
		 * @type	string
		 */
		var _ikaCode = 'en';
		
		/**
		 * Default ikariam language name - default for this server.
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	string
		 */
		var _ikaLang = 'English';
		
		/**
		 * Used language code.
		 * 
		 * @private
		 * @inner
		 * 
		 * @default	en
		 * 
		 * @type	string
		 */
		var _usedCode = 'en';
		
		/**
		 * Used language name.
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	string
		 */
		var _usedLang = '';
		
		/**
		 * Used language texts.
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	json
		 */
		var _usedText = null;
		
		/**
		 * Default language text. To be used if the used language is not available.
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	json
		 */
		var _defaultText = null;
		
		/**
		 * All languages which are registered with their storage type (resource, in-script-array, default).
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	string[]
		 */
		var _registeredLangs = {};
		
		/**
		 * All JSON language resource settings (resource name, url).
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	mixed[]
		 */
		var _jsonLanguageText = {};
		
		/**
		 * All in-script-array language texts.
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	json[]
		 */
		var _languageResources = {};
		
		// Split the host string.
		var _lang = top.location.host.split('.');
		
		// Change the language code, if lang exists.
		if(_lang) {
			for(var i = 0; i < _lang.length; i++) {
				if(_lang[i] == 'ikariam') {
					_usedCode = _ikaCode = _lang[i - 1];
					break;
				}
			}
		}
		
		/**
		 * "Translation" of all possible language codes to the corresponding language.
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	string[]
		 */
		var _codeTranslation = {
			ae: 'Arabic',		ar: 'Spanish',		ba: 'Bosnian',		bg: 'Bulgarian',	br: 'Portuguese',	by: 'Russian',
			cl: 'Spanish',		cn: 'Chinese',		co: 'Spanish',		cz: 'Czech',		de: 'German',		dk: 'Danish',
			ee: 'Estonian',		en: 'English',		es: 'Spanish',		fi: 'Finish',		fr: 'French',		gr: 'Greek',
			hk: 'Chinese',		hr: 'Bosnian',		hu: 'Hungarian',	id: 'Indonesian',	il: 'Hebrew',		it: 'Italian',
			kr: 'Korean',		lt: 'Lithuanian',	lv: 'Latvian',		mx: 'Spanish',		nl: 'Dutch',		no: 'Norwegian',
			pe: 'Spanish',		ph: 'Filipino',		pk: 'Urdu',			pl: 'Polish',		pt: 'Portuguese',	ro: 'Romanian',
			rs: 'Serbian',		ru: 'Russian',		se: 'Swedish',		si: 'Slovene',		sk: 'Slovak',		tr: 'Turkish',
			tw: 'Chinese',		ua: 'Ukrainian',	us: 'English',		ve: 'Spanish',		vn: 'Vietnamese',	yu: 'Bosnian'
		};
		
		// Set the language.
		_ikaLang	= _codeTranslation[_ikaCode];
		_usedLang	= _codeTranslation[_usedCode];
		
		/**
		 * Set the choosen language text for the script.
		 * 
		 * @private
		 * @inner
		 */
		var _setText = function() {
			if(_registeredLangs[_usedLang]) {
				var type = _registeredLangs[_usedLang];
				
				if(type == 'resource') {
					if(_languageResources[_usedLang]) {
						// Get the ressource.
						_usedText = _this.myGM.getResourceParsed(_languageResources[_usedLang].resourceName, _languageResources[_usedLang].url);
					} else {
						_usedText = { is_error: true };
					}
				} else if(type == 'default') {
					_usedText = _defaultText;
				} else {
					if(_jsonLanguageText[_usedLang]) {
						// Get the ressource.
						_usedText = _jsonLanguageText[_usedLang];
					} else {
						_usedText = { is_error: true };
					}
				}
				
				// Store it to Language._usedText.
				_usedText = (_usedText && !_usedText.is_error) ? _usedText : _defaultText;
	
			// Otherwise: Use the default text.
			} else {
				_usedText = _defaultText;
			}
		};
		
		/*-------------------------------------------*
		 * Public variables, functions and settings. *
		 *-------------------------------------------*/
		
		/**
		 * Set the default language.
		 * 
		 * @instance
		 * 
		 * @param	{string}	name
		 * 	 The Name of the default language.
		 * @param	{json}		json
		 *   JSON with the default language data.
		 */
		this.setDefaultLang = function(name, json) {
			// Set the language as registered language.
			_registeredLangs[name] = 'default';
			
			// Set the default and used language name.
			_usedLang = _usedLang != '' ? _usedLang : name;
			
			// Set the default language data.
			_defaultText = json;
			
			// Set the used language data.
			_setText();
		};
		
		/**
		 * Registers a new language without resource usage.
		 * 
		 * @instance
		 * 
		 * @param	{string}	languageName
		 *   The name of the language.
		 * @param	{json}		json
		 *   JSON with the language data.
		 */
		this.addLanguageText = function(languageName, json) {
			// Set the language as registered language.
			_registeredLangs[languageName] = 'jsonText';
			
			// Set the data for this language.
			_jsonLanguageText[languageName] = json;
			
			// Set the used language data.
			_setText();
		};
		
		/**
		 * Registers a new language resource.
		 * 
		 * @instance
		 * 
		 * @param	{string}	languageName
		 *   Name of the language.
		 * @param	{string}	resourceName
		 *   Name of the resource.
		 * @param	{string}	resourceURL
		 *   URL, if resources are not supported.
		 */
		this.registerLanguageResource = function(languageName, resourceName, resourceURL) {
			// Set the language as registered language.
			_registeredLangs[languageName] = 'resource';
			
			// Set the data for this language.
			_languageResources[languageName] = { resourceName: resourceName, url: resourceURL };
			
			// Set the used language data.
			_setText();
		};
		
		/**
		 * Return the name of the actually used language.
		 * 
		 * @instance
		 * 
		 * @return	{string}
		 *   The country code.
		 */
		this.getLangName = function() {
			return _usedLang;
		};
		
		/**
		 * Return a string which is defined by its placeholder. If the string contains variables defined with %$nr,
		 * they are replaced with the content of the array at this index.
		 * 
		 * @instance
		 * 
		 * @param	{string}	name
		 *   The name of the placeholder.
		 * @param	{mixed[]}	vars
		 *   An array containing variables for replacing in the language string. (optional)
		 *
		 * @return	{string}
		 *   The text.
		 */
		this.getText = function(name, vars) {
			// Set the text to the placeholder.
			var erg = name;
	
			// Split the placeholder.
			var parts = name.split('_');
	
			// If the splitting was successful.
			if(parts) {
				// Set txt to the "next level".
				var txt = _usedText ? _usedText[parts[0]] : null;
	
				// Loop over all parts.
				for(var i = 1; i < parts.length; i++) {
					// If the "next level" exists, set txt to it.
					if(txt && typeof txt[parts[i]] != 'undefined') {
						txt = txt[parts[i]];
					} else {
						txt = erg;
						break;
					}
				}
	
				// If the text type is not an object, a function or undefined.
				if(typeof txt != 'object' && typeof txt != 'function' && typeof txt != 'undefined') {
					erg = txt + '';
				}
				
				if(vars) {
					for(var i = 0; i < vars.length; i++) {
						var regex = new RegExp('%\\$' + (i + 1), 'g');
						erg = erg.replace(regex, vars[i] + '');
					}
				}
			}
			
			if(erg == name) {
				_this.con.log('Language.getText: No translation available for "' + name + '" in language ' + this.getLangName());
			}
			
			// Return the text.
			return erg;
		};
		
		/**
		 * Synonymous function for {@link IkariamCore~Language#getText}.<br>
		 * Return a string which is defined by its placeholder. If the string contains variables defined with %$nr,
		 * they are replaced with the content of the array at this index.
		 * 
		 * @instance
		 * 
		 * @param	{string}	name
		 *   The name of the placeholder.
		 * @param	{mixed[]}	vars
		 *   An array containing variables for replacing in the language string. (optional)
		 *
		 * @return	{string}
		 *   The text.
		 */
		this.$ = function(name, vars) {
			return this.getText(name, vars);
		};
	}
	
	/**
	 * Functions for localisation of the script.
	 * 
	 * @instance
	 * 
	 * @type	IkariamCore~Language
	 */
	this.Language = new Language;
	
	/**
	 * Instantiate the handler.
	 * 
	 * @inner
	 * 
	 * @class
	 * @classdesc	Handler for callbacks for processing DOM modification events.
	 */
	function Observer() {
		/*--------------------------------------------*
		 * Private variables, functions and settings. *
		 *--------------------------------------------*/
		
		/**
		 * Storage for MutationObserver.
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	MutationObserver
		 */ 
		var _MutationObserver = _this.win.MutationObserver || _this.win.WebKitMutationObserver;
		
		/**
		 * If the MutationObserver can be used or if an workaround must be used.
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	boolean
		 */ 
		var _canUseObserver = !!_MutationObserver;
		
		/**
		 * List to store the created observers.
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	MutationObserver[]
		 */
		var _observerList = {};
		
		/*-------------------------------------------*
		 * Public variables, functions and settings. *
		 *-------------------------------------------*/
		
		/**
		 * Adds a new observer for DOM modification events. If it is possible use MutationObserver. More about the 
		 * Mutation observer can be found here: {@link https://developer.mozilla.org/en-US/docs/DOM/MutationObserver Mutation Observer on MDN}.<br>
		 * If it's not possible to use a MutationObserver a DOMSubtreeModified or DOMAttrModified event listener is used.
		 * 
		 * @instance
		 * 
		 * @param	{string}	id
		 *   The id to store the observer.
		 * @param	{element}	target
		 *   The target to observe.
		 * @param	{mixed[]}	options
		 *   Options for the observer. All possible options can be found here: {@link https://developer.mozilla.org/en-US/docs/DOM/MutationObserver#MutationObserverInit MutationObserver on MDN}
		 * @param	{function}	callback
		 *   The callback for the observer.<br>
		 *   Signature: <code>function(mutations : MutationRecord) : void</code>
		 * @param	{function}	noMutationObserverCallback
		 *   The callback if the use of the observer is not possible and DOMAttrModified / DOMSubtreeModified is used instead.<br>
		 *   Signature: <code>function() : void</code>
		 */
		this.add = function(id, target, options, callback, noMutationObserverCallback) {
			var observer;
			
			if(!!target) {
				// If the MutationObserver can be used, do so.
				if(_canUseObserver) {
					// Create the observer.
					observer = new _MutationObserver(callback);
					
					// Start the observation.
					observer.observe(target, options);
					
					// Store the observer if the id is unique.
					if(!_observerList[id]) {
						_observerList[id] = observer;
					
					// Otherwise: Alert that the id is already in use.
					} else {
						_this.con.log('Observer.add: Id "' + id + '" already used for observer, please choose another one!');
					}
				
				// Otherwise use the event listener.
				} else {
					// Add the event listener.
					if(options.attributes) {
						target.addEventListener('DOMAttrModified', noMutationObserverCallback, false);
					}
					
					if(options.characterData || options.childList || options.subtree) {
						target.addEventListener('DOMSubtreeModified', noMutationObserverCallback, false);
					}
				}
			} else {
				_this.con.log('Observer.add: Observer target not defined! id: ' + id);
			}
		};
		
		/**
		 * Removes the observer given by the id. If the use of MutationObserver is not possible, this function can not be used.
		 * 
		 * @instance
		 * 
		 * @param	{string}	id
		 *   The id of the observer to remove.
		 */
		this.remove = function(id) {
			// If the observer is set.
			if(_canUseObserver && _observerList[id]) {
				// Get the observer.
				var observer = _observerList[id];
				
				// Disconnect the observer if it is a MutationObserver.
				observer.disconnect();
				
				// Delete the observer data.
				delete _observerList[id];
			} else if(!_canUseObserver) {
				_this.con.log('Observer.remove: It is not possible to use MutationObservers so Observer.remove can not be used.');
			}
		};
	}
		
	/**
	 * Handler for callbacks after modification of DOM elements.
	 * 
	 * @instance
	 * 
	 * @type	IkariamCore~Observer
	 */
	this.Observer = new Observer;
	
	/**
	 * Instantiate a new set of refresh functions.
	 * 
	 * @inner
	 * 
	 * @class
	 * @classdesc	Handles functions that should run on ikariam popups and after actualisations of the page data.
	 */
	function RefreshHandler() {
		/*--------------------------------------------*
		 * Private variables, functions and settings. *
		 *--------------------------------------------*/
		
		/**
		 * Storage for the actualisation callbacks.<br>
		 * Architecture:<br>
		 * <code>_callbacks = {<br>
		 * &#09;popupId: {<br>
		 * &#09;&#09;callbackId: callback<br>
		 * &#09;}<br>
		 * }</code>
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	function[][]
		 */
		var _callbacks = {};
		
		/**
		 * Handles the call of the callback functions for the actualisation.
		 * 
		 * @private
		 * @inner
		 */
		var _handleActualisation = function() {
			// Callbacks for every reload.
			if(_callbacks['*']) {
				_this.myGM.forEach(_callbacks['*'], function(key, callback) {
					callback();
				});
			}
			
			// If the script was already executed on this popup.
			var isAlreadyExecutedPopup = !!_this.myGM.$('#' + _this.myGM.prefix() + 'alreadyExecutedPopup');
			
			// Get the popup.
			var popup = _this.myGM.$('.templateView');
	
			// Get the popup id.
			var popupId = popup ? popup.id.replace('_c', '') : '';
	
			// If a popup exists, add the hint, that the popup script was executed.
			if(popup && !isAlreadyExecutedPopup) {
				var alreadyExecuted		= _this.myGM.addElement('input', _this.myGM.$('.mainContent', popup), 'alreadyExecutedPopup');
				alreadyExecuted.type	= 'hidden';
				
				// Call all callbacks which are set.
				if(_callbacks[popupId]) {
					_this.myGM.forEach(_callbacks[popupId], function(key, callback) {
						callback();
					});
				}
			}
		};
		
		/**
		 * Callback for MutationObserver for calling the popup handler.
		 * 
		 * @private
		 * @inner
		 * 
		 * @param	{MutationRecord}	mutations
		 *   All recorded mutations.
		 */
		var _callback = function(mutations) {
			mutations.forEach(function(mutation) {
				// If the style.display is set to none.
				if(mutation.target.getAttribute('style').search(/display: none/i) != -1) {
					// Timeout to have access to GM_ funtions.
					setTimeout(_handleActualisation, 0);
				}
			});
		};
		
		/**
		 * Callback for calling the popup handler if the MutationObserver could not be used.
		 * 
		 * @private
		 * @inner
		 * 
		 * @param	{event}	e
		 *   The called event.
		 */
		var _callbackNoMutationObserver = function(e) {
			// If the attribute was changed.
			if(e.attrChange == MutationEvent.MODIFICATION) {
				// If the style.display is set to none.
				if(e.attrName.trim() == 'style' && e.newValue.search(/display: none/i) != -1) {
					// Timeout to have access to GM_ funtions.
					setTimeout(_handleActualisation, 0);
				}
			}
		};
		
		/*-------------------------------------------*
		 * Public variables, functions and settings. *
		 *-------------------------------------------*/
		
		/**
		 * Add a new popup handler.
		 * 
		 * @instance
		 * 
		 * @param	{string}	popupId
		 *   The id of the popup where the callback schould be called (without '_c' at the end).<br>
		 *   Set to '*' for calling at every actualisation, not just popups.
		 * @param	{string}	callbackId
		 *   The id of the callback. This must be unique for a popup.
		 * @param	{function}	callback
		 *   The callback which should be called.<br>
		 *   Signature: <code>function() : void</code>
		 */
		this.add = function(popupId, callbackId, callback) {
			// If no entry for the popup exists, create it.
			if(!_callbacks[popupId]) {
				_callbacks[popupId] = {};
			}
			
			// If no entry for the callback existst, create one.
			if(!_callbacks[popupId][callbackId]) {
				_callbacks[popupId][callbackId] = callback;
			
			// Otherwise: Show an error to the user (programmer).
			} else {
				_this.con.log('RefreshHandler.add: Id set "' + popupId + '|' + callbackId + '" already used for observer, please choose another one!');
			}
		};
		
		/**
		 * Removes a popup handler.
		 * 
		 * @instance
		 * 
		 * @param	{string}	popupId
		 *   The id of the popup where the callback was called (without '_c' at the end).
		 *   Set to '*' for allbacks which have been called at every actualisation, not just popups.
		 * @param	{string}	callbackId
		 *   The id of the callback. This must be unique for a popup.
		 */
		this.remove = function(popupId, callbackId) {
			// Remove the callback if it is set.
			if(_callbacks[popupId] && _callbacks[popupId][callbackId]) {
				delete	_callbacks[popupId][callbackId];
			}
		};
		
		/*----------------------------------------------------*
		 * Register the observer and handle popups on startup *
		 *----------------------------------------------------*/
		
		// Add the observer for the popups.
		_this.Observer.add('actualisationHandler', _this.myGM.$('#loadingPreview'), { attributes: true, attributeFilter: ['style'] }, _callback, _callbackNoMutationObserver);
		
		// Execute the handler on popups which are shown on startup.
		setTimeout(_handleActualisation, 0);
	}
	
	/**
	 * Handler for functions that should run on ikariam popups.
	 * 
	 * @instance
	 * 
	 * @type	IkariamCore~RefreshHandler
	 */
	this.RefreshHandler = new RefreshHandler;
	
	/**
	 * Instantiate a new set of options / settings functions.
	 * 
	 * @inner
	 * 
	 * @class
	 * @classdesc	Handles options the user can set, provides a "panel" for them to change them.
	 */
	function Options() {
		/*--------------------------------------------*
		 * Private variables, functions and settings. *
		 *--------------------------------------------*/
		
		/**
		 * Storage for option wrapper visibility.
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	boolean[]
		 */
		var _optionWrapperVisibility = {
			moduleOptions:	true
		};
		
		/**
		 * Storage for option wrappers.
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	mixed[]
		 */
		var _wrapper		= {};
		
		/**
		 * Storage for option wrapper order. (Order in which the wrappers are shown)
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	string[]
		 */
		var _wrapperOrder	= new Array();
		
		/**
		 * Storage for the saved options. Gets filled on startup.
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	mixed[]
		 */
		var _savedOptions	= _this.myGM.getValue('optionPanel_options', {});
		
		/**
		 * Storage for the options.
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	mixed[]
		 */
		var _options		= {};
		
		/**
		 * Storage for the id of the next hr.
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	int
		 */
		var _hrId = 0;
		
		/**
		 * Add a element to a wrapper. ("generic function")
		 * 
		 * @private
		 * @inner
		 * 
		 * @param	{string}		id
		 *   The id of the element.
		 * @param	{string}		wrapperId
		 *   The id of the wrapper for the element.
		 * @param	{string || int}	table
		 *   The id of the table in the wrapper where the element should be added.
		 * @param	{mixed[]}		options
		 *   Options for the element.
		 * @param	{mixed}			defaultValue
		 *   Default value for the option.
		 * @param	{function}		create
		 *   Callback to create the element.<br>
		 *   Signature: <code>function(parentTable : element, elementId : string, value : mixed, options : mixed) : void</code>
		 * @param	{function}		save
		 *   Callback for saving the option value. Returns the value for this option.<br>
		 *   Signature: <code>function(id : string) : mixed</code>
		 * @param	{int}			position
		 *   Position of the element in the element array.
		 */
		var _addElement = function(id, wrapperId, table, options, defaultValue, create, save, position) {
			if(_wrapper[wrapperId]) {
				if(_wrapper[wrapperId].elements[id]) {
					_this.con.log('Options.addElement: Element with id "' + id + '" already defined. Wrapper id: ' + wrapperId);
				} else {
					_wrapper[wrapperId].elements[id]	= { table: table + '', create: create };
					_wrapper[wrapperId].elementOrder.insert(id, position);
					
					if(options != null) {
						_wrapper[wrapperId].elements[id].options = options;
					}
					
					if(defaultValue != null) {
						_wrapper[wrapperId].elements[id].defaultValue	= defaultValue;
						
						if(_savedOptions[wrapperId] && (_savedOptions[wrapperId][id] || _savedOptions[wrapperId][id] == false)) {
							_options[wrapperId][id]	= _savedOptions[wrapperId][id];
						} else {
							_options[wrapperId][id]	= defaultValue;
						}
					}
					
					if(save != null) {
						_wrapper[wrapperId].elements[id].save	= save;
					}
				}
			} else {
				_this.con.log('Options.addElement: Wrapper with id "' + wrapperId + '" not defined. Element id: ' + id);
			}
		};
		
		/**
		 * Save the content of <code>_options</code>.
		 * 
		 * @private
		 * @inner
		 * 
		 * @param	{boolean}	showNoSuccessHint
		 *   If the success hint should not be shown.
		 */
		var _saveOptions = function(showNoSuccessHint) {
			// Set the value of saved options.
			_savedOptions = _options;
			
			// Save the options.
			_this.myGM.setValue('optionPanel_options', _options);
			
			// Show success hint if enabled.
			if(!showNoSuccessHint) {
				_this.Ikariam.showTooltip('cityAdvisor', 'confirm', _this.Language.$('general_successful'));
			}
		};
		
		/**
		 * Store the actual value of each option to <code>_option</code> and call <code>_saveOptions</code>.
		 * 
		 * @private
		 * @inner
		 */
		var _savePanelOptions = function() {
			// Store the value of each option element.
			_this.myGM.forEach(_wrapper, function(wrapperId, wrapper) {
				_this.myGM.forEach(wrapper.elements, function(elementId, element) {
					if(element.save) {
						_options[wrapperId][elementId] = element.save(wrapperId + elementId);
					}
				});
			});
			
			// Save the options.
			_saveOptions();
		};
		
		/**
		 * Scroll the tabmenu in the options popup.
		 * 
		 * @private
		 * @inner
		 * 
		 * @param	{string}	direction
		 *   The direction to scroll. Possible values are "left" and "right".
		 */
		var _scrollOptionsTab = function(direction) {
			// Get the tabmenu and the tabs.
			var tabmenu			= _this.myGM.$('#scriptTabmenuWrapper .tabmenu');
			var tabs			= _this.myGM.$$('.tab', tabmenu);
			var firstVisible	= -1;
			var lastVisible		= -1;
			
			// Store the first and last visible tab id.
			for(var i = 0; i < tabs.length; i++) {
				if(!tabs[i].classList.contains('invisibleTab')) {
					if(firstVisible == -1) {
						firstVisible = i;
					}
					
					lastVisible = i;
				}
			}
			
			// Store the id of the tab to show / to hide.
			var toShow;
			var toHide;
			
			if(direction == 'left') {
				toShow = firstVisible - 1;
				toHide = lastVisible;
			} else {
				toShow = lastVisible + 1;
				toHide = firstVisible;
			}
			
			// Scroll.
			if(toShow >= 0 && toShow < tabs.length) {
				tabs[toShow].classList.remove('invisibleTab');
				tabs[toHide].classList.add('invisibleTab');
			}
			
			// Deactivate the scroll left button if it is not possible to scroll left.
			if(toShow <= 0) {
				_this.myGM.$('#scriptTabmenuScrollLeft').classList.add('deactivated');
			} else {
				_this.myGM.$('#scriptTabmenuScrollLeft').classList.remove('deactivated');
			}
			
			// Deactivate the scroll right button if it is not possible to scroll right.
			if(toShow >= tabs.length - 1) {
				_this.myGM.$('#scriptTabmenuScrollRight').classList.add('deactivated');
			} else {
				_this.myGM.$('#scriptTabmenuScrollRight').classList.remove('deactivated');
			}
		};
		
		/**
		 * Initializes the options tab for the script and adds the scroll function to the tabmenu.
		 * 
		 * @private
		 * @inner
		 * 
		 * @return	{element}
		 *   The options tab for the script.
		 */
		var _initializeOptionsTab = function() {
			// Get the tabmenu.
			var tabMenuWrapper	= _this.myGM.$("#scriptTabmenuWrapper");
			var tabmenu			= _this.myGM.$('.tabmenu');
			
			// If the tabmenu was not modified, add the scroll function.
			if(!tabMenuWrapper) {
				// Add the scroll buttons.
				tabMenuWrapper		= _this.myGM.addElement('div', tabmenu.parentNode, 'scriptTabmenuWrapper', null, null, false, tabmenu);
				var scrollLeft		= _this.myGM.addElement('div', tabMenuWrapper, 'scriptTabmenuScrollLeft', 'deactivated', null, false);
				var scrollRight		= _this.myGM.addElement('div', tabMenuWrapper, 'scriptTabmenuScrollRight', null, null, false);
				scrollLeft.addEventListener('click', function() { _scrollOptionsTab('left'); }, false);
				scrollRight.addEventListener('click', function() { _scrollOptionsTab('right'); }, false);
				tabMenuWrapper.insertBefore(tabmenu, scrollRight);
				
				// Set the styles.
				var style		=	'#scriptTabmenuWrapper					{ background: url("/skin/layout/bg_tabs.jpg") repeat-x scroll 0 50% transparent; position: relative; width: 680px; } \
									 #scriptTabmenuWrapper .tab				{ border-left: 1px solid transparent; border-right: 1px solid transparent; border-top: 1px solid transparent; height: 31px !important; padding: 1px 3px 0 2px !important; } \
									 #scriptTabmenuWrapper .invisibleTab	{ display: none !important; }';
				var useStyle	= _this.Options.getOption('optionPanelOptions', 'useStyle');
				
				if(useStyle == 'roundButton') {
					style +=	'#scriptTabmenuWrapper .tabmenu													{ left: 32px; position: relative; top: 0; width: 610px; } \
								 #scriptTabmenuScrollLeft, #scriptTabmenuScrollRight							{ background-image: url("/skin/pirateFortress/button_arrow_70x50_sprite.png"); height: 50px; position: absolute; top: -4px; width: 70px; cursor: pointer; transform: scale(0.7); -webkit-transform: scale(0.7); } \
								 #scriptTabmenuScrollLeft														{ left: -19px; background-position: 0px 0px; } \
								 #scriptTabmenuScrollLeft:hover													{ background-position: 0px -50px; } \
								 #scriptTabmenuScrollLeft:active												{ background-position: 0px -100px; } \
								 #scriptTabmenuScrollRight														{ right: -18px; background-position: -70px -0px; } \
								 #scriptTabmenuScrollRight:hover												{ background-position: -70px -50px; } \
								 #scriptTabmenuScrollRight:active 												{ background-position: -70px -100px; } \
								 #scriptTabmenuScrollLeft.deactivated, #scriptTabmenuScrollRight.deactivated	{ display: none; }';
				} else {
					style +=	'#scriptTabmenuWrapper .tabmenu													{ left: 15px; position: relative; top: 0; width: 644px; } \
								 #scriptTabmenuScrollLeft, #scriptTabmenuScrollRight							{ background-image: url("/skin/friends/button_up.png"); height: 13px; position: absolute; top: 15px; width: 35px; cursor: pointer; } \
								 #scriptTabmenuScrollLeft														{ left: -10px; transform: rotate(-90deg) scale(0.8); -webkit-transform: rotate(-90deg) scale(0.8); } \
								 #scriptTabmenuScrollRight														{ right: -10px; transform: rotate(90deg) scale(0.8); -webkit-transform: rotate(90deg) scale(0.8); } \
								 #scriptTabmenuScrollLeft:hover, #scriptTabmenuScrollRight:hover				{ background-position: 0 -13px; } \
								 #scriptTabmenuScrollLeft.deactivated, #scriptTabmenuScrollRight.deactivated	{ background-position: 0 -26px; }';
				}
				
				_this.myGM.addStyle(style, 'scriptTabmenu', true);
			}
			
			// Get the options tab.
			var tabScriptOptions = _this.myGM.$('#tab' + _this.myGM.prefix() + 'ScriptOptions');
			
			// If the script options tab doesn't exists, create it.
			if(!tabScriptOptions) {
				// Set the styles.
				_this.myGM.addStyle(
						"#tab" + _this.myGM.prefix() + "Options hr					{ margin: 0; } \
						 #tab" + _this.myGM.prefix() + "Options .scriptTextArea		{ resize: none; width: calc(100% - 2px); height: 75px; } \
						 #tab" + _this.myGM.prefix() + "Options .scriptTextField	{ width: 173px;	} \
						 #tab" + _this.myGM.prefix() + "Options .cbWrapper			{ margin: 0 0 0 10px; }",
					'scriptOptionsTab', true);
				
				// Add the script options tab link to the tabmenu.
				var jsTabScriptOptions			= _this.myGM.addElement('li', tabmenu, 'js_tab' + _this.myGM.prefix() + 'Options', ['tab', 'invisibleTab'], null, false);
				jsTabScriptOptions.innerHTML	= '<b class="tab' + _this.myGM.prefix() + 'Options">' + scriptInfo.name + '</b>';
				jsTabScriptOptions.setAttribute('onclick', "$('#js_tab" + _this.myGM.prefix() + "Options').removeClass('selected'); switchTab('tab" + _this.myGM.prefix() + "Options');");
				
				// Add the content wrapper for the script options tab to the tabmenu.
				var mainContent					= _this.myGM.$('#tabGameOptions').parentNode;
				tabScriptOptions				= _this.myGM.addElement('div', mainContent, 'tab' + _this.myGM.prefix() + 'Options', null, new Array(['display', 'none']), false);
			}
			
			// Get the option wrapper visibility.
			_optionWrapperVisibility = _this.myGM.getValue('optionPanel_optionWrapperVisibility', _optionWrapperVisibility);
			
			// Return the script options tab.
			return tabScriptOptions;
		};
		
		/**
		 * Add a wraper for options elements to the script option tab.
		 * 
		 * @private
		 * @inner
		 * 
		 * @param	{element}	tab
		 *   The tab to add the wrapper to.
		 * @param	{string}	id
		 *   The id of the wrapper.
		 * @param	{string || string[]}	headerText
		 *   The text for the wrapper header. If the element is defined within the IkariamCore initialisation,
		 *   the translation string is not set. Then you can pass an object containing the string id.<br>
		 *   Object signature: <code>{ id: 'idValue' }</code>
		 * 
		 * @return	{element}
		 *   The wrapper.
		 */
		var _createOptionsWrapper = function(tab, id, headerText) {
			// Get the header text, if not set yet.
			if(headerText.id) {
				if(headerText.args) {
					headerText = _this.Language.$(headerText.id, headerText.args);
				} else {
					headerText = _this.Language.$(headerText.id);
				}
			}
			
			// Get the content show status.
			var showContent = !!_optionWrapperVisibility[id];
			
			// Create the wrapper.
			var optionsWrapper	= _this.myGM.addElement('div', tab, id, 'contentBox01h');
			
			// Create the header.
			var optionsHeader		= _this.myGM.addElement('h3', optionsWrapper, null, 'header');
			optionsHeader.innerHTML	= headerText;
			
			// Add the show / hide button.
			var btn = _this.myGM.addElement('div', optionsHeader, null, showContent ? 'minimizeImg' : 'maximizeImg', new Array(['cssFloat', 'left']));
			
			/*
			 * Function to toggle the visibility of an wrapper.
			 */
			var toggle = function() {
				// Toggle the button.
				_this.myGM.toggleShowHideButton(this);
				
				// Toggle the visibility of the content.
				_this.myGM.$('.content', this.parentNode.parentNode).classList.toggle('invisible');
				
				// Store the visibility.
				var optionId = this.parentNode.parentNode.id.replace(_this.myGM.prefix(), '');
				_optionWrapperVisibility[optionId] = !_optionWrapperVisibility[optionId];
				_this.myGM.setValue('optionPanel_optionWrapperVisibility', _optionWrapperVisibility);
	
				// Adjust the size of the Scrollbar.
				_this.ika.controller.adjustSizes();
			};
			
			// Add the toggle function.
			btn.addEventListener('click', toggle, false);
			btn.title = showContent ? _this.Language.$('general_fold') : _this.Language.$('general_expand');
			
			// Create the content wrapper.
			var optionsWrapperContent	= _this.myGM.addElement('div', optionsWrapper, null, showContent ? 'content' : ['content', 'invisible']);
			
			// Create the footer.
			_this.myGM.addElement('div', optionsWrapper, null, 'footer');
			
			// Return the content wrapper.
			return optionsWrapperContent;
		};
		
		/**
		 * Show the option script tab.
		 * 
		 * @private
		 * @inner
		 */
		var _showOptionPanel = function() {
			// Create the options tab, if not existing.
			var tab = _initializeOptionsTab();
			
			// Add all wrappers with elements.
			for(var i = 0; i < _wrapperOrder.length; i++) {
				// Create the wrapper.
				var wrapperId		= _wrapperOrder[i];
				var wrapperOptions	= _wrapper[wrapperId];
				var wrapper 		= _createOptionsWrapper(tab, wrapperId, wrapperOptions.headerText);
				var tables			= {};
				
				// Add all elements to the wrapper.
				for(var j = 0; j < wrapperOptions.elementOrder.length; j++) {
					// Get the element id and the element options
					var elemId	= wrapperOptions.elementOrder[j];
					var elemOpt	= wrapperOptions.elements[elemId];
					
					// Create table and tablebody if not existing.
					if(!tables[elemOpt.table]) {
						var table				= _this.myGM.addElement('table', wrapper, null, ['moduleContent', 'table01']);
						tables[elemOpt.table]	= _this.myGM.addElement('tbody', table);
					}
					
					// Create the element.
					var value = (_options[wrapperId] && (_options[wrapperId][elemId] || _options[wrapperId][elemId] == false)) ? _options[wrapperId][elemId] : null;
					var options = elemOpt.options ? elemOpt.options : null;
					elemOpt.create(tables[elemOpt.table], wrapperId + elemId, value, options);
				}
				
				// Add the save button to the wrapper.
				_this.myGM.addButton(wrapper, _this.Language.$('default_optionPanel_save'), function() { setTimeout(_savePanelOptions, 0); });
			}
		};
		
		/**
		 * Show the notification for exporting the options.
		 * 
		 * @private
		 * @inner
		 */
		var _exportOptionsShowNotification = function() {
			// Get the options as json string.
			var optionString = _this.win.JSON.stringify(_options);
			
			// Set the notification text.
			var notificationText = {
				header:		_this.Language.$('default_optionPanel_section_optionPanelOptions_label_exportNotification_header'),
				bodyTop:	_this.Language.$('default_optionPanel_section_optionPanelOptions_label_exportNotification_explanation'),
				bodyBottom:	optionString
			};
			
			// Show the notification.
			_this.myGM.notification(notificationText, null, true);
		};
		
		/**
		 * Callback for importing the options.
		 * 
		 * @private
		 * @inner
		 * 
		 * @param	{element}	textarea
		 *   The textarea with the options string to import.
		 */
		var _importOptionsCallback = function(textarea) {
			// Get the option string.
			var optionString = textarea.value;
			
			if(optionString) {
				// Function for safer parsing.
				var safeParse = function(key, value) {
					// If the value is a function, return just the string, so it is not executable.
					if(typeof value === 'function' || Object.prototype.toString.apply(value) === '[object function]') {
						return value.toString();
					}
	
					// Return the value.
					return value;
				};
				
				try {
					// Parse the option string.
					var parsed = _this.win.JSON.parse(optionString, safeParse);
					
					// Store the values in the script.
					_this.myGM.forEach(parsed, function(wrapperKey, elements) {
						_this.myGM.forEach(elements, function(elementKey, setting) {
							if(_options[wrapperKey] && (_options[wrapperKey][elementKey] || _options[wrapperKey][elementKey] == false) && typeof setting != 'array' && typeof setting != 'object') {
								_options[wrapperKey][elementKey] = setting;
							}
						});
					});
					
					// Save the options.
					_saveOptions();
				} catch(e) {
					// Set the notification text.
					var notificationText = {
						header:	_this.Language.$('default_optionPanel_section_optionPanelOptions_label_importError_header'),
						body:	_this.Language.$('default_optionPanel_section_optionPanelOptions_label_importError_explanation')
					};
					
					// Log the error message an show the notification to the user.
					_this.con.log(e);
					_this.myGM.notification(notificationText);
				}
			}
		};
		
		/**
		 * Show the notification for importing the options.
		 * 
		 * @private
		 * @inner
		 */
		var _importOptionsShowNotification = function() {
			// Set the notification text.
			var notificationText = {
				header:		_this.Language.$('default_optionPanel_section_optionPanelOptions_label_importNotification_header'),
				bodyTop:	_this.Language.$('default_optionPanel_section_optionPanelOptions_label_importNotification_explanation')
			};
	
			// Set the notification callback.
			var notificationCallback = {
				confirm:	_importOptionsCallback
			};
			
			// Show the notification.
			_this.myGM.notification(notificationText, notificationCallback, true);
		};
		
		/**
		 * Callback for resetting the options.
		 * 
		 * @private
		 * @inner
		 */
		var _resetOptionsCallback = function() {
			// Clear the options.
			_options = {};
			
			// Store the default values.
			_this.myGM.forEach(_wrapper, function(wrapperKey, wrapper) {
				_options[wrapperKey] = {};
				
				_this.myGM.forEach(wrapper.elements, function(elementKey, element) {
					if(element.defaultValue || element.defaultValue == false) {
						_options[wrapperKey][elementKey] = element.defaultValue;
					}
				});
			});
			
			// Save the options.
			_saveOptions();
		};
		
		/**
		 * Show the notification for resetting the options.
		 * 
		 * @private
		 * @inner
		 */
		var _resetOptionsShowNotification = function() {
			// Set the notification text.
			var notificationText = {
				header:	_this.Language.$('default_optionPanel_section_optionPanelOptions_label_resetNotification_header'),
				body:	_this.Language.$('default_optionPanel_section_optionPanelOptions_label_resetNotification_explanation')
			};
	
			// Set the notification callback.
			var notificationCallback = {
				confirm:	_resetOptionsCallback,
				abort:		function() { return; }
			};
			
			// Show the notification.
			_this.myGM.notification(notificationText, notificationCallback);
		};
		
		/**
		 * Create the export options link.
		 * 
		 * @private
		 * @inner
		 * 
		 * @param	{element}	_this
		 *   Reference to <code>_this</code>.
		 * @param	{element}	parent
		 *   Parent element for the link.
		 */
		var _exportOptions = function(_this, parent) {
			// Create the export link.
			var exportLink			= _this.myGM.addElement('a', parent);
			exportLink.href			= 'javascript:;';
			exportLink.innerHTML	= _this.Language.$('default_optionPanel_section_optionPanelOptions_label_export');
			exportLink.addEventListener('click', _exportOptionsShowNotification, false);
		};
		
		/**
		 * Create the import options link.
		 * 
		 * @private
		 * @inner
		 * 
		 * @param	{element}	_this
		 *   Reference to <code>_this</code>.
		 * @param	{element}	parent
		 *   Parent element for the link.
		 */
		var _importOptions = function(_this, parent) {
			// Create the import link.
			var importLink			= _this.myGM.addElement('a', parent);
			importLink.href			= 'javascript:;';
			importLink.innerHTML	= _this.Language.$('default_optionPanel_section_optionPanelOptions_label_import');
			importLink.addEventListener('click', _importOptionsShowNotification, false);
		};
		
		/**
		 * Create the reset options link.
		 * 
		 * @private
		 * @inner
		 * 
		 * @param	{element}	_this
		 *   Reference to <code>_this</code>.
		 * @param	{element}	parent
		 *   Parent element for the link.
		 */
		var _resetOptions = function(_this, parent) {
			// Create the reset link.
			var resetLink		= _this.myGM.addElement('a', parent);
			resetLink.href		= 'javascript:;';
			resetLink.innerHTML	= _this.Language.$('default_optionPanel_section_optionPanelOptions_label_reset');
			resetLink.addEventListener('click', _resetOptionsShowNotification, false);
		};
		
		/*-------------------------------------------*
		 * Public variables, functions and settings. *
		 *-------------------------------------------*/
		
		/**
		 * Add a wrapper to the list.
		 * 
		 * @instance
		 * 
		 * @param	{string}				id
		 *   The id of the wrapper.
		 * @param	{string || string[]}	headerText
		 *   The text for the wrapper header. If the element is defined within the IkariamCore initialisation,
		 *   the translation string is not set. Then you can pass an object containing the string id.<br>
		 *   Object signature: <code>{ id: 'idValue' }</code>
		 * @param	{int}					position
		 *   The position of the wrapper on the options tab.
		 */
		this.addWrapper = function(id, headerText, position) {
			// If a wrapper with this id already exists, log it.
			if(_wrapper[id]) {
				_this.con.log('Options.addWrapper: Wrapper with id "' + id + '" defined two times.');
			
			// Otherwise: Store the wrapper.
			} else {
				_wrapper[id]	= { headerText: headerText, elements: {}, elementOrder: new Array() };
				_options[id]	= {};
				_wrapperOrder.insert(id, position);
			}
		};
		
		/**
		 * Add a new checkbox to the options tab.
		 * 
		 * @instance
		 * 
		 * @param	{string}				id
		 *   The id of the checkbox.
		 * @param	{string}				wrapperId
		 *   The id of the wrapper.
		 * @param	{string || int}			block
		 *   The block of the wrapper, the checkbox belongs to.
		 * @param	{boolean}				defaultChecked
		 *   If the checkbox is checked by default.
		 * @param	{string || string[]}	label
		 *   The text for the label. If the element is defined within the IkariamCore initialisation,
		 *   the translation string is not set. Then you can pass an object containing the string id.<br>
		 *   Object signature: <code>{ id: 'idValue' }</code>
		 * @param	{int}					position
		 *   The position of the checkbox in the wrapper.
		 */
		this.addCheckbox = function(id, wrapperId, block, defaultChecked, label, position) {
			/*
			 * Function to save the checkbox value.
			 */
			var save = function(elementId) {
				// Get the value and return it.
				return _this.myGM.$('#' + _this.myGM.prefix() + elementId + 'Cb').checked;
			};
			
			/*
			 * Function to create the checkbox.
			 */
			var create = function(parentTable, elementId, value, options) {
				// Get the label text, if not set yet.
				if(options.label.id) {
					if(options.label.args) {
						options.label = _this.Language.$(options.label.id, options.label.args);
					} else {
						options.label = _this.Language.$(options.label.id);
					}
				}
				
				// Create table row.
				var tr	= _this.myGM.addElement('tr', parentTable);
			
				// Create cell.
				var parent		= _this.myGM.addElement('td', tr);
				parent.colSpan	= 2;
				parent.classList.add('left');
				
				// Add checkbox.
				_this.myGM.addCheckboxes(parent, [{ id: elementId, label: options.label, checked: value }]);
			};
			
			// Add the checkbox to the option panel.
			_addElement(id, wrapperId, block, { label: label }, defaultChecked, create, save, position);
		};
		
		/**
		 * Add a new select field to the options tab.
		 * 
		 * @instance
		 * 
		 * @param	{string}				id
		 *   The id of the select field.
		 * @param	{string}				wrapperId
		 *   The id of the wrapper.
		 * @param	{string || int}			block
		 *   The block of the wrapper, the select field belongs to.
		 * @param	{mixed}					defaultSelected
		 *   The value of the option selected by default.
		 * @param	{string || string[]}	label
		 *   The text for the label. If the element is defined within the IkariamCore initialisation,
		 *   the translation string is not set. Then you can pass an object containing the string id.<br>
		 *   Object signature: <code>{ id: 'idValue' }</code>
		 * @param	{mixed[]}				opts
		 *   An array with the names an values of the options.
		 *   Signature: <code>[{ value: 'val', name: 'name' }]</code>
		 *   If the element is defined within the IkariamCore initialisation, the translation string for name is not set.
		 *   Then you can pass an object containing the string id for name.<br>
		 *   Object signature: <code>{ id: 'idValue' }</code>
		 * @param	{int}					position
		 *   The position of the select field in the wrapper.
		 */
		this.addSelect = function(id, wrapperId, block, defaultSelected, label, opts, position) {
			/*
			 * Function to save the select value.
			 */
			var save = function(elementId) {
				// Get value and return it.
				return _this.myGM.getSelectValue(elementId);
			};
			
			/*
			 * Function to create the select.
			 */
			var create = function(parentTable, elementId, value, options) {
				// Get the label text, if not set yet.
				if(options.label.id) {
					if(options.label.args) {
						options.label = _this.Language.$(options.label.id, options.label.args);
					} else {
						options.label = _this.Language.$(options.label.id);
					}
				}
				
				var opts = options.opts;
				
				// Get the option names, if not set yet.
				for(var i = 0; i < opts.length; i++) {
					if(opts[i].name && opts[i].name.id) {
						if(opts[i].name.args) {
							opts[i].name = _this.Language.$(opts[i].name.id, opts.name.args);
						} else {
							opts[i].name = _this.Language.$(opts[i].name.id);
						}
					}
				}
				
				// Add select field.
				_this.myGM.addSelect(parentTable, elementId, value, opts, options.label);
			};
			
			// Add the select field to the option panel.
			_addElement(id, wrapperId, block, { label: label, opts: opts }, defaultSelected, create, save, position);
		};
		
		/**
		 * Add a new textfield to the options tab.
		 * 
		 * @instance
		 * 
		 * @param	{string}				id
		 *   The id of the textfield.
		 * @param	{string}				wrapperId
		 *   The id of the wrapper.
		 * @param	{string || int}			block
		 *   The block of the wrapper, the textfield belongs to.
		 * @param	{boolean}				defaultValue
		 *   Default value of the textfield.
		 * @param	{string || string[]}	label
		 *   The text for the label. If the element is defined within the IkariamCore initialisation,
		 *   the translation string is not set. Then you can pass an object containing the string id.<br>
		 *   Object signature: <code>{ id: 'idValue' }</code>
		 * @param	{int}					position
		 *   The position of the textfield in the wrapper.
		 */
		this.addTextField = function(id, wrapperId, block, defaultValue, label, position) {
			/*
			 * Function to save the textfield value.
			 */
			var save = function(elementId) {
				// Get value and return it.
				return _this.myGM.$('#' + _this.myGM.prefix() + elementId + 'TextField').value;
			};
			
			/*
			 * Function to create the textfield.
			 */
			var create = function(parentTable, elementId, value, options) {
				// Get the label text, if not set yet.
				if(options.label.id) {
					if(options.label.args) {
						options.label = _this.Language.$(options.label.id, options.label.args);
					} else {
						options.label = _this.Language.$(options.label.id);
					}
				}
				
				// Create table row.
				var tr	= _this.myGM.addElement('tr', parentTable);
				
				// Create cells.
				var labelCell		= _this.myGM.addElement('td', tr);
				var textFieldCell	= _this.myGM.addElement('td', tr, null, 'left');
				
				// Create label.
				var tfLabel			= _this.myGM.addElement('span', labelCell);
				tfLabel.innerHTML	= options.label;
				
				// Add textfield.
				var tf		= _this.myGM.addElement('input', textFieldCell, elementId + 'TextField', ['textfield', 'scriptTextField']);
				tf.type		= 'text';
				tf.value	= value;
			};
			
			// Add the textfield to the option panel.
			_addElement(id, wrapperId, block, { label: label }, defaultValue, create, save, position);
		};
		
		/**
		 * Add a new textarea to the options tab.
		 * 
		 * @instance
		 * 
		 * @param	{string}				id
		 *   The id of the textarea.
		 * @param	{string}				wrapperId
		 *   The id of the wrapper.
		 * @param	{string || int}			block
		 *   The block of the wrapper, the textarea belongs to.
		 * @param	{boolean}				defaultValue
		 *   Default value of the textarea.
		 * @param	{string || string[]}	label
		 *   The text for the label. If the element is defined within the IkariamCore initialisation,
		 *   the translation string is not set. Then you can pass an object containing the string id.<br>
		 *   Object signature: <code>{ id: 'idValue' }</code>
		 * @param	{int}					position
		 *   The position of the textarea in the wrapper.
		 */
		this.addTextArea = function(id, wrapperId, block, defaultValue, label, position) {
			/*
			 * Function to save the textarea value.
			 */
			var save = function(elementId) {
				// Get value and return it.
				return _this.myGM.$('#' + _this.myGM.prefix() + elementId + 'TextArea').value;
			};
			
			/*
			 * Function to create the textarea.
			 */
			var create = function(parentTable, elementId, value, options) {
				// Get the label text, if not set yet.
				if(options.label.id) {
					if(options.label.args) {
						options.label = _this.Language.$(options.label.id, options.label.args);
					} else {
						options.label = _this.Language.$(options.label.id);
					}
				}
				
				// Create label table row.
				var labelRow	= _this.myGM.addElement('tr', parentTable);
				
				// Create cell.
				var labelCell		= _this.myGM.addElement('td', labelRow);
				labelCell.colSpan	= 2;
				labelCell.classList.add('left');
				
				// Create label.
				var taLabel			= _this.myGM.addElement('p', labelCell);
				taLabel.innerHTML	= options.label;
				
				// Create textarea table row.
				var taRow	= _this.myGM.addElement('tr', parentTable);
				
				// Create cell.
				var taCell		= _this.myGM.addElement('td', taRow);
				taCell.colSpan	= 2;
				taCell.classList.add('left');
				
				// Add the textarea.
				var textArea	= _this.myGM.addElement('textarea', taCell, elementId + 'TextArea', ['textfield', 'scriptTextArea']);
				textArea.value	= value;
			};
			
			// Add the textarea to the options panel.
			_addElement(id, wrapperId, block, { label: label, className: className }, defaultValue, create, save, position);
		};
		
		/**
		 * Add HTML content to the options tab.
		 * 
		 * @instance
		 * 
		 * @param	{string}		id
		 *   The id of the HTML content.
		 * @param	{string}		wrapperId
		 *   The id of the wrapper.
		 * @param	{string || int}	block
		 *   The block of the wrapper, the HTML content belongs to.
		 * @param	{string}	html
		 *   HTML string to add to the wrapper.
		 * @param	{function}		callback
		 *   Callback to run after setting the HTML string. Can also be used to create the HTML content.
		 *   Gets the this reference and the parent element passed as arguments.<br>
		 *   Signature: <code>function(thisReference : object, parent : element) : void</code>
		 * @param	{mixed}			thisReference
		 *   Reference to an object which should be referenced in the callback, because in the callback it is not possible to use some objects. (e.g. _this)
		 * @param	{int}			position
		 *   The position of the textarea in the wrapper.
		 */
		this.addHTML = function(id, wrapperId, block, html, callback, thisReference, position) {
			var create = function(parentTable, elementId, value, options) {
				// Create html table row.
				var htmlRow	= _this.myGM.addElement('tr', parentTable);
				
				// Create cell.
				var htmlCell		= _this.myGM.addElement('td', htmlRow);
				htmlCell.colSpan	= 2;
				htmlCell.classList.add('center');
				
				// Add the HTML.
				if(options.html) {
					htmlCell.innerHTML = options.html;
				}
				
				// Run the callback.
				if(options.callback) {
					options.callback(options.thisReference, htmlCell);
				}
			};
			
			// Add the HTML text.
			_addElement(id, wrapperId, block, { html: html, thisReference: thisReference, callback: callback }, null, create, null, position);
		};
		
		/**
		 * Add a new horizontal line to the options tab.
		 * 
		 * @instance
		 * 
		 * @param	{string}				wrapperId
		 *   The id of the wrapper.
		 * @param	{string || int}			block
		 *   The block of the wrapper, the horizontal line belongs to.
		 * @param	{int}					position
		 *   The position of the horizontal line in the wrapper.
		 */
		this.addHr = function(wrapperId, block, position) {
			/*
			 * Function to create the horizontal line.
			 */
			var create = function(parentTable, elementId, value, options) {
				// Create label table row.
				var tr	= _this.myGM.addElement('tr', parentTable);
				
				// Create cell.
				var lineCell		= _this.myGM.addElement('td', tr);
				lineCell.colSpan	= 2;
				lineCell.classList.add('left');
				
				// Add the line.
				_this.myGM.addElement('hr', lineCell);
			};
			
			// Add the line.
			_addElement('hr' + _hrId, wrapperId, block, null, null, create, null, position);
			
			// Raise the counter.
			_hrId++;
		};
		
		/**
		 * Deletes an wrapper with all option elements contained in it.
		 * 
		 * @instance
		 * 
		 * @param	{string}	id
		 *   Id of the wrapper to delete.
		 */
		this.deleteWrapper = function(id) {
			// No wrapper with this id => log.
			if(!_wrapper[id]) {
				_this.con.log('Options.deleteWrapper: Wrapper with id "' + id + '" does not exist.');
			} else {
				// Delete the wrapper.
				delete _wrapper[id];
				delete _options[id];
				
				var position = -1;
				
				for(var i = 0; i < _wrapperOrder.length; i++) {
					if(_wrapperOrder[i] == id) {
						position = i;
						break;
					}
				}
				
				_wrapperOrder.remove(position);
			}
		};
		
		/**
		 * Deletes an option element.
		 * 
		 * @instance
		 * 
		 * @param	{string}	wrapperId
		 *   The id of the wrapper containing the element.
		 * @param	{string}	elementId
		 *   The id of the element to delete.
		 */
		this.deleteElement = function(wrapperId, elementId) {
			if(!_wrapper[wrapperId] && _wrapper[wrapperId].elements[elementId]) {
				_this.con.log('Options.deleteElement: Element with id "' + wrapperId + '_' + elementId + '" does not exist.');
			} else {
				delete _wrapper[wrapperId].elements[elementId];
				delete _options[wrapperId][elementId];
				
				var position = -1;
				
				for(var i = 0; i < _wrapper[wrapperId].elementOrder.length; i++) {
					if(_wrapper[wrapperId].elementOrder[i] == elementId) {
						position = i;
						break;
					}
				}
				
				_wrapper[wrapperId].elementOrder.remove(position);
			}
		};
		
		/**
		 * Get the stored value of an option.
		 * 
		 * @instance
		 * 
		 * @param	{string}	wrapperId
		 *   Id of the wrapper of the option element.
		 * @param	{string}	optionId
		 *   Id of the option element.
		 * 
		 * @return	{mixed}
		 *   The stored value.
		 */
		this.getOption = function(wrapperId, optionId) {
			var option = null;
			
			// Get the option.
			if(_options[wrapperId] && (_options[wrapperId][optionId] || _options[wrapperId][optionId] == false)) {
				option = _options[wrapperId][optionId];
			} else {
				_this.con.log('Options.getOption: Option with id "' + wrapperId + '_' + optionId + '" not defined.');
			}
			
			// Return the option.
			return option;
		};
		
		/**
		 * Set the stored value of an option.
		 * 
		 * @instance
		 * 
		 * @param	{string}	wrapperId
		 *   Id of the wrapper of the option element.
		 * @param	{string}	optionId
		 *   Id of the option element.
		 * @param	{mixed}		value
		 *   The value to store.
		 */
		this.setOption = function(wrapperId, optionId, value) {
			// Set the option value.
			if(_options[wrapperId] && (_options[wrapperId][optionId] || _options[wrapperId][optionId] == false)) {
				_options[wrapperId][optionId] = value;
			} else {
				_this.con.log('Options.setOption: Option with id "' + wrapperId + '_' + optionId + '" not yet defined. Value "' + value + '" not stored.');
			}
			
			// Save the options.
			_saveOptions(true);
		};
		
		/*----------------------------------------*
		 * Register the show option panel handler *
		 *----------------------------------------*/
		
		// Register the option handler to show the options in the option panel.
		_this.RefreshHandler.add('options', 'showOptionPanel', _showOptionPanel);
		
		/*-------------------------------*
		 * Add the option panel options. *
		 *-------------------------------*/
		
		this.addWrapper('optionPanelOptions', { id: 'default_optionPanel_section_optionPanelOptions_title' });
		var opts = new Array(
				{ value: 'roundButton',		name: { id: 'default_optionPanel_section_optionPanelOptions_label_useStyle_option_roundButton'			}	},
				{ value: 'rectangleButton',	name: { id: 'default_optionPanel_section_optionPanelOptions_label_useStyle_option_rectangularButton'	}	}
			);
		this.addSelect('useStyle', 'optionPanelOptions', 'selects', 'roundButton', { id: 'default_optionPanel_section_optionPanelOptions_label_useStyle_description' }, opts);
		this.addHTML('exportOptions', 'optionPanelOptions', 'links', null, _exportOptions, _this);
		this.addHTML('importOptions', 'optionPanelOptions', 'links', null, _importOptions, _this);
		this.addHTML('resetOptions', 'optionPanelOptions', 'links', null, _resetOptions, _this);
	}
	
	/**
	 * Handler for options the user can set / change.
	 * 
	 * @instance
	 * 
	 * @type	IkariamCore~Options
	 */
	this.Options = new Options;
	
	/**
	 * Instantiate a new set of updating functions and start an initial update check.
	 * 
	 * @inner
	 * 
	 * @class
	 * @classdesc	Functions for checking for updates for the script.
	 */
	function Updater() {
		/*--------------------------------------------*
		 * Private variables, functions and settings. *
		 *--------------------------------------------*/
		
		/**
		 * Stores if the update was instructed by the user.
		 * 
		 * @private
		 * @inner
		 * 
		 * @default false
		 * 
		 * @type	boolean
		 */ 
		var _manualUpdate = false;
	
		/**
		 * Compares two versions and returns if there is a new version.
		 * 
		 * @private
		 * @inner
		 * 
		 * @param	{string}	versionOld
		 *   The old version number.
		 * @param	{string}	versionNew
		 *   The new version number.
		 * @param	{int}		maxPartsToCompare
		 *   The number of parts to compare at most. (optional, default "compare all parts")
		 *
		 * @return	{boolean}
		 *   If a new version is available.
		 */
		var _newerVersion = function(versionOld, versionNew, maxPartsToCompare) {
			// Stores if a new version is available.
			var newVersion = false;
	
			// Force both versions to be a string.
			versionOld += '';
			versionNew += '';
	
			// The parts of the versions.
			var versionOldParts = versionOld.split('.');
			var versionNewParts = versionNew.split('.');
	
			// The bigger number of parts of the versions.
			var biggerNumberOfParts = versionOldParts.length > versionNewParts.length ? versionOldParts.length : versionNewParts.length;
	
			// If all parts should be compared, set maxPartsToCompare to all parts.
			if(!maxPartsToCompare || maxPartsToCompare < 1) {
				maxPartsToCompare = biggerNumberOfParts + 1;
			}
	
			// Loop over all parts of the version with less parts.
			for(var i = 0; i < biggerNumberOfParts; i++) {
				// Get the value of the parts.
				var versionPartOld = parseInt(versionOldParts[i] || 0);
				var versionPartNew = parseInt(versionNewParts[i] || 0);
	
				// If the old part is smaller than the new, return true.
				if(versionPartOld < versionPartNew) {
					newVersion = true;
					break;
	
				// Else if the old part is bigger than the new it is now new version; return false.
				} else if(versionPartOld > versionPartNew || i == maxPartsToCompare - 1) {
					newVersion = false;
					break;
				}
			}
	
			// Return if there is a new version.
			return newVersion;
		};
		
		/**
		 * Extract the update history from the metadata.
		 * 
		 * @private
		 * @inner
		 * 
		 * @param	{string[]}	metadata
		 *   Array with the formated metadata.
		 *
		 * @return	{mixed[]}
		 *   The extracted update history.
		 */
		var _extractUpdateHistory = function(metadata) {
			// Create variable to store the update history.
			var updateHistory = {};
	
			// Loop over all update history data.
			for(var i = 0; i < metadata['history'].length; i++) {
				// Get the information from the update history data.
				var tmp = metadata['history'][i].match(/^(\S+)\s+(\S+)\s+(.*)$/);
	
				// If there is no array for this version create one.
				if(!updateHistory[tmp[1]]) {
					updateHistory[tmp[1]] = {};
				}
				
				switch(tmp[2].trim(':').toLowerCase()) {
					case 'release':
						updateHistory[tmp[1]].release = tmp[3];
					  break;
					
					case 'feature':
						if(!updateHistory[tmp[1]].feature) {
							updateHistory[tmp[1]].feature = new Array(tmp[3]);
						} else {
							updateHistory[tmp[1]].feature.push(tmp[3]);
						}
					  break;
					
					case 'change':
						if(!updateHistory[tmp[1]].change) {
							updateHistory[tmp[1]].change = new Array(tmp[3]);
						} else {
							updateHistory[tmp[1]].change.push(tmp[3]);
						}
					  break;
					
					case 'bugfix':
						if(!updateHistory[tmp[1]].bugfix) {
							updateHistory[tmp[1]].bugfix = new Array(tmp[3]);
						} else {
							updateHistory[tmp[1]].bugfix.push(tmp[3]);
						}
					  break;
					
					case 'language':
						if(!updateHistory[tmp[1]].language) {
							updateHistory[tmp[1]].language = new Array(tmp[3]);
						} else {
							updateHistory[tmp[1]].language.push(tmp[3]);
						}
					  break;
					
					case 'core':
						if(!updateHistory[tmp[1]].core) {
							updateHistory[tmp[1]].core = new Array(tmp[3]);
						} else {
							updateHistory[tmp[1]].core.push(tmp[3]);
						}
					  break;
					
					default:
						if(!updateHistory[tmp[1]].other) {
							updateHistory[tmp[1]].other = new Array(tmp[2] + " " + tmp[3]);
						} else {
							updateHistory[tmp[1]].other.push(tmp[2] + " " + tmp[3]);
						}
					  break;
				}
			}
	
			// Return the update history.
			return updateHistory;
		};
		
		/**
		 * Format the update history using some HTML codes.
		 * 
		 * @private
		 * @inner
		 * 
		 * @param	{mixed[]}	updateHistory
		 *   The update history.
		 *
		 * @return	{string}
		 *   The formated update history.
		 */
		var _formatUpdateHistory = function(updateHistory) {
			// Create a variable for the formated update history.
			var formatedUpdateHistory = '';
			
			// Loop over all versions.
			for(var version in updateHistory) {
				if(Object.prototype.hasOwnProperty.call(updateHistory, version)) {
					// Create a headline for each version and start a table.
					formatedUpdateHistory += '<h2>v ' + version + '</h2><span class="smallFont">' + updateHistory[version].release + '</span></small><br><table class="' + _this.myGM.prefix() + 'updateTable"><tbody>';
		
					// Loop over all types.
					for(var type in updateHistory[version]) {
						if(Object.prototype.hasOwnProperty.call(updateHistory[version], type) && type != 'release') {
							// Create a table row for each type and start a list for the elements.
							formatedUpdateHistory += '<tr><td class="' + _this.myGM.prefix() + 'updateDataType">' + _this.Language.$('default_update_possible_type_' + type) + '</td><td class="' + _this.myGM.prefix() + 'updateDataInfo"><ul>';
			
							// Loop over the elements and add them to the list.
							for(var i = 0 ; i < updateHistory[version][type].length; i++) {
								formatedUpdateHistory += '<li>' + updateHistory[version][type][i] + '</li>';
							}
			
							// End the list.
							formatedUpdateHistory += '</ul></td></tr>';
						}
					}
		
					// End the table.
					formatedUpdateHistory += '</tbody></table><br>';
				}
			}
	
			// Return the formated update history.
			return formatedUpdateHistory;
		};
		
		/**
		 * Show the update information panel.
		 * 
		 * @private
		 * @inner
		 * 
		 * @param	{mixed[]}	metadata
		 *   Array with formated metadata
		 */
		var _showUpdateInfo = function(metadata) {
			// Get the update history.
			var updateHistory = _extractUpdateHistory(metadata);
	
			// Set the notification text.
			var notificationText = {
				header:		_this.Language.$('default_update_possible_header'),
				bodyTop:	_this.Language.$('default_update_possible_text', ['<a href="http://userscripts.org/scripts/show/' + scriptInfo.id + '" target="_blank" >' + scriptInfo.name + '</a>', scriptInfo.version, metadata.version]) + '<br>&nbsp;&nbsp;<b><u>' + _this.Language.$('default_update_possible_history') + '</u></b>',
				bodyBottom:	_formatUpdateHistory(updateHistory),
				confirm:	_this.Language.$('default_update_possible_button_install'),
				abort:		_this.Language.$('default_update_possible_button_hide')
			};
	
			// Set the notification callback.
			var notificationCallback = {
				confirm:	function() { _this.win.top.location.href = 'http://userscripts.org/scripts/source/' + scriptInfo.id + '.user.js'; },
				abort:		function() { _this.myGM.setValue('updater_hideUpdate', metadata.version + ''); }
			};
	
			// Show a notification.
			_this.myGM.notification(notificationText, notificationCallback);
		};
	
		/**
		 * Format the given metadata.
		 * 
		 * @private
		 * @inner
		 * 
		 * @param	{string}	metadata
		 *   The metadata to format.
		 *
		 * @return	{string[]}
		 *   The formatted metadata as array.
		 */
		var _formatMetadata = function(metadataIn) {
			// Create an array for the formated metadata.
			var metadataOut = new Array();
	
			// Extract the tags from the metadata.
			var innerMeta = metadataIn.match(/\/\/ ==UserScript==((.|\n|\r)*?)\/\/ ==\/UserScript==/)[0];
	
			// If there are some tags.
			if(innerMeta) {
				// Extract all tags.
				var tags = innerMeta.match(/\/\/ @(.*?)(\n|\r)/g);
	
				// Loop over all tags.
				for(var i = 0; i < tags.length; i++) {
					// Extract the data from the tag.
					var tmp = tags[i].match(/\/\/ @(.*?)\s+(.*)/);
	
					// If there is no data with this tag create a new array to store all data with this tag.
					if(!metadataOut[tmp[1]]) {
						metadataOut[tmp[1]] = new Array(tmp[2]);
	
					// Otherwise add the data to the existing array.
					} else {
						metadataOut[tmp[1]].push(tmp[2]);
					}
				}
			}
	
			// Return the formated metadata.
			return metadataOut;
		};
		
		/*-------------------------------------------*
		 * Public variables, functions and settings. *
		 *-------------------------------------------*/
		
		/**
		 * Check for updates for the script. Automatically done on every instantiation of {@link IkariamCore}
		 * if the period from the last update is bigger than the check interval.
		 * 
		 * @instance
		 */
		this.checkForUpdates = function() {
			// Send a request to the userscripts.org server to get the metadata of the script to check if there is a new Update.
			var notPossible = _this.myGM.xhr({
					method: 'GET',
					url: 'http://userscripts.org/scripts/source/' + scriptInfo.id + '.meta.js',
					headers: {'User-agent': 'Mozilla/5.0', 'Accept': 'text/html'},
					onload: function(response) {
						// Extract the metadata from the response.
						var metadata = _formatMetadata(response.responseText);
						
						// If a new Update is available and the update hint should be shown.
						if(_newerVersion(scriptInfo.version, metadata.version, _this.Options.getOption('updateOptions', 'updateNotifyLevel')) && (_this.myGM.getValue('updater_hideUpdate', scriptInfo.version) != metadata.version) || _manualUpdate) {
							// Show update dialogue.
							_showUpdateInfo(metadata);
	
						// If there is no new update and it was a manual update show hint.
						} else if(_manualUpdate)	{
							// Set the notification text.
							var notificationText = {
								header:	_this.Language.$('default_update_noNewExists_header'),
								body:	_this.Language.$('default_update_noNewExists_text', ['<a href="http://userscripts.org/scripts/show/' + scriptInfo.id + '" target="_blank" >' + scriptInfo.name + '</a>', scriptInfo.version])
							};
	
							// Show a notification.
							_this.myGM.notification(notificationText);
						}
					}
				});
			
			if(notPossible && notPossible == true) {
				// Set the update interval to max.
				_this.Options.setOption('updateOptions', 'updateInterval', 2419200);

				// Set the notification text.
				var notificationText = {
					header:	_this.Language.$('default_update_notPossible_header'),
					body:	_this.Language.$('default_update_notPossible_text', ['<a href="http://userscripts.org/scripts/show/' + scriptInfo.id + '" target="_blank" >' + scriptInfo.name + '</a>', scriptInfo.version])
				};

				// Show a notification.
				_this.myGM.notification(notificationText);
			}
		};
		
		/**
		 * Search manually for updates. Forces to search for updates. Even shows a popup if no new update is available.
		 * 
		 * @instance
		 */
		this.doManualUpdate = function() {
			// Manual Update.
			_manualUpdate = true;
			
			// Check for Updates.
			_this.Updater.checkForUpdates();
	
			// Set the time for the last update check to now.
			_this.myGM.setValue('updater_lastUpdateCheck', (new Date()).getTime() + '');
		};
		
		/*------------------------*
		 * Add the updater styles *
		 *------------------------*/
		
		// Set the updater style.
		_this.myGM.addStyle(
				"." + _this.myGM.prefix() + "updateTable			{ border-collapse: separate; border-spacing: 2px; } \
				 ." + _this.myGM.prefix() + "updateDataType			{ width: 100px; padding: 5px 0px 5px 5px; border: 1px solid #D2A860; } \
				 ." + _this.myGM.prefix() + "updateDataInfo			{ width: 300px; padding: 5px 5px 5px 20px; border: 1px solid #D2A860; } \
				 ." + _this.myGM.prefix() + "updateDataInfo ul li	{ list-style: disc outside none; }",
				'updater', true
			);
		
		/*----------------------*
		 * Register the options *
		 *----------------------*/
		
		_this.Options.addWrapper('moduleOptions', { id: 'default_optionPanel_section_module_title' }, 0);
		_this.Options.addCheckbox('updateActive', 'moduleOptions', 1, true, { id: 'default_optionPanel_section_module_label_updateActive' });
		_this.Options.addHr('moduleOptions', 1);
		
		// Array for update interval values and names.
		var _updateIntervalOpts = new Array(
				{ value: 3600,		name: { id: 'default_optionPanel_section_update_label_interval_option_hour'		}	},
				{ value: 43200,		name: { id: 'default_optionPanel_section_update_label_interval_option_hour12'	}	},
				{ value: 86400,		name: { id: 'default_optionPanel_section_update_label_interval_option_day'		}	},
				{ value: 259200,	name: { id: 'default_optionPanel_section_update_label_interval_option_day3'		}	},
				{ value: 604800,	name: { id: 'default_optionPanel_section_update_label_interval_option_week'		}	},
				{ value: 1209600,	name: { id: 'default_optionPanel_section_update_label_interval_option_week2'	}	},
				{ value: 2419200,	name: { id: 'default_optionPanel_section_update_label_interval_option_week4'	}	}
			);
		
		var _updateNotifyLevelOpts = new Array(
				{ value: 0,	name: { id: 'default_optionPanel_section_update_label_notifyLevel_option_all'	}	},
				{ value: 1,	name: { id: 'default_optionPanel_section_update_label_notifyLevel_option_major'	}	},
				{ value: 2,	name: { id: 'default_optionPanel_section_update_label_notifyLevel_option_minor'	}	},
				{ value: 3,	name: { id: 'default_optionPanel_section_update_label_notifyLevel_option_patch'	}	}
			);
		
		var _searchUpdates = function(_this, parent) {
			var updateLink			= _this.myGM.addElement('a', parent);
			updateLink.href			= 'javascript:;';
			updateLink.innerHTML	= _this.Language.$('default_optionPanel_section_update_label_manual', new Array(scriptInfo.name));
			updateLink.addEventListener('click', _this.Updater.doManualUpdate, false);
		};
		
		_this.Options.addWrapper('updateOptions', { id: 'default_optionPanel_section_update_title' }, 1);
		_this.Options.addSelect('updateInterval', 'updateOptions', 'generalOptions', 3600, { id: 'default_optionPanel_section_update_label_interval_description' }, _updateIntervalOpts);
		_this.Options.addSelect('updateNotifyLevel', 'updateOptions', 'generalOptions', 0, { id: 'default_optionPanel_section_update_label_notifyLevel_description' }, _updateNotifyLevelOpts);
		_this.Options.addHTML('manualUpdateLink', 'updateOptions', 'generalOptions', null, _searchUpdates, _this);
		
		/*-------------------------------------*
		 * Check automatically for new updates *
		 *-------------------------------------*/
		
		// Get the difference between now and the last check.
		var _lastCheck	= _this.myGM.getValue('updater_lastUpdateCheck', 0);
		var _millis		= (new Date()).getTime();
		var _diff		= _millis - _lastCheck;
		
		// If the module is active and the period from the last update is bigger than the check interval, check for updates.
		if(_this.Options.getOption('moduleOptions', 'updateActive') && _diff > _this.Options.getOption('updateOptions', 'updateInterval') * 1000) {
			// No manual Update.
			_manualUpdate = false;

			// Check for Updates.
			this.checkForUpdates();

			// Set the time for the last update check to now.
			_this.myGM.setValue('updater_lastUpdateCheck', _millis + '');
		}
	}
	
	/**
	 * Updater to check for updates on Userscripts.org.
	 * 
	 * @instance
	 * 
	 * @type	IkariamCore~Updater
	 */
	this.Updater = new Updater;
}