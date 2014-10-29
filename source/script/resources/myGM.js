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
		var _go_styleSheets = {};
		
		/**
		 * Storage for notification id for possibility to identify a notification popup.
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	int
		 */
		var _gi_notificationId = 0;
		
		/**
		 * If the Greasemonkey functions GM_setVaule, GM_getValue, GM_deleteValue and GM_listValues can be used.
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	boolean
		 */
		var _gb_canUseGmStorage = !(typeof GM_getValue == 'undefined' || (typeof GM_getValue.toString == 'function' && GM_getValue.toString().indexOf('not supported') > -1))
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
		var _gb_canUseGmRessource = !(typeof GM_getResourceText == 'undefined' || (typeof GM_getResourceText.toString == 'function' && GM_getResourceText.toString().indexOf('not supported') > -1));
		
		/**
		 * If the Greasemonkey function GM_xmlhttpRequest can be used.
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	boolean
		 */
		var _gb_canUseGmXhr = !(typeof GM_xmlhttpRequest == 'undefined' || (typeof GM_xmlhttpRequest.toString == 'function' && GM_xmlhttpRequest.toString().indexOf('not supported') > -1));
		
		/**
		 * If the local storage can be used.
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	boolean
		 */
		var _gb_canUseLocalStorage = !!go_self.win.localStorage;
		
		/**
		 * The domain for storing cookies.
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	string
		 */
		var _gs_cookieDomain = 'ikariam.gameforge.com';
		
		/**
		 * Create the header for a notification panel.
		 * 
		 * @private
		 * @inner
		 * 
		 * @param	{int}		ii_id
		 *   The id of the notification.
		 * @param	{element}	ie_panel
		 *   The panel of the notification.
		 * @param	{string}	is_headerText
		 *   The text for the header.
		 * @param	{function}	if_closePanel
		 *   The function to close the notification panel.
		 */
		var _createNotificationPanelHeader = function(ii_id, ie_panel, is_headerText, if_closePanel) {
			var le_wrapper		= go_self.myGM.addElement('div', ie_panel, { 'id': 'notificationPanelHeader' + ii_id, 'class': 'notificationPanelHeader' }, true);
			var le_left			= go_self.myGM.addElement('div', le_wrapper, { 'id': 'notificationPanelHeaderL' + ii_id, 'class': 'notificationPanelHeaderL' }, true);
			var le_right		= go_self.myGM.addElement('div', le_left, { 'id': 'notificationPanelHeaderR' + ii_id, 'class': 'notificationPanelHeaderR' }, true);
			var le_center		= go_self.myGM.addElement('div', le_right, { 'id': 'notificationPanelHeaderM' + ii_id, 'class': 'notificationPanelHeaderM', 'innerHTML': is_headerText }, true);
			go_self.myGM.addElement('div', le_center, { 'id': 'notificationPanelClose' + ii_id, 'class': 'notificationPanelClose', 'click': if_closePanel }, true);
		};
		
		/**
		 * Create the header for a notification.
		 * 
		 * @private
		 * @inner
		 * 
		 * @param	{int}		ii_id
		 *   The id of the notification.
		 * @param	{element}	ie_panel
		 *   The panel of the notification.
		 * @param	{mixed[]}	io_options
		 *   Options for the body. All options are optional. 'readonly' and 'autofocus' are only used if 'textarea' = true.<br>
		 *   Signature:<br>
		 *   <code>{<br>
		 *   	'textarea': boolean, // if the body should be a textarea, dafult: false<br>
		 *   	'readonly': boolean, // textarea is readonly, default: false<br>
		 *   	'autofocus': boolean // textarea content is autoselected on first click, default: false<br>
		 *   }</code>
		 * @param	{string}	io_texts
		 *   The texts for the body.
		 */
		var _createNotificationPanelBody = function(ii_id, ie_panel, io_options, io_texts) {
			var le_wrapper	= go_self.myGM.addElement('div', ie_panel, { 'id': 'notificationPanelBody' + ii_id, 'class': 'notificationPanelBody' }, true);
			var le_left		= go_self.myGM.addElement('div', le_wrapper, { 'id': 'notificationPanelBodyL' + ii_id, 'class': 'notificationPanelBodyL' }, true);
			var le_right	= go_self.myGM.addElement('div', le_left, { 'id': 'notificationPanelBodyR' + ii_id, 'class': 'notificationPanelBodyR' }, true);
			var le_center	= go_self.myGM.addElement('div', le_right, { 'id': 'notificationPanelBodyM' + ii_id, 'class': 'notificationPanelBodyM' }, true);
			var ls_bodyType = 'div';
			var re_body;
			
			var lo_generalOptions = {};
			
			if(io_options.textarea === true) {
				ls_bodyType = 'textarea';
				
				if(io_options.readonly === true)
					lo_generalOptions['readonly'] = 'readonly';
				
				if(io_options.autoselect === true)
					lo_generalOptions['focus'] = function() { this.select(); };
			}
			
			if(!!io_texts.body === true) {
				re_body = go_self.myGM.addElement(ls_bodyType, le_center, go_self.myGM.merge({
					'id':			'notificationPanelBodyMContent' + ii_id,
					'class':		'notificationPanelBodyMContent',
					'innerHTML':	io_texts.body
				}, lo_generalOptions), true);
			} else {
				go_self.myGM.addElement('div', le_center, { 'id': 'notificationPanelBodyMTop' + ii_id, 'class': 'notificationPanelBodyMTop', 'innerHTML': io_texts.top }, true);
				re_body = go_self.myGM.addElement(ls_bodyType, le_center, go_self.myGM.merge({
					'id':			'notificationPanelBodyMBottom' + ii_id,
					'class':		'notificationPanelBodyMBottom',
					'innerHTML':	io_texts.bottom
				}, lo_generalOptions), true);
			}
			
			if(io_options.textarea !== true)
				re_body = null;
			
			go_self.myGM.addElement('div', le_center, { 'id': 'notificationPanelBodyPlaceholder' + ii_id, 'class': 'notificationPanelBodyPlaceholder' }, true);
			
			return re_body;
		};
		
		/**
		 * Create the footer for a notification panel.
		 * 
		 * @private
		 * @inner
		 * 
		 * @param	{int}		ii_id
		 *   The id of the notification.
		 * @param	{element}	ie_panel
		 *   The panel of the notification.
		 */
		var _createNotificationPanelFooter = function(ii_id, ie_panel) {
			var le_wrapper		= go_self.myGM.addElement('div', ie_panel, { 'id': 'notificationPanelFooter' + ii_id, 'class': 'notificationPanelFooter' }, true);
			var le_left			= go_self.myGM.addElement('div', le_wrapper, { 'id': 'notificationPanelFooterL' + ii_id, 'class': 'notificationPanelFooterL' }, true);
			var le_right		= go_self.myGM.addElement('div', le_left, { 'id': 'notificationPanelFooterR' + ii_id, 'class': 'notificationPanelFooterR' }, true);
			go_self.myGM.addElement('div', le_right, {
				'id':			'notificationPanelFooterM' + ii_id,
				'class':		'notificationPanelFooterM',
				'innerHTML':	go_script.name + ' v' + go_script.version
			}, true);
		};
		
		/**
		 * Create the buttons for a notification panel.
		 * 
		 * @private
		 * @inner
		 * 
		 * @param	{int}		ii_id
		 *   The id of the notification.
		 * @param	{element}	ie_panel
		 *   The panel of the notification.
		 * @param	{element}	ie_body
		 *   The body of the notification.
		 * @param	{string}	io_texts
		 *   The texts for the buttons.
		 * @param	{function}	io_callbacks
		 *   The callbacks for the buttons.
		 */
		var _createNotificationPanelButtons = function(ii_id, ie_panel, ie_body, io_texts, io_callbacks) {
			var le_wrapper	= go_self.myGM.addElement('div', ie_panel, {
				'id':		'notificationPanelButtonWrapper' + ii_id,
				'class':	'notificationPanelButtonWrapper'
			}, true);
			
			var lf_confirm;
			if(!!io_callbacks.confirm === true)
				lf_confirm = function() { io_callbacks.close(); io_callbacks.confirm(ie_body); };
			else
				lf_confirm = io_callbacks.close;
			
			go_self.myGM.addElement('input', le_wrapper, {
				'id':		'notificationPanelConfirm' + ii_id,
				'classes':	['notificationPanelButton', 'notificationPanelButtonConfirm'],
				'type':		'button',
				'value':	io_texts.confirm,
				'click':	lf_confirm
			}, true);
			
			if(!!io_callbacks.abort === true) {
				go_self.myGM.addElement('input', le_wrapper, {
					'id':		'notificationPanelAbort' + ii_id,
					'classes':	['notificationPanelButton', 'notificationPanelButtonAbort'],
					'type':		'button',
					'value':	io_texts.abort,
					'click':	function() { io_callbacks.close(); io_callbacks.abort(ie_body); }
				}, true);
			}
		};
		
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
		this.__defineGetter__('prefix', function() {
			return 'script' + go_script.id;
		});
		
		/**
		 * Returns if the script is already executed on this page.
		 * 
		 * @instance
		 *
		 * @return	{boolean}
		 *   If the script was already executed.
		 */
		this.__defineGetter__('alreadyExecuted', function() {
			if(this.$('#' + this.prefix + 'alreadyExecuted'))
				return true;
		
			// Add the hint, that the script was already executed.
			this.addElement('input', this.$('body'), { 'id': 'alreadyExecuted', 'type': 'hidden' });
			return false;
		});
		
		/**
		 * Store a value specified by a key.
		 * 
		 * @instance
		 * 
		 * @param	{string}	is_key
		 *   The key of the value.
		 * @param	{mixed}		im_value
		 *   The value to store.
		 */
		this.setValue = function(is_key, im_value) {
			// Stringify the value to store also arrays.
			var ls_toStore = JSON.stringify(im_value);
			
			// If the use of the default GM_setValue ist possible, use it.
			if(_gb_canUseGmStorage) {
				GM_setValue(is_key, ls_toStore);
				
			// Otherwise use the local storage if possible.
			} else if(_gb_canUseLocalStorage) {
				go_self.win.localStorage.setItem(this.prefix + is_key, ls_toStore);
	
			// Otherwise use cookies.
			} else {
				var ls_data	= escape(this.prefix + is_key) + '=' + escape(ls_toStore);
				var ls_expire	= 'expires=' + (new Date(2020, 0, 1, 0, 0, 0, 0)).toGMTString();
				var ls_path	= 'path=/';
				var ls_domain	= 'domain=' + _gs_cookieDomain;
	
				go_self.win.document.cookie = ls_data + ';' + ls_expire + ';' + ls_path + ';' + ls_domain;
			}
		};
	
		/**
		 * Get a value and return it.
		 * 
		 * @instance
		 * 
		 * @param	{string}	is_key
		 *   The key of the value.
		 * @param	{mixed}		im_defaultValue
		 *   The value which is set if the value is not set.
		 *
		 * @return	{mixed}
		 *   The stored value.
		 */
		this.getValue = function(is_key, im_defaultValue) {
			// Put the default value to JSON.
			var ls_value = JSON.stringify(im_defaultValue);
	
			// If the use of the default GM_getValue ist possible, use it.
			if(_gb_canUseGmStorage) {
				ls_value = GM_getValue(is_key, ls_value);
	
			// Otherwise use the local storage if possible.
			} else if(_gb_canUseLocalStorage) {
				var ls_value = go_self.win.localStorage.getItem(this.prefix + is_key);
	
				if(ls_value) {
					ls_value = ls_value;
				}
	
			// Otherwise use cookies.
			} else {
				var la_allCookies = document.cookie.split("; ");
	
				for(var i = 0; i < la_allCookies.length; i++) {
					var la_oneCookie = la_allCookies[i].split("=");
	
					if(la_oneCookie[0] == escape(this.prefix + is_key)) {
						ls_value = unescape(la_oneCookie[1]);
						break;
					}
				}
			}
			
			// Return the value (parsed for the correct return type).
			return JSON.parse(ls_value);
		};
	
		/**
		 * Delete a value specified by a key.
		 * 
		 * @instance
		 * 
		 * @param	{string}	is_key
		 *   The key of the value.
		 */
		this.deleteValue = function(is_key) {
			// If the use of the default GM_deleteValue ist possible, use it.
			if(_gb_canUseGmStorage) {
				GM_deleteValue(is_key);
	
			// Otherwise use the local storage if possible.
			} else if(_gb_canUseLocalStorage) {
				go_self.win.localStorage.removeItem(this.prefix + is_key);
	
			// Otherwise use cookies.
			} else {
				var ls_data	= escape(this.prefix + is_key) + '=';
				var ls_expire	= 'expires=' + (new Date(2000, 0, 1, 0, 0, 0, 0)).toGMTString();
				var ls_path	= 'path=/';
				var ls_domain	= 'domain=' + _gs_cookieDomain;
	
				go_self.win.document.cookie = ls_data + ';' + ls_expire + ';' + ls_path + ';' + ls_domain;
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
			var ra_key = new Array();
	
			// If the use of the default GM_listValues ist possible, use it.
			if(_gb_canUseGmStorage) {
				ra_key = GM_listValues();
	
			// Otherwise use the local storage if possible.
			} else if(_gb_canUseLocalStorage) {
				for(var i = 0; i < go_self.win.localStorage.length; i++) {
					var ls_keyName = go_self.win.localStorage.key(i);
	
					if(ls_keyName.indexOf(this.prefix) != -1) {
						ra_key.push(ls_keyName.replace(this.prefix, ''));
					}
				}
	
			// Otherwise use cookies.
			} else {
				var la_allCookies = document.cookie.split("; ");
	
				for(var i = 0; i < la_allCookies.length; i++) {
					var ls_keyName = unescape(la_allCookies[i].split("=")[0]);
	
					if(ls_keyName.indexOf(this.prefix) != -1) {
						ra_key.push(ls_keyName.replace(this.prefix, ''));
					}
				}
			}
	
			// Return all keys.
			return ra_key;
		};
	
		/**
		 * Adds a style element to the head of the page and return it.
		 * 
		 * @instance
		 * 
		 * @param	{string}	is_styleRules
		 *   The style rules to be set.
		 * @param	{string}	is_id
		 *   An id for the style set, to have the possibility to delete it. (optional, if none is set, the stylesheet is not stored)
		 * @param	{boolean}	ib_overwrite
		 *   If a style with id should overwrite an existing style.
		 *
		 * @return	{boolean}
		 *    If the stylesheet was stored with the id.
		 */
		this.addStyle = function(is_styleRules, is_id, ib_overwrite) {
			var rb_storedWithId = false;
	
			if(ib_overwrite && ib_overwrite == true)
				this.removeStyle(is_id);
	
			if(!is_id || (is_id && !_go_styleSheets[is_id])) {
				var le_style = this.addElement('style', document.head, { 'type': 'text/css', 'innerHTML': is_styleRules });
	
				if(is_id) {
					_go_styleSheets[is_id] = le_style;
					rb_storedWithId = true;
				}
			}
	
			return rb_storedWithId;
		};
	
		/**
		 * Removes a style element set by the script.
		 * 
		 * @instance
		 * 
		 * @param	{string}	is_id
		 *   The id of the stylesheet to delete.
		 *
		 * @return	{boolean}
		 *    If the stylesheet could be deleted.
		 */
		this.removeStyle = function(is_id) {
			var rb_removed = false;
	
			if(is_id && _go_styleSheets[is_id]) {
				document.head.removeChild(_go_styleSheets[is_id]);
	
				delete	_go_styleSheets[is_id];
	
				rb_removed = true;
			}
	
			return rb_removed;
		};
		
		/**
		 * Makes a cross-site XMLHttpRequest.
		 * 
		 * @instance
		 * 
		 * @param	{mixed[]}	im_args
		 *   The arguments the request needs. (specified here: {@link http://wiki.greasespot.net/GM_xmlhttpRequest GM_xmlhttpRequest})
		 * 
		 * @return	{mixed}
		 *   The response text or a hint indicating an error.
		 */
		this.xhr = function(im_args) {
			var rm_responseText;
	
			// Check if all required data is given.
			if(!im_args.method || !im_args.url || !im_args.onload) {
				return false;
			}
	
			// If the use of the default GM_xmlhttpRequest ist possible, use it.
			if(_gb_canUseGmXhr) {
				var lm_response = GM_xmlhttpRequest(im_args);
				rm_responseText = lm_response.responseText;
	
			// Otherwise show a hint for the missing possibility to fetch the data.
			} else {
				// Storage if the link fetches metadata from userscripts.org
				var lb_isJSON = (im_args.url.search(/\.json$/i) != -1);
	
				// Otherwise if it is JSON.
				if(lb_isJSON) {
					im_args.onload('{ "is_error": true }');
					rm_responseText = '{ "is_error": true }';
	
				// Otherwise.
				} else {
					rm_responseText = false;
				}
			}
	
			// Return the responseText.
			return rm_responseText;
		};
		
		/**
		 * Returns the content of a resource parsed with JSON.parse.
		 * 
		 * @instance
		 * 
		 * @param	{string}	is_name
		 *   The name of the resource to parse.
		 * @param	{string}	is_xhrUrl
		 *   The resource to fetch the resource file from if the use of GM_getResourceText is not possible.
		 *   
		 * @return	{mixed[]}
		 *   The parsed resource.
		 */
		this.getResourceParsed = function(is_name, is_xhrUrl) {
			var ls_responseText = '';
	
			// Function for safer parsing.
			var lf_safeParse = function(is_key, im_value) {
				// If the value is a function, return just the string, so it is not executable.
				if(typeof im_value === 'function' || Object.prototype.toString.apply(im_value) === '[object function]') {
					return im_value.toString();
				}

				return im_value;
			};
	
			// If the use of the default GM_getRessourceText ist possible, use it.
			if(_gb_canUseGmRessource) {
				ls_responseText = GM_getResourceText(is_name);
	
			// Otherwise perform a xmlHttpRequest.
			} else {
				ls_responseText = this.xhr({
					method:			'GET',
					url:			is_xhrUrl,
					headers:		{ 'User-agent': navigator.userAgent, 'Accept': 'text/html' },
					synchronous:	true,
					onload:			function(im_response) { return false; }
				});
			}
	
			return JSON.parse(ls_responseText, lf_safeParse);
		};
		
		/**
		 * Gets the first matching child element by a query and returns it.
		 * 
		 * @instance
		 * 
		 * @param	{string}	is_query
		 *   The query for the element.
		 * @param	{element}	ie_parent
		 *   The parent element. (optional, default document)
		 *
		 * @return	{element}
		 *   The element.
		 */
		this.$ = function(is_query, ie_parent) {
			return this.$$(is_query, ie_parent)[0];
		};
	
		/**
		 * Gets all matching child elements by a query and returns them.
		 * 
		 * @instance
		 * 
		 * @param	{string}	is_query
		 *   The query for the elements.
		 * @param	{element}	ie_parent
		 *   The parent element. (optional, default document)
		 *
		 * @return	{element[]}
		 *   The elements.
		 */
		this.$$ = function(is_query, ie_parent) {
			var le_parent = ie_parent || document;
			
			// Return the elements as array, not as element list.
			return Array.prototype.slice.call(le_parent.querySelectorAll(is_query));
		};
		
		/**
		 * Returns the value of the selected option of a select field.
		 *
		 * @param	{string}	is_id
		 *   The last part of the id of the element.
		 * @param	{boolean}	ib_hasNoPrefix
		 *   Says if the id has no prefix.
		 * @param	{boolean}	ib_addNoSelect
		 *   Says if there should not be added a "Select" at the end of the id.
		 *
		 * @return	{string}
		 *   The value.
		 */
		this.getSelectValue = function(is_id, ib_hasNoPrefix, ib_addNoSelect) {
			var le_select = this.$('#' + (ib_hasNoPrefix ? '' : this.prefix) + is_id + (ib_addNoSelect ? '' : 'Select'));
	
			return le_select.options[le_select.selectedIndex].value;
		};
		
		/**
		 * Returns the value of the selected radio button of a radio button group.
		 *
		 * @param	{string}	is_name
		 *   The last part of the name of the element.
		 * @param	{boolean}	ib_hasNoPrefix
		 *   Says if the name has no prefix.
		 *
		 * @return	{string}
		 *   The value.
		 */
		this.getRadioValue = function(is_name, ib_hasNoPrefix) {
			var le_radios	= this.$$('input[name="' + (ib_hasNoPrefix ? '' : this.prefix) + is_name + '"]');
			var rs_value	= '';
			
			for(var i = 0; i < le_radios.length; i++) {
				if(le_radios[i].checked) {
					rs_value = le_radios[i].value;
					break;
				}
			}
			
			return rs_value;
		};
		
		/**
		 * Creates a new element and adds it to a parent.
		 * 
		 * @instance
		 * 
		 * @param	{string}				is_type
		 *   The type of the new element.
		 * @param	{element}				ie_parent
		 *   The parent of the new element.
		 * @param	{object}				io_options
		 *   Options for the new element like id, class(es), style, type etc. Not defined options will not be set. (optional, if not set, no options will be set)<br>
		 *   Signature:<br>
		 *   <code>{<br>
		 *   	'id': string,<br>
		 *   	'class': string,<br>
		 *   	'classes': string[],<br>
		 *   	'style': string[][], => [['style1Name', 'style1'], ['style2Name', 'style2']]<br>
		 *   	'click': function,<br>
		 *   	others: string<br>
		 *   }</code>
		 * @param	{boolean || boolean[]}	im_hasPrefix
		 *   If no prefix should be used. (optional, if not set, a prefix will be used for id and no prefix will be used for classes)<br>
		 *   Signature: boolean || { 'id': boolean, 'class': boolean, 'classes': boolean }
		 * @param	{element}				ie_nextSibling
		 *   The next sibling of the element. (optional, if not set, the element will be added at the end)
		 *
		 * @return	{element}
		 *   The new element.
		 */
		this.addElement = function(is_type, ie_parent, io_options, im_hasPrefix, ie_nextSibling) {
			var re_newElement = document.createElement(is_type);
			
			if(!!io_options === true) {
				this.forEach(io_options, function(is_key, im_property) {
					var ls_prefix = '';
					
					if('id' === is_key && !(im_hasPrefix === false || (im_hasPrefix && im_hasPrefix.id === false))) {
						ls_prefix = go_self.myGM.prefix;
					}
					
					if('class' === is_key) {
						if(im_hasPrefix === true || (im_hasPrefix && im_hasPrefix.classes === true))
							ls_prefix = go_self.myGM.prefix;
						
						if(im_property !== '')
							re_newElement.classList.add(ls_prefix + im_property);
						
						return;
					}
					
					if('classes' === is_key) {
						if(im_hasPrefix === true || (im_hasPrefix && im_hasPrefix.classes === true))
							ls_prefix = go_self.myGM.prefix;
						
						for(var i = 0; i < im_property.length; i++) {
							if(im_property[i] != '')
								re_newElement.classList.add(ls_prefix + im_property[i]);
						}
						
						return;
					}
					
					if('style' === is_key) {
						for(var i = 0; i < im_property.length; i++) {
							re_newElement.style[im_property[i][0]] = im_property[i][1];
						}
						
						return;
					}
					
					if('click' === is_key || 'focus' === is_key) {
						re_newElement.addEventListener(is_key, im_property, false);
						
						return;
					}
					
					if('innerHTML' === is_key) {
						re_newElement[is_key] = im_property;
						
						return;
					}
					
					re_newElement.setAttribute(is_key, ls_prefix + im_property);
				});
			}
	
			ie_parent.insertBefore(re_newElement, ie_nextSibling);
	
			return re_newElement;
		};
		
		/**
		 * Removes an element from its parent.
		 * 
		 * @instance
		 * 
		 * @param	{element || element[]}	im_toRemove
		 *   The element to remove.
		 */
		this.removeElement = function(im_toRemove) {
			if(!!im_toRemove === false)
				return;
			
			var la_toRemove = im_toRemove;
			
			if(Array.isArray(im_toRemove) === false)
				la_toRemove = [im_toRemove];
			
			for(var i = 0; i < la_toRemove.length; i++) {
				la_toRemove[i].parentNode.removeChild(la_toRemove[i]);
			}
		};
		
		/**
		 * Creates new checkboxes and adds it to a parent.
		 * 
		 * @instance
		 * 
		 * @param	{element}	ie_parent
		 *   The parent of the new checkboxes.
		 * @param	{mixed[]}	ia_cbData
		 *   An array containing the data (id, label, checked) of each checkbox.
		 */
		this.addCheckboxes = function(ie_parent, ia_cbData) {
			for(var i = 0; i < ia_cbData.length; i++) {
				var le_wrapper = this.addElement('div', ie_parent, { 'class': 'cbWrapper' });
				var la_options = {
					'id':		ia_cbData[i]['id'] + 'Cb',
					'class':	'checkbox',
					'type':		'checkbox',
					'title':	ia_cbData[i]['label']
				};
				
				if(!!ia_cbData[i]['checked'] === true)
					la_options['checked'] = 'checked';
				
				this.addElement('input', le_wrapper, la_options);
			}
		};
		
		/**
		 * Creates a new radio button group and adds it to a parent table.
		 * 
		 * @instance
		 * 
		 * @param	{element}	ie_parentTable
		 *   The parent table of the new select field.
		 * @param	{string}	is_name
		 *   The last part of the name of the radio button group.
		 * @param	{mixed}		im_checked
		 *   The value of the selected option.
		 * @param	{mixed[]}	ia_options
		 *   An array with the names an values of the options.<br>
		 *   Signature: <code>[{ value: 'val', label: 'label' }]</code>
		 * @param	{string}	is_labelText
		 *   The text of the select label.
		 */
		this.addRadios = function(ie_parentTable, is_name, im_checked, ia_options, is_labelText) {
			var le_row			= this.addElement('tr', ie_parentTable);
			var le_labelCell	= this.addElement('td', le_row, { 'class': 'vertical_top' });
			var le_radioCell	= this.addElement('td', le_row, { 'class': 'left' });
			
			this.addElement('span', le_labelCell, { 'innerHTML': is_labelText });
			
			for(var i = 0; i < ia_options.length; i++) {
				var le_wrapper = this.addElement('div', le_radioCell, { 'class': 'radioWrapper' });
				this.addElement('input', le_wrapper, {
					'class':	'checkbox',
					'type':		'radio',
					'name':		this.prefix + is_name,
					'value':	ia_options[i].value,
					'title':	ia_options[i].label,
					'checked':	ia_options[i].value == im_checked ? 'checked' : ''
				});
			}
		};
		
		/**
		 * Creates a new select field and adds it to a parent table.
		 * 
		 * @instance
		 * 
		 * @param	{element}	ie_parentTable
		 *   The parent table of the new select field.
		 * @param	{string}	is_id
		 *   The last part of the id of the select field.
		 * @param	{mixed}		im_selected
		 *   The value of the selected option.
		 * @param	{mixed[]}	ia_options
		 *   An array with the names an values of the options.<br>
		 *   Signature: <code>[{ value: 'val', name: 'name' }]</code>
		 * @param	{string}	is_labelText
		 *   The text of the select label.
		 */
		this.addSelect = function(ie_parentTable, is_id, im_selected, ia_options, is_labelText) {
			var le_row			= this.addElement('tr', ie_parentTable);
			var le_labelCell	= this.addElement('td', le_row);
			var le_selectCell	= this.addElement('td', le_row, { 'class': 'left' });
			
			this.addElement('span', le_labelCell, { 'innerHTML': is_labelText });
			
			var le_wrapper = this.addElement('div', le_selectCell, {
				'id':		is_id + 'SelectContainer',
				'classes':	['select_container', 'size175'],
				'style':	[['position', 'relative']]
			});
			var le_select = this.addElement('select', le_wrapper, { 'id': is_id + 'Select', 'class': 'dropdown' });
			
			for(var i = 0; i < ia_options.length; i++) {
				var le_option = this.addElement('option', le_select, { 'value': ia_options[i].value, 'innerHTML': ia_options[i].name });
				
				if(le_option.value == im_selected) {
					le_option.selected = 'selected';
				}
			}
		};
	
		/**
		 * Creates a button and adds it to a parent.
		 * 
		 * @instance
		 * 
		 * @param	{element}	ie_parent
		 *   The parent element.
		 * @param	{string}	is_value
		 *   The value of the button.
		 * @param	{function}	if_callback
		 *   A callback which should be called when the user clicks on the button.<br>
		 *   Signature: <code>function() : void</code>
		 * @param	{boolean}	ib_parentIsWrapper
		 *   If the element provided as parent is also the button wrapper. (optional, default: false)
		 */
		this.addButton = function(ie_parent, is_value, if_callback, ib_parentIsWrapper) {
			var le_buttonWrapper = ie_parent;
			
			if(ib_parentIsWrapper !== true)
				le_buttonWrapper = this.addElement('div', ie_parent, { 'class': 'centerButton' });

			var re_button = this.addElement('input', le_buttonWrapper, {
				'class':	'button',
				'type':		'button',
				'value':	is_value,
				'click':	if_callback
			});
			
			return re_button;
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
		 * @param	{string[]}		im_text
		 *   The notification texts.
		 * @param	{function[]}	im_callback
		 *   The callbacks for confirm and abort. (optional, default: close panel)<br>
		 *   Signature with input: <code>function(textarea : element) : void</code>
		 *   Signature without input:  <code>function() : void</code>
		 * @param	{mixed[]}		io_options
		 *   Options for the body. (optional)<br>
		 *   All options are optional. 'readonly' and 'autofocus' are only used if 'textarea' = true.<br>
		 *   Signature:<br>
		 *   <code>{<br>
		 *   	'textarea': boolean, // if the body should be a textarea, dafult: false<br>
		 *   	'readonly': boolean, // textarea is readonly, default: false<br>
		 *   	'autofocus': boolean // textarea content is autoselected on first click, default: false<br>
		 *   }</code>
		 * 
		 * @return	{int}
		 *   The notification id.
		 */
		this.notification = function(im_text, im_callback, io_options) {
			_gi_notificationId++;
			var lo_options = io_options || {};
			
			// Set a local notification id to be able to have more than 1 notification panels.
			var ri_notificationId = _gi_notificationId;
			
			// Function to close the notification panel.
			var lf_closePanel = function() {
				go_self.myGM.removeElement([
					go_self.myGM.$('#' + go_self.myGM.prefix + 'notificationBackground' + ri_notificationId),
					go_self.myGM.$('#' + go_self.myGM.prefix + 'notificationPanelContainer' + ri_notificationId)
				]);
			};
			
			// Create the background and the container.
			this.addElement('div', document.body, { 'id': 'notificationBackground' + ri_notificationId, 'class': 'notificationBackground' }, true);
			var le_panelContainer	= this.addElement('div', document.body, { 'id': 'notificationPanelContainer' + ri_notificationId, 'class': 'notificationPanelContainer' }, true);
			var le_panel			= this.addElement('div', le_panelContainer, { 'id': 'notificationPanel' + ri_notificationId, 'class': 'notificationPanel' }, true);
	
			// Create the notification panel header.
			var ls_headerText = im_text.header ? im_text.header : go_self.Language.$('default.notification.header');
			_createNotificationPanelHeader(ri_notificationId, le_panel, ls_headerText, lf_closePanel);
			
			// Create the notification panel body.
			var lo_bodyTexts = {
				body:	im_text.body,
				top:	im_text.bodyTop ? im_text.bodyTop : '',
				bottom:	im_text.bodyBottom ? im_text.bodyBottom : ''
			};
			var le_body = _createNotificationPanelBody(ri_notificationId, le_panel, lo_options, lo_bodyTexts);
			
			// Create the notification panel footer.
			_createNotificationPanelFooter(ri_notificationId, le_panel);
			
			// Create the buttons.
			var lo_buttonTexts = {
				confirm:	im_text.confirm ? im_text.confirm : go_self.Language.$('default.notification.button.confirm'),
				abort:		im_text.abort ? im_text.abort : go_self.Language.$('default.notification.button.abort')
			}
			var lo_buttonCallbacks = {
				close:		lf_closePanel,
				confirm:	im_callback && im_callback.confirm ? im_callback.confirm : null,
				abort:		im_callback && im_callback.abort ? im_callback.abort : null
			}
			_createNotificationPanelButtons(ri_notificationId, le_panel, le_body, lo_buttonTexts, lo_buttonCallbacks);
			
			return ri_notificationId;
		};
		
		/**
		 * Toogle the show / hide Button image and title.
		 * 
		 * @instance
		 * 
		 * @param  {element}	ie_button
		 *   The button to toggle.
		 */
		this.toggleShowHideButton = function(ie_button) {
			ie_button.classList.toggle('minimizeImg');
			ie_button.classList.toggle('maximizeImg');
			
			ie_button.title = (ie_button.title == go_self.Language.$('general.fold')) ? go_self.Language.$('general.expand') : go_self.Language.$('general.fold');
		};
		
		/**
		 * Runs a callback on every property of an object which is not in the prototype.
		 * 
		 * @instance
		 * 
		 * @param	{object}	io_object
		 *   The Object where forEach should be used.
		 * @param	{function}	if_callback
		 *   The callback which should be called.<br>
		 *   Signature: <code>function(propertyKey : string, propertyValue : mixed) : void</code>
		 */
		this.forEach = function(io_object, if_callback) {
			for(var ls_key in io_object) {
				if(Object.prototype.hasOwnProperty.call(io_object, ls_key)) {
					if_callback(ls_key, io_object[ls_key]);
				}
			}
		};
		
		/**
		 * Merges objects.
		 * 
		 * @instance
		 * 
		 * @param	{object}	arguments
		 *   All objects to merge into each other.
		 * 
		 * @return	{object}
		 *   The merged object.
		 */
		this.merge = function() {
			var ro_merged = {};
			
			for(var i = 0; i < arguments.length; i++) {
				go_self.myGM.forEach(arguments[i], function(is_key, im_value) {
					if(typeof ro_merged[is_key] === 'object' && typeof im_value === 'object')
						go_self.myGM.merge(ro_merged[is_key], im_value);
					else
						ro_merged[is_key] = im_value;
				});
			}
			
			return ro_merged;
		}
		
		/*--------------------*
		 * Set some settings. *
		 *--------------------*/
		
		// Set the notification style.
		this.addStyle(
				"." + this.prefix + "notificationBackground					{ z-index: 1000000000000; position: fixed; visibility: visible; top: 0px; left: 0px; width: 100%; height: 100%; padding: 0; background-color: #000; opacity: .7; } \
				 ." + this.prefix + "notificationPanelContainer				{ z-index: 1000000000001; position: fixed; visibility: visible; top: 100px; left: 50%; width: 500px; height: 370px; margin-left: -250px; padding: 0; text-align: left; color: #542C0F; font: 12px Arial,Helvetica,sans-serif; } \
				 ." + this.prefix + "notificationPanel						{ position: relative; top: 0px; left: 0px; background-color: transparent; border: 0 none; overflow: hidden; } \
				 ." + this.prefix + "notificationPanelHeader				{ height: 39px; background: none repeat scroll 0 0 transparent; font-weight: bold; line-height: 2; white-space: nowrap; } \
				 ." + this.prefix + "notificationPanelHeaderL				{ height: 39px; background-image: url('skin/layout/notes_top_left.png'); background-position: left top; background-repeat: no-repeat; } \
				 ." + this.prefix + "notificationPanelHeaderR				{ height: 39px; background-image: url('skin/layout/notes_top_right.png'); background-position: right top; background-repeat: no-repeat; } \
				 ." + this.prefix + "notificationPanelHeaderM				{ height: 39px; margin: 0 14px 0 38px; padding: 12px 0 0; background-image: url('skin/layout/notes_top.png'); background-position: left top; background-repeat: repeat-x; color: #811709; line-height: 1.34em; } \
				 ." + this.prefix + "notificationPanelBody					{ max-height: 311px; height: 100%; background: none repeat scroll 0 0 transparent; } \
				 ." + this.prefix + "notificationPanelBodyL					{ height: 100%; background-image: url('skin/layout/notes_left.png'); background-position: left top; background-repeat: repeat-y; } \
				 ." + this.prefix + "notificationPanelBodyR					{ height: 100%; background-image: url('skin/layout/notes_right.png'); background-position: right top; background-repeat: repeat-y; } \
				 ." + this.prefix + "notificationPanelBodyM					{ height: 100%; background-color: #F7E7C5; background-image: none;  margin: 0 6px; padding: 0 10px; font-size: 14px; } \
				 ." + this.prefix + "notificationPanelBodyMTop				{ max-height: 100px; line-height: 2; } \
				 ." + this.prefix + "notificationPanelBodyMTop b			{ line-height: 3.5; font-size:110%; } \
				 ." + this.prefix + "notificationPanelBodyM a				{ color: #811709; font-weight: bold; } \
				 ." + this.prefix + "notificationPanelBodyM h2				{ font-weight: bold; } \
				 ." + this.prefix + "notificationPanelBodyMContent			{ max-height: 270px; padding: 10px; background: url('skin/input/textfield.png') repeat-x scroll 0 0 #FFF7E1; border: 1px dotted #C0C0C0; font: 14px Arial,Helvetica,sans-serif; color: #000000; border-collapse: separate; overflow-y:auto; } \
				 ." + this.prefix + "notificationPanelBodyMBottom			{ max-height: 170px; padding: 10px; background: url('skin/input/textfield.png') repeat-x scroll 0 0 #FFF7E1; border: 1px dotted #C0C0C0; font: 14px Arial,Helvetica,sans-serif; color: #000000; border-collapse: separate; overflow-y:auto; } \
				 textarea." + this.prefix + "notificationPanelBodyMContent	{ height: 270px; width: 445px; resize: none; } \
				 textarea." + this.prefix + "notificationPanelBodyMBottom	{ height: 170px; width: 445px; resize: none; } \
				 ." + this.prefix + "notificationPanelBodyPlaceholder		{ height: 20px; } \
				 ." + this.prefix + "notificationPanelFooter				{ height: 20px; background: none repeat scroll 0 0 transparent; } \
				 ." + this.prefix + "notificationPanelFooterL				{ height: 100%; background-image: url('skin/layout/notes_left.png'); background-position: left top; background-repeat: repeat-y; border: 0 none; } \
				 ." + this.prefix + "notificationPanelFooterR				{ height: 21px; background-image: url('skin/layout/notes_br.png'); background-position: right bottom; background-repeat: no-repeat; } \
				 ." + this.prefix + "notificationPanelFooterM				{ background-color: #F7E7C5; border-bottom: 3px solid #D2A860; border-left: 2px solid #D2A860; margin: 0 23px 0 3px; padding: 3px 0 2px 3px; font-size: 77%; } \
				 ." + this.prefix + "notificationPanelClose					{ cursor: pointer; position: absolute; top: 12px; right: 8px; width: 17px; height: 17px; background-image: url('skin/layout/notes_close.png'); } \
				 ." + this.prefix + "notificationPanelButtonWrapper			{ bottom: -4px; position: absolute; margin: 10px auto; width: 100%; text-align: center; } \
				 ." + this.prefix + "notificationPanelButton				{ background: url('skin/input/button.png') repeat-x scroll 0 0 #ECCF8E; border-color: #C9A584 #5D4C2F #5D4C2F #C9A584; border-style: double; border-width: 3px; cursor: pointer; display: inline; font-weight: bold; margin: 0px 5px; padding: 2px 10px; text-align: center; font-size: 12px; width: 100px; } \
				 ." + this.prefix + "notificationPanelButton:hover			{ color: #B3713F; } \
				 ." + this.prefix + "notificationPanelButton:active			{ border-color: #5D4C2F #C9A584 #C9A584 #5D4C2F; border-style: double; border-width: 3px; padding: 3px 10px 1px; } \
				 ." + this.prefix + "notificationPanelButtonConfirm			{  } \
				 ." + this.prefix + "notificationPanelButtonAbort			{  }",
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
			
		this.addStyle(
				"#container .tabmenu .tab													{ width: unset; } \
				 #container .tabmenu .tab.tabPrevPage, #container .tabmenu .tab.tabNextPage	{ width: 40px; }",
				'fixTabScroll', true
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
	this.myGM = new myGM();