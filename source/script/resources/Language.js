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
		var _gs_ikaCode = (function() {
			var uri = top.location.host.match(/^s[0-9]+-([a-zA-Z]+)\.ikariam\.gameforge\.com$/)[1];
			return !!uri === true ? uri : 'en';
		})();
		
		/**
		 * Default language code - code of language registered as default.
		 * 
		 * @private
		 * @inner
		 * 
		 * @default	en
		 * 
		 * @type	string
		 */
		var _gs_defaultCode = 'en';
		
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
		var _gs_usedCode = _gs_defaultCode;
		
		/**
		 * Used language texts.
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	json
		 */
		var _go_usedText = {};
		
		/**
		 * Default language text. To be used if the used language is not available.
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	json
		 */
		var _go_defaultText = {};
		
		/**
		 * All languages which are registered with their storage type (resource, in-script-object).
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	string[]
		 */
		var _go_registeredLangs = {};
		
		/**
		 * "Translation" of all possible language codes to the corresponding language.
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	string[]
		 */
		var _go_codeTranslation = {
			ae: 'Arabic',		ar: 'Spanish',		ba: 'Bosnian',		bg: 'Bulgarian',	br: 'Portuguese',	by: 'Russian',
			cl: 'Spanish',		cn: 'Chinese',		co: 'Spanish',		cz: 'Czech',		de: 'German',		dk: 'Danish',
			ee: 'Estonian',		en: 'English',		es: 'Spanish',		fi: 'Finish',		fr: 'French',		gr: 'Greek',
			hk: 'Chinese',		hr: 'Bosnian',		hu: 'Hungarian',	id: 'Indonesian',	il: 'Hebrew',		it: 'Italian',
			kr: 'Korean',		lt: 'Lithuanian',	lv: 'Latvian',		mx: 'Spanish',		nl: 'Dutch',		no: 'Norwegian',
			pe: 'Spanish',		ph: 'Filipino',		pk: 'Urdu',			pl: 'Polish',		pt: 'Portuguese',	ro: 'Romanian',
			rs: 'Serbian',		ru: 'Russian',		se: 'Swedish',		si: 'Slovene',		sk: 'Slovak',		tr: 'Turkish',
			tw: 'Chinese',		ua: 'Ukranian',		us: 'English',		ve: 'Spanish',		vn: 'Vietnamese',	yu: 'Bosnian'
		};
		
		/**
		 * Set the default language text for the script.
		 * 
		 * @private
		 * @inner
		 */
		var _setDefaultText = function() {
			var lo_merged = _mergeTexts(_gs_defaultCode);
			
			if(lo_merged.is_empty === true || lo_merged.not_set === true)
				_go_defaultText = {};
			else
				_go_defaultText = lo_merged;
		}
		
		/**
		 * Set the choosen language text for the script.
		 * 
		 * @private
		 * @inner
		 * 
		 * @param	{string}	is_languageCode
		 *   The code of the last selected language.
		 */
		var _setText = function(is_languageCode) {
			if(is_languageCode === _gs_defaultCode)
				_setDefaultText();
			
			if(!!_go_registeredLangs[_gs_ikaCode] === true)
				_gs_usedCode = _gs_ikaCode;
			
			if(is_languageCode === _gs_usedCode) {
				var lo_merged = _mergeTexts(is_languageCode);
				
				if(lo_merged.is_empty === true || lo_merged.not_set === true)
					_go_usedText = _go_defaultText;
				else
					_go_usedText = lo_merged;
			}
		};
		
		/**
		 * Merges the texts for a given language.
		 * 
		 * @private
		 * @inner
		 * 
		 * @param	{string}	is_languageCode
		 *   The code of the language to merge.
		 *   
		 * @return	{object}
		 *   The merged texts.
		 */
		var _mergeTexts = function(is_languageCode) {
			var ro_merged = {};
			
			if(!!_go_registeredLangs[is_languageCode] === true) {
				var lb_initial = true;
				
				_go_registeredLangs[is_languageCode].forEach(function(io_element) {
					if(io_element.type === 'resource') {
						var lo_resource = go_self.myGM.getResourceParsed(io_element.resource.name, io_element.resource.url);
						
						if(!lo_resource.is_error === true) {
							ro_merged = go_self.myGM.merge(ro_merged, lo_resource);
							lb_initial = false;
						}
					} else if(io_element.type === 'json') {
						ro_merged = go_self.myGM.merge(ro_merged, io_element.json);
						lb_initial = false;
					}
				});
				
				if(lb_initial === true)
					ro_merged = { is_empty: true };
			} else {
				ro_merged = { not_set: true };
			}
			
			return ro_merged;
		}
		
		/*-------------------------------------------*
		 * Public variables, functions and settings. *
		 *-------------------------------------------*/
		
		/**
		 * Return the code of the used language.
		 * 
		 * @instance
		 * 
		 * @return	{string}
		 *   The language code.
		 */
		this.__defineGetter__('usedLanguageCode', function() {
			return _gs_usedCode;
		});
		
		/**
		 * Return the name of the used language.
		 * 
		 * @instance
		 * 
		 * @return	{string}
		 *   The language name.
		 */
		this.__defineGetter__('usedLanguageName', function() {
			return _go_codeTranslation[_gs_usedCode];
		});
		
		/**
		 * Set the default language.
		 * 
		 * @instance
		 * 
		 * @param	{string}	is_languageCode
		 * 	 The code of the default language.
		 */
		this.setDefaultLanguage = function(is_languageCode) {
			_gs_defaultCode = is_languageCode;
			
			_setDefaultText();
		};
		
		/**
		 * Registers a new language without resource usage.
		 * 
		 * @instance
		 * 
		 * @param	{string}	is_languageCode
		 *   The code of the language.
		 * @param	{json}		io_json
		 *   JSON with the language data.
		 */
		this.addLanguageText = function(is_languageCode, io_json) {
			if(!_go_registeredLangs[is_languageCode] === true)
				_go_registeredLangs[is_languageCode] = [];
			
			_go_registeredLangs[is_languageCode].push({
				type:	'json',
				json:	io_json
			});
			
			_setText(is_languageCode);
		};
		
		/**
		 * Registers a new language resource.
		 * 
		 * @instance
		 * 
		 * @param	{string}	is_languageCode
		 *   Code of the language.
		 * @param	{string}	is_resourceName
		 *   Name of the resource.
		 * @param	{string}	is_resourceURL
		 *   URL, if resources are not supported.
		 */
		this.registerLanguageResource = function(is_languageCode, is_resourceName, is_resourceURL) {
			if(!_go_registeredLangs[is_languageCode] === true)
				_go_registeredLangs[is_languageCode] = [];
			
			_go_registeredLangs[is_languageCode].push({
				type:		'resource',
				resource:	{ name: is_resourceName, url: is_resourceURL }
			});
			
			_setText(is_languageCode);
		};
		
		/**
		 * Return a string which is defined by its placeholder. If the string contains variables defined with %$nr,
		 * they are replaced with the content of the array at this index.
		 * 
		 * @instance
		 * 
		 * @param	{string}			is_name
		 *   The name of the placeholder.
		 * @param	{mixed || mixed[]}	im_variables
		 *   An array containing variables for replacing in the language string. (optional)
		 * @param	{boolean}			ib_useDefault
		 *   If the default language should be used instead of the selected. (optional, internal)
		 *
		 * @return	{string}
		 *   The text.
		 */
		this.getText = function(is_name, im_variables, /* internal */ ib_useDefault) {
			// Set the text to the placeholder.
			var rs_text = is_name;
	
			// Split the placeholder.
			var la_parts = is_name.split('.');
	
			if(!!la_parts === true) {
				// Set ls_text to the "next level".
				var ls_text = _go_usedText ? _go_usedText[la_parts[0]] : null;
				
				if(ib_useDefault === true) {
					var ls_text = _go_defaultText ? _go_defaultText[la_parts[0]] : null;
				}
	
				// Loop over all parts.
				for(var i = 1; i < la_parts.length; i++) {
					// If the "next level" exists, set txt to it.
					if(ls_text && typeof ls_text[la_parts[i]] != 'undefined') {
						ls_text = ls_text[la_parts[i]];
					} else {
						ls_text = rs_text;
						break;
					}
				}
	
				// If the text type is not an object, a function or undefined.
				if(typeof ls_text != 'object' && typeof ls_text != 'function' && typeof ls_text != 'undefined') {
					rs_text = ls_text + '';
				}
				
				if(!!im_variables === true) {
					var la_variables = im_variables;
					if(Array.isArray(im_variables === false))
						la_variables = [im_variables];
						
					for(var i = 0; i < la_variables.length; i++) {
						var lr_regex = new RegExp('%\\$' + (i + 1), 'g');
						rs_text = rs_text.replace(lr_regex, la_variables[i] + '');
					}
				}
			}
			
			if(ib_useDefault === true) {
				return rs_text;
			}
			
			if(rs_text == is_name) {
				go_self.con.info('Language.getText: No translation available for "' + is_name + '" in language ' + this.usedLanguageCode);
				rs_text = this.getText(is_name, im_variables, true);
			}
			
			return rs_text;
		};
		
		/**
		 * Synonymous function for {@link IkariamCore~Language#getText}.<br>
		 * Return a string which is defined by its placeholder. If the string contains variables defined with %$nr,
		 * they are replaced with the content of the array at this index.
		 * 
		 * @instance
		 * 
		 * @param	{string}			is_name
		 *   The name of the placeholder.
		 * @param	{mixed || mixed[]}	im_variables
		 *   An array containing variables for replacing in the language string. (optional)
		 *
		 * @return	{string}
		 *   The text.
		 */
		this.$ = function(is_name, im_variables) {
			return this.getText(is_name, im_variables);
		};
		
		/*----------------------------------------------*
		 * Register the language resources for the core *
		 *----------------------------------------------*/
		
		this.addLanguageText('en', @SCRIPT_LANGUAGE_DEFAULT@);
		this.addLanguageText('en', @SCRIPT_SETTINGS_DEFAULT@);
		
		var la_language = ['de', 'ru', 'lv'];
		for(var i = 0; i < la_language.length; i++) {
			this.registerLanguageResource(la_language[i], la_language[i], '@RESOURCE_LANGUAGE_URL@/' + la_language[i] + '.json');
			this.registerLanguageResource(la_language[i], la_language[i] + '_settings', '@RESOURCE_LANGUAGE_URL@/' + la_language[i] + '_settings.json');
		}
	}
	
	/**
	 * Functions for localisation of the script.
	 * 
	 * @instance
	 * 
	 * @type	IkariamCore~Language
	 */
	this.Language = new Language();