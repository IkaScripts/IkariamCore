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
		 * @type	Array.<boolean>
		 */
		var _go_optionWrapperVisibility = {};
		
		/**
		 * Storage for option wrappers.
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	Object
		 */
		var _go_wrapper = {};
		
		/**
		 * Storage for option wrapper order. (Order in which the wrappers are shown)
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	Array.<String>
		 */
		var _ga_wrapperOrder = new Array();
		
		/**
		 * Storage for the saved options. Gets filled on startup.
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	Object
		 */
		var _go_savedOptions = go_self.myGM.getValue('optionPanel_options', {});
		
		/**
		 * Storage for the options.
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	Object
		 */
		var _go_options = {};
		
		/**
		 * Storage for the id of the next <code>&lt;hr&gt;</code> element to create.
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	int
		 */
		var _gi_lineId = 0;
		
		/**
		 * Add a element to a wrapper. ("generic function")
		 * 
		 * @private
		 * @inner
		 * 
		 * @param	{String}		is_type
		 *   The type of the element. Used for replacement - only elements with same type can be replaced.
		 * @param	{String}		is_id
		 *   The id of the element.
		 * @param	{String}		is_wrapperId
		 *   The id of the wrapper for the element.
		 * @param	{(String|int)}	im_table
		 *   The id of the table in the wrapper where the element should be added.
		 * @param	{IkariamCore~Options~CreateCallback}	if_create
		 *   Callback to create the element.
		 * @param	{IkariamCore~Options~AddElementOptions}	io_options
		 *   Options for the element.
		 */
		var _addElement = function(is_type, is_id, is_wrapperId, im_table, if_create, io_options) {
			if(_go_wrapper[is_wrapperId]) {
				if(_go_wrapper[is_wrapperId].elements[is_id] && io_options.replace !== true) {
					go_self.con.warn('Options.addElement: Element with id "' + is_id + '" already defined. Wrapper id: ' + is_wrapperId);
				} else if(io_options.replace === true && _go_wrapper[is_wrapperId].elements[is_id] && _go_wrapper[is_wrapperId].elements[is_id].type === is_type) {
					go_self.con.warn('Options.addElement: Element with id "' + is_id + '" not replaced. ' +
							'Different type (old: ' + _go_wrapper[is_wrapperId].elements[is_id].type + ', new: ' + is_type + '). Wrapper id: ' + is_wrapperId);
				} else {
					var lo_options = io_options;
					
					if(lo_options.replace === true && !_go_wrapper[is_wrapperId].elements[is_id]) {
						delete lo_options.replace;
						go_self.con.info('Options.addElement: Element with id "' + is_id + '" not existant. Element was created instead of replaced. Wrapper id: ' + is_wrapperId);
					}
					
					var lo_newElement = { table: im_table + '', create: if_create, serverSpecific: !!lo_options.serverSpecific };
					if(lo_options.replace === true)
						lo_newElement.serverSpecific = _go_wrapper[is_wrapperId].elements[is_id].serverSpecific;
					
					var ls_serverCode = lo_newElement.serverSpecific === true ? go_self.Ikariam.serverCode : '';
					
					if(!!lo_options.createOptions === true)
						lo_newElement.options = lo_options.createOptions;
					
					if(lo_options.defaultValue !== undefined) {
						lo_newElement.defaultValue	= lo_options.defaultValue;
						
						if(_go_savedOptions[is_wrapperId] && (_go_savedOptions[is_wrapperId][is_id] || _go_savedOptions[is_wrapperId][is_id] === false)) {
							_go_options[is_wrapperId][is_id] = _go_savedOptions[is_wrapperId][is_id];
							
							if(ls_serverCode.length > 0 && !_go_options[is_wrapperId][is_id][ls_serverCode] && _go_options[is_wrapperId][is_id][ls_serverCode] !== false) {
								_go_options[is_wrapperId][is_id][ls_serverCode] = lo_options.defaultValue;
							}
						} else {
							if(ls_serverCode.length > 0) {
								_go_options[is_wrapperId][is_id] = {};
								_go_options[is_wrapperId][is_id][ls_serverCode] = lo_options.defaultValue;
							} else {
								_go_options[is_wrapperId][is_id] = lo_options.defaultValue;
							}
						}
					}
					
					if(!!lo_options.saveCallback === true)
						lo_newElement.save	= lo_options.saveCallback;
					
					if(!!lo_options.changeCallback === true) {
						lo_newElement.changeCallback = lo_options.changeCallback;
						
						// Run the callback also when registering.
						setTimeout(function() {
							var lm_value = _go_options[is_wrapperId][is_id];
							if(ls_serverCode.length > 0)
								lm_value = lm_value[ls_serverCode];
							lo_options.changeCallback(lm_value, lm_value);
						}, 0);
					}
					
					_go_wrapper[is_wrapperId].elements[is_id] = lo_newElement;
					
					if(lo_options.replace !== true) {
						_go_wrapper[is_wrapperId].elementOrder.IC.insert(is_id, lo_options.position);
					}
				}
			} else {
				go_self.con.warn('Options.addElement: Wrapper with id "' + is_wrapperId + '" not defined. Element id: ' + is_id);
			}
		};
		
		/**
		 * Save the content of <code>_go_options</code>.
		 * 
		 * @private
		 * @inner
		 * 
		 * @param	{boolean}	showNoSuccessHint
		 *   If the success hint should not be shown.
		 */
		var _saveOptions = function(ib_showNoSuccessHint) {
			_go_savedOptions = _go_options;
			
			go_self.myGM.setValue('optionPanel_options', _go_options);
			
			if(!ib_showNoSuccessHint === true) {
				go_self.Ikariam.showTooltip('cityAdvisor', 'confirm', go_self.Language.$('general.successful'));
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
			go_self.myGM.forEach(_go_wrapper, function(is_wrapperId, io_wrapper) {
				go_self.myGM.forEach(io_wrapper.elements, function(is_elementId, io_element) {
					if(io_element.save) {
						var ls_serverCode	= io_element.serverSpecific === true ? go_self.Ikariam.serverCode : '';
						var lm_oldValue		=  _go_options[is_wrapperId][is_elementId];
						var lm_newValue		= io_element.save(is_wrapperId + is_elementId);
						
						if(ls_serverCode.length > 0) {
							lm_oldValue												= lm_oldValue[ls_serverCode];
							_go_options[is_wrapperId][is_elementId][ls_serverCode]	= lm_newValue;
						} else {
							_go_options[is_wrapperId][is_elementId] = lm_newValue;
						}
						
						if(lm_newValue != lm_oldValue && io_element.changeCallback) {
							setTimeout(function() { io_element.changeCallback(lm_newValue, lm_oldValue); }, 0);
						}
					}
				});
			});
			
			_saveOptions();
		};
		
		/**
		 * Initializes the options tab for the script and adds the scroll function to the tab menu.
		 * 
		 * @private
		 * @inner
		 * 
		 * @return	{Element}
		 *   The options tab for the script.
		 */
		var _initializeOptionsTab = function() {
			var re_tabScriptOptions = go_self.myGM.$('#tab_options' + go_self.myGM.prefix);
			
			if(!re_tabScriptOptions) {
				go_self.myGM.addStyle(
						"#tab_options" + go_self.myGM.prefix + " hr								{ margin: 0; } \
						 #tab_options" + go_self.myGM.prefix + " .scriptTextArea				{ resize: none; width: calc(100% - 2px); height: 75px; } \
						 #tab_options" + go_self.myGM.prefix + " .scriptTextField				{ width: 173px;	} \
						 #tab_options" + go_self.myGM.prefix + " .cbWrapper						{ margin: 0 0 0 10px; } \
						 #tab_options" + go_self.myGM.prefix + " .radioWrapper:not(:last-child)	{ margin-bottom: 2px; }",
					'scriptOptionsTab', true);
				
				var le_tabmenu			= go_self.myGM.$('#tabMenu');
				var le_nextPageLink		= go_self.myGM.$('.tabNextPage', le_tabmenu);
				var la_pagerInformation	= le_nextPageLink.getAttribute('onclick').match(/switchPage\(([0-9]*), this, ([0-9]*)\)/);
				var li_pageNumber		= go_self.Ikariam.getInt(la_pagerInformation[1]);
				var li_offset			= go_self.Ikariam.getInt(la_pagerInformation[2]);
				var li_newIndex			= go_self.myGM.$$('.tab[index]', le_tabmenu).length + 1;
				var li_newPageNumber	= li_newIndex / li_offset;
				if(li_pageNumber < li_newPageNumber)
					le_nextPageLink.classList.remove('invisible');
				
				var la_tabClasses = ['tab'];
				if(li_pageNumber !== li_newPageNumber)
					la_tabClasses.push('invisible');
				
				go_self.myGM.addElement('li', le_tabmenu, {
					'id':			'js_tab_options' + go_self.myGM.prefix,
					'classes':		la_tabClasses,
					'index':		li_newIndex,
					'innerHTML':	'<b class="tab_options' + go_self.myGM.prefix + '">' + go_script.name + '</b>',
					'onclick':		"$('#js_tab_options" + go_self.myGM.prefix + "').removeClass('selected'); switchTab('tab_options" + go_self.myGM.prefix + "');"
				}, false, le_nextPageLink);
				
				re_tabScriptOptions	= go_self.myGM.addElement('div', go_self.myGM.$('#tabMenu').parentNode, {
					'id':		'tab_options' + go_self.myGM.prefix, 
					'style':	[['display', 'none']]
				}, false);
			}
			
			_go_optionWrapperVisibility = go_self.myGM.getValue('optionPanel_optionWrapperVisibility', _go_optionWrapperVisibility);
			
			return re_tabScriptOptions;
		};
		
		/**
		 * Add a wrapper for options elements to the script option tab.
		 * 
		 * @private
		 * @inner
		 * 
		 * @param	{Element}	ie_tab
		 *   The tab to add the wrapper to.
		 * @param	{String}	is_id
		 *   The id of the wrapper.
		 * @param	{String}	is_headerText
		 *   The text for the wrapper header.
		 * 
		 * @return	{Element}
		 *   The wrapper.
		 */
		var _createOptionsWrapper = function(ie_tab, is_id, is_headerText) {
			/*
			 * Function to toggle the visibility of an wrapper.
			 */
			var lf_toggle = function() {
				go_self.myGM.toggleShowHideButton(this);
				
				go_self.myGM.$('.content', this.parentNode.parentNode).classList.toggle('invisible');
				
				var ls_optionId = this.parentNode.parentNode.id.replace(go_self.myGM.prefix, '');
				_go_optionWrapperVisibility[ls_optionId] = !_go_optionWrapperVisibility[ls_optionId];
				go_self.myGM.setValue('optionPanel_optionWrapperVisibility', _go_optionWrapperVisibility);
	
				// Adjust the size of the Scrollbar.
				go_self.ika.controller.adjustSizes();
			};
			
			var lb_showContent		= !!_go_optionWrapperVisibility[is_id];
			var le_optionsWrapper	= go_self.myGM.addElement('div', ie_tab, {'id': is_id, 'class': 'contentBox01h' });
			var le_optionsHeader	= go_self.myGM.addElement('h3', le_optionsWrapper, { 'class': 'header', 'innerHTML': is_headerText });
			go_self.myGM.addElement('div', le_optionsHeader, {
				'class':	lb_showContent ? 'minimizeImg' : 'maximizeImg',
				'style':	[['cssFloat', 'left']],
				'title':	lb_showContent ? go_self.Language.$('general.fold') : go_self.Language.$('general.expand'),
				'click':	lf_toggle
			});
			
			var re_optionsWrapperContent = go_self.myGM.addElement('div', le_optionsWrapper, { 'classes': lb_showContent ? ['content'] : ['content', 'invisible'] });
			go_self.myGM.addElement('div', le_optionsWrapper, { 'class': 'footer' });
			
			return re_optionsWrapperContent;
		};
		
		/**
		 * Show the option script tab.
		 * 
		 * @private
		 * @inner
		 */
		var _showOptionPanel = function() {
			var le_tab = _initializeOptionsTab();
			
			for(var i = 0; i < _ga_wrapperOrder.length; i++) {
				var ls_wrapperId		= _ga_wrapperOrder[i];
				var lo_wrapperOptions	= _go_wrapper[ls_wrapperId];
				var le_wrapper 			= _createOptionsWrapper(le_tab, ls_wrapperId, lo_wrapperOptions.headerText);
				var lo_tables			= {};
				
				for(var j = 0; j < lo_wrapperOptions.elementOrder.length; j++) {
					var ls_elementId		= lo_wrapperOptions.elementOrder[j];
					var lo_elementOptions	= lo_wrapperOptions.elements[ls_elementId];
					
					if(!lo_tables[lo_elementOptions.table]) {
						var le_table						= go_self.myGM.addElement('table', le_wrapper, { 'classes': ['moduleContent', 'table01'] });
						lo_tables[lo_elementOptions.table]	= go_self.myGM.addElement('tbody', le_table);
					}
					
					var ls_serverCode	= lo_elementOptions.serverSpecific === true ? go_self.Ikariam.serverCode : '';
					var lo_options		= lo_elementOptions.options ? lo_elementOptions.options : null;
					var lm_value		= (_go_options[ls_wrapperId] && (_go_options[ls_wrapperId][ls_elementId] || _go_options[ls_wrapperId][ls_elementId] == false)) ? _go_options[ls_wrapperId][ls_elementId] : null;
					
					if(ls_serverCode.length > 0)
						lm_value = lm_value[ls_serverCode];
					
					lo_elementOptions.create(lo_tables[lo_elementOptions.table], ls_wrapperId + ls_elementId, lm_value, lo_options);
				}
				
				go_self.myGM.addButton(le_wrapper, go_self.Language.$('core.optionPanel.save'), function() { setTimeout(_savePanelOptions, 0); });
			}
		};
		
		/**
		 * Show the notification for exporting the options.
		 * 
		 * @private
		 * @inner
		 */
		var _exportOptionsShowNotification = function() {
			var ls_options = JSON.stringify(_go_options);
			
			var lo_notificationText = {
				header:		go_self.Language.$('core.optionPanel.section.optionPanelOptions.label.exportNotification.header'),
				bodyTop:	go_self.Language.$('core.optionPanel.section.optionPanelOptions.label.exportNotification.explanation'),
				bodyBottom:	ls_options
			};
			
			go_self.myGM.notification(lo_notificationText, null, { textarea: true, readonly: true, autoselect: true });
		};
		
		/**
		 * Callback for importing the options.
		 * 
		 * @private
		 * @inner
		 * 
		 * @param	{Element}	ie_textarea
		 *   The textarea with the options string to import.
		 */
		var _importOptionsCallback = function(ie_textarea) {
			var ls_options = ie_textarea.value;
			
			if(ls_options) {
				// Function for safer parsing.
				var lf_safeParse = function(is_key, im_value) {
					if(typeof im_value === 'function' || Object.prototype.toString.apply(im_value) === '[object function]') {
						return im_value.toString();
					}
	
					return im_value;
				};
				
				try {
					var lo_parsed = JSON.parse(ls_options, lf_safeParse);
					
					// Store the values in the script.
					go_self.myGM.forEach(lo_parsed, function(is_wrapperKey, io_elements) {
						go_self.myGM.forEach(io_elements, function(is_elementKey, im_setting) {
							if(_go_options[is_wrapperKey] && (_go_options[is_wrapperKey][is_elementKey] || _go_options[is_wrapperKey][is_elementKey] == false) && Array.isArray(im_setting) === false) {
								if(typeof im_setting !== 'object') {
									_go_options[is_wrapperKey][is_elementKey] = im_setting;
								} else if(_go_wrapper[is_wrapperKey].elements[is_elementKey].serverSpecific === true) {
									go_self.myGM.forEach(im_setting, function(is_serverKey, im_serverSetting) {
										if(Array.isArray(im_serverSetting) === false && typeof im_serverSetting !== 'object')
											_go_options[is_wrapperKey][is_elementKey] = im_setting;
									});
								}
							}
						});
					});
					
					_saveOptions();
				} catch(lo_error) {
					var lo_notificationText = {
						header:	go_self.Language.$('core.optionPanel.section.optionPanelOptions.label.importError.header'),
						body:	go_self.Language.$('core.optionPanel.section.optionPanelOptions.label.importError.explanation')
					};
					
					go_self.con.error(lo_error);
					go_self.myGM.notification(lo_notificationText);
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
			var lo_notificationText = {
				header:		go_self.Language.$('core.optionPanel.section.optionPanelOptions.label.importNotification.header'),
				bodyTop:	go_self.Language.$('core.optionPanel.section.optionPanelOptions.label.importNotification.explanation')
			};
	
			var lo_notificationCallback = {
				confirm:	_importOptionsCallback
			};
			
			go_self.myGM.notification(lo_notificationText, lo_notificationCallback, { textarea: true });
		};
		
		/**
		 * Callback for resetting the options.
		 * 
		 * @private
		 * @inner
		 */
		var _resetOptionsCallback = function() {
			_go_options = {};
			
			// Store the default values.
			go_self.myGM.forEach(_go_wrapper, function(is_wrapperKey, io_wrapper) {
				_go_options[is_wrapperKey] = {};
				
				go_self.myGM.forEach(io_wrapper.elements, function(is_elementKey, io_element) {
					if(io_element.defaultValue || io_element.defaultValue == false) {
						var ls_serverCode = io_element.serverSpecific === true ? go_self.Ikariam.serverCode : '';
						
						if(ls_serverCode.length > 0) {
							_go_options[is_wrapperKey][is_elementKey] = {};
							_go_options[is_wrapperKey][is_elementKey][ls_serverCode] = io_element.defaultValue;
						} else {
							_go_options[is_wrapperKey][is_elementKey] = io_element.defaultValue;
						}
					}
				});
			});
			
			_saveOptions();
		};
		
		/**
		 * Show the notification for resetting the options.
		 * 
		 * @private
		 * @inner
		 */
		var _resetOptionsShowNotification = function() {
			var lo_notificationText = {
				header:	go_self.Language.$('core.optionPanel.section.optionPanelOptions.label.resetNotification.header'),
				body:	go_self.Language.$('core.optionPanel.section.optionPanelOptions.label.resetNotification.explanation')
			};
	
			var lo_notificationCallback = {
				confirm:	_resetOptionsCallback,
				abort:		function() { return; }
			};
			
			go_self.myGM.notification(lo_notificationText, lo_notificationCallback);
		};
		
		/**
		 * Create the export options link.
		 * 
		 * @private
		 * @inner
		 * 
		 * @param	{Element}	ie_parent
		 *   Parent element for the link.
		 */
		var _exportOptions = function(ie_parent) {
			this.myGM.addElement('a', ie_parent, {
				'href':			'javascript:;',
				'innerHTML':	this.Language.$('core.optionPanel.section.optionPanelOptions.label.export'),
				'click':		_exportOptionsShowNotification
			});
		};
		
		/**
		 * Create the import options link.
		 * 
		 * @private
		 * @inner
		 * 
		 * @param	{Element}	ie_parent
		 *   Parent element for the link.
		 */
		var _importOptions = function(ie_parent) {
			this.myGM.addElement('a', ie_parent, {
				'href':			'javascript:;',
				'innerHTML':	this.Language.$('core.optionPanel.section.optionPanelOptions.label.import'),
				'click':		_importOptionsShowNotification
			});
		};
		
		/**
		 * Create the reset options link.
		 * 
		 * @private
		 * @inner
		 * 
		 * @param	{Element}	ie_parent
		 *   Parent element for the link.
		 */
		var _resetOptions = function(ie_parent) {
			this.myGM.addElement('a', ie_parent, {
				'href':			'javascript:;',
				'innerHTML':	this.Language.$('core.optionPanel.section.optionPanelOptions.label.reset'),
				'click':		_resetOptionsShowNotification
			});
		};
		
		/*-------------------------------------------*
		 * Public variables, functions and settings. *
		 *-------------------------------------------*/
		
		/**
		 * Add a wrapper to the list.
		 * 
		 * @instance
		 * 
		 * @param	{String}	is_id
		 *   The id of the wrapper.
		 * @param	{String}	is_headerText
		 *   The text for the wrapper header.
		 * @param	{int}		ii_position
		 *   The position of the wrapper on the options tab. (optional)
		 */
		this.addWrapper = function(is_id, is_headerText, ii_position) {
			if(_go_wrapper[is_id]) {
				go_self.con.warn('Options.addWrapper: Wrapper with id "' + is_id + '" defined two times.');
			} else {
				_go_wrapper[is_id]	= { headerText: is_headerText, elements: {}, elementOrder: new Array() };
				_go_options[is_id]	= {};
				_ga_wrapperOrder.IC.insert(is_id, ii_position);
			}
		};
		
		/**
		 * Add a new checkbox to the options tab.
		 * 
		 * @instance
		 * 
		 * @param	{String}		is_id
		 *   The id of the checkbox.
		 * @param	{String}		is_wrapperId
		 *   The id of the wrapper.
		 * @param	{(String|int)}	im_block
		 *   The block of the wrapper, the checkbox belongs to.
		 * @param	{boolean}		ib_defaultChecked
		 *   If the checkbox is checked by default.
		 * @param	{String}		im_label
		 *   The text for the label.
		 * @param	{IkariamCore~Options~DefaultElementOptions}	io_options
		 *   Options for the checkbox.
		 */
		this.addCheckbox = function(is_id, is_wrapperId, im_block, ib_defaultChecked, is_label, io_options) {
			/*
			 * Function to save the checkbox value.
			 */
			var lf_save = function(is_elementId) {
				return go_self.myGM.$('#' + go_self.myGM.prefix + is_elementId + 'Cb').checked;
			};
			
			/*
			 * Function to create the checkbox.
			 */
			var lf_create = function(ie_parentTable, is_elementId, ib_value, io_createOptions) {
				var le_row		= go_self.myGM.addElement('tr', ie_parentTable);
				var le_parent	= go_self.myGM.addElement('td', le_row, { 'colSpan': '2', 'class': 'left' });
				
				go_self.Ikariam.addCheckboxes(le_parent, [{ id: is_elementId, label: io_createOptions.label, checked: ib_value }]);
			};
			
			var lo_options = {
				createOptions:	{ label: is_label },
				defaultValue:	ib_defaultChecked,
				serverSpecific:	io_options.serverSpecific,
				saveCallback:	lf_save,
				changeCallback:	io_options.changeCallback,
				position:		io_options.position,
				replace:		io_options.replace
			};
			
			_addElement('checkbox', is_id, is_wrapperId, im_block, lf_create, lo_options);
		};
		
		/**
		 * Add a new set of radio buttons to the options tab.
		 * 
		 * @instance
		 * 
		 * @param	{String}		is_id
		 *   The id of the checkbox.
		 * @param	{String}		is_wrapperId
		 *   The id of the wrapper.
		 * @param	{(String|int)}	im_block
		 *   The block of the wrapper, the checkbox belongs to.
		 * @param	{(String|int)}	im_defaultChecked
		 *   The value selected by default.
		 * @param	{String}		is_label
		 *   The text for the label.<br>
		 * @param	{IkariamCore~myGM~ValueAndLabel}			im_radioValues
		 *   An array with the names an values of the options.
		 * @param	{IkariamCore~Options~DefaultElementOptions}	io_options
		 *   Options for the radio buttons.
		 */
		this.addRadios = function(is_id, is_wrapperId, im_block, im_defaultChecked, is_label, im_radioValues, io_options) {
			/*
			 * Function to save the radiobutton value.
			 */
			var lf_save = function(is_elementId) {
				return go_self.myGM.getRadioValue(is_elementId);
			};
			
			/*
			 * Function to create the radiobuttons.
			 */
			var lf_create = function(ie_parentTable, is_elementId, im_value, io_createOptions) {
				go_self.Ikariam.addRadios(ie_parentTable, is_elementId, im_value, io_createOptions.options, io_createOptions.label);
			};
			
			var lo_options = {
				createOptions:	{ label: is_label, options: im_radioValues },
				defaultValue:	im_defaultChecked,
				serverSpecific:	io_options.serverSpecific,
				saveCallback:	lf_save,
				changeCallback:	io_options.changeCallback,
				position:		io_options.position,
				replace:		io_options.replace
			};
			
			_addElement('radio', is_id, is_wrapperId, im_block, lf_create, lo_options);
		};
		
		
		/**
		 * Add a new select field to the options tab.
		 * 
		 * @instance
		 * 
		 * @param	{String}		is_id
		 *   The id of the select field.
		 * @param	{String}		is_wrapperId
		 *   The id of the wrapper.
		 * @param	{(String|int)}	im_block
		 *   The block of the wrapper, the select field belongs to.
		 * @param	{(String|int)}	im_defaultSelected
		 *   The value of the option selected by default.
		 * @param	{String}		is_label
		 *   The text for the label.
		 * @param	{IkariamCore~myGM~ValueAndLabel}			im_selectOptions
		 *   An array with the labels and values of the options.
		 * @param	{IkariamCore~Options~DefaultElementOptions}	io_options
		 *   Options for the select field.
		 */
		this.addSelect = function(is_id, is_wrapperId, im_block, im_defaultSelected, is_label, im_selectOptions, io_options) {
			/*
			 * Function to save the select value.
			 */
			var lf_save = function(is_elementId) {
				return go_self.myGM.getSelectValue(is_elementId);
			};
			
			/*
			 * Function to create the select.
			 */
			var lf_create = function(ie_parentTable, is_elementId, im_value, io_createOptions) {
				go_self.Ikariam.addSelect(ie_parentTable, is_elementId, im_value, io_createOptions.options, io_createOptions.label);
			};
			
			var lo_options = {
				createOptions:	{ label: is_label, options: im_selectOptions },
				defaultValue:	im_defaultSelected,
				serverSpecific:	io_options.serverSpecific,
				saveCallback:	lf_save,
				changeCallback:	io_options.changeCallback,
				position:		io_options.position,
				replace:		io_options.replace
			};
			
			_addElement('select', is_id, is_wrapperId, im_block, lf_create, lo_options);
		};
		
		
		/**
		 * Add a new textfield to the options tab.
		 * 
		 * @instance
		 * 
		 * @param	{String}		is_id
		 *   The id of the textfield.
		 * @param	{String}		is_wrapperId
		 *   The id of the wrapper.
		 * @param	{(String|int)}	im_block
		 *   The block of the wrapper, the textfield belongs to.
		 * @param	{String}		is_defaultValue
		 *   Default value of the textfield.
		 * @param	{String}		is_label
		 *   The text for the label.
		 * @param	{IkariamCore~Options~TextFieldOptions}		io_options
		 *   Options for the textfield.
		 */
		this.addTextField = function(is_id, is_wrapperId, im_block, is_defaultValue, is_label, io_options) {
			/*
			 * Function to save the textfield value.
			 */
			var lf_save = function(is_elementId) {
				return go_self.myGM.$('#' + go_self.myGM.prefix + is_elementId + 'TextField').value;
			};
			
			/*
			 * Function to create the textfield.
			 */
			var lf_create = function(ie_parentTable, is_elementId, is_value, io_createOptions) {
				var le_row				= go_self.myGM.addElement('tr', ie_parentTable);
				var le_labelCell		= go_self.myGM.addElement('td', le_row);
				var le_textFieldCell	= go_self.myGM.addElement('td', le_row, { 'class': 'left' });

				go_self.myGM.addElement('span', le_labelCell, { 'innerHTML': io_createOptions.label });
				
				var lo_options = {
					'id':		is_elementId + 'TextField',
					'classes':	['textfield', 'scriptTextField'],
					'type':		'text',
					'value':	is_value
				};
				
				if(!!io_createOptions.maxlength === true)
					lo_options['maxLength'] = io_createOptions.maxLength + '';
					
				if(!!io_createOptions.style === true)
					lo_options['style'] = io_createOptions.style;
				
				go_self.myGM.addElement('input', le_textFieldCell, lo_options);
			};
			
			var lo_options = {
				createOptions:	{ label: is_label, maxLength: io_options.maxLength, style: io_options.style },
				defaultValue:	is_defaultValue,
				serverSpecific:	io_options.serverSpecific,
				saveCallback:	lf_save,
				changeCallback:	io_options.changeCallback,
				position:		io_options.position,
				replace:		io_options.replace
			};
			
			_addElement('textfield', is_id, is_wrapperId, im_block, lf_create, lo_options);
		};
		
		
		/**
		 * Add a new textarea to the options tab.
		 * 
		 * @instance
		 * 
		 * @param	{String}		is_id
		 *   The id of the textarea.
		 * @param	{String}		is_wrapperId
		 *   The id of the wrapper.
		 * @param	{(String|int)}	im_block
		 *   The block of the wrapper, the textarea belongs to.
		 * @param	{String}		is_defaultValue
		 *   Default value of the textarea.
		 * @param	{String}		is_label
		 *   The text for the label.
		 * @param	{IkariamCore~Options~TextAreaOptions}	io_options
		 *   Options for the textarea.
		 */
		this.addTextArea = function(is_id, is_wrapperId, im_block, is_defaultValue, is_label, io_options) {
			/*
			 * Function to save the textarea value.
			 */
			var lf_save = function(ls_elementId) {
				return go_self.myGM.$('#' + go_self.myGM.prefix + ls_elementId + 'TextArea').value;
			};
			
			/*
			 * Function to create the textarea.
			 */
			var lf_create = function(ie_parentTable, is_elementId, is_value, io_createOptions) {
				var le_labelRow		= go_self.myGM.addElement('tr', ie_parentTable);
				var le_labelCell	= go_self.myGM.addElement('td', le_labelRow, { 'colSpan': '2', 'class': 'left' });
				go_self.myGM.addElement('p', le_labelCell, { 'innerHTML': io_createOptions.label });
				
				var le_textAreaRow		= go_self.myGM.addElement('tr', ie_parentTable);
				var le_textAreaCell		= go_self.myGM.addElement('td', le_textAreaRow, { 'colSpan': '2', 'class': 'left' });
				
				var lo_options = {
					'id':		is_elementId + 'TextArea',
					'classes':	['textfield', 'scriptTextArea'],
					'value':	is_value
				};
				
				if(!!io_createOptions.style === true)
					lo_options['style'] = io_createOptions.style;
				
				go_self.myGM.addElement('textarea', le_textAreaCell, lo_options);
			};
			
			var lo_options = {
				createOptions:	{ label: is_label, style: io_options.style },
				defaultValue:	is_defaultValue,
				serverSpecific:	io_options.serverSpecific,
				saveCallback:	lf_save,
				changeCallback:	io_options.changeCallback,
				position:		io_options.position,
				replace:		io_options.replace
			};
			
			_addElement('textarea', is_id, is_wrapperId, im_block, lf_create, lo_options);
		};
		
		
		/**
		 * Add HTML content to the options tab.
		 * 
		 * @instance
		 * 
		 * @param	{String}		is_id
		 *   The id of the HTML content.
		 * @param	{String}		is_wrapperId
		 *   The id of the wrapper.
		 * @param	{(String|int)}	im_block
		 *   The block of the wrapper, the HTML content belongs to.
		 * @param	{IkariamCore~Options~HtmlOptions}	io_options
		 *   Options for the html code.
		 */
		this.addHTML = function(is_id, is_wrapperId, im_block, io_options) {
			/*
			 * Function to create the html.
			 */
			var lf_create = function(ie_parentTable, is_elementId, im_value, io_createOptions) {
				var le_htmlRow	= go_self.myGM.addElement('tr', ie_parentTable);
				
				var lo_options = {
					'colSpan':	'2',
					'class':	'center'
				};
				
				if(!!io_createOptions.html === true)
					lo_options['innerHTML'] = io_createOptions.html;
					
				var le_htmlCell	= go_self.myGM.addElement('td', le_htmlRow, lo_options);
				
				if(!!io_createOptions.callback === true)
					io_createOptions.callback.call(io_createOptions.thisReference, le_htmlCell);
			};
			
			var lo_options = {
				createOptions:	{ html: io_options.html, callback: io_options.callback, thisReference: io_options.thisReference },
				position:		io_options.position,
				replace:		io_options.replace
			};
			
			_addElement('html', is_id, is_wrapperId, im_block, lf_create, lo_options);
		};
		
		
		/**
		 * Add a new horizontal line to the options tab.
		 * 
		 * @instance
		 * 
		 * @param	{String}			is_wrapperId
		 *   The id of the wrapper.
		 * @param	{(String|int)}		im_block
		 *   The block of the wrapper, the horizontal line belongs to.
		 * @param	{int}				ii_position
		 *   The position of the horizontal line in the wrapper. (optional)
		 *   
		 * @return	{String}
		 *   The id of the horizontal line.
		 */
		this.addLine = function(is_wrapperId, im_block, ii_position) {
			/*
			 * Function to create the horizontal line.
			 */
			var lf_create = function(ie_parentTable, is_elementId, im_value, io_options) {
				var le_row		= go_self.myGM.addElement('tr', ie_parentTable);
				var le_lineCell	= go_self.myGM.addElement('td', le_row, { 'colSpan': '2', 'class': 'left' });
				
				go_self.myGM.addElement('hr', le_lineCell);
			};
			
			var rs_id		= 'hr' + _gi_lineId;
			var lo_options	= {
				position:		ii_position
			};
			
			_addElement('line', rs_id, is_wrapperId, im_block, lf_create, lo_options);
			_gi_lineId++;
			
			return rs_id;
		};
		
		
		/**
		 * Deletes an wrapper with all option elements contained in it.
		 * 
		 * @instance
		 * 
		 * @param	{String}	is_id
		 *   Id of the wrapper to delete.
		 */
		this.deleteWrapper = function(is_id) {
			if(!_go_wrapper[is_id]) {
				go_self.con.info('Options.deleteWrapper: Wrapper with id "' + is_id + '" does not exist.');
			} else {
				delete _go_wrapper[is_id];
				delete _go_options[is_id];
				
				var li_position = -1;
				
				for(var i = 0; i < _ga_wrapperOrder.length; i++) {
					if(_ga_wrapperOrder[i] == is_id) {
						li_position = i;
						break;
					}
				}
				
				_ga_wrapperOrder.IC.remove(li_position);
			}
		};
		
		
		/**
		 * Deletes an option element.
		 * 
		 * @instance
		 * 
		 * @param	{String}	is_wrapperId
		 *   The id of the wrapper containing the element.
		 * @param	{String}	is_elementId
		 *   The id of the element to delete.
		 */
		this.deleteElement = function(is_wrapperId, is_elementId) {
			if(!(_go_wrapper[is_wrapperId] && _go_wrapper[is_wrapperId].elements[is_elementId])) {
				go_self.con.info('Options.deleteElement: Element with id "' + is_wrapperId + '_' + is_elementId + '" does not exist.');
			} else {
				delete _go_wrapper[is_wrapperId].elements[is_elementId];
				delete _go_options[is_wrapperId][is_elementId];
				
				var li_position = -1;
				
				for(var i = 0; i < _go_wrapper[is_wrapperId].elementOrder.length; i++) {
					if(_go_wrapper[is_wrapperId].elementOrder[i] == is_elementId) {
						li_position = i;
						break;
					}
				}
				
				_go_wrapper[is_wrapperId].elementOrder.IC.remove(li_position);
			}
		};
		
		/**
		 * Get the stored value of an option.
		 * 
		 * @instance
		 * 
		 * @param	{String}	is_wrapperId
		 *   Id of the wrapper of the option element.
		 * @param	{String}	is_optionId
		 *   Id of the option element.
		 * 
		 * @return	{(String|int|boolean)}
		 *   The stored value.
		 */
		this.getOption = function(is_wrapperId, is_optionId) {
			var ls_serverCode = '';
			if(_go_wrapper[is_wrapperId] && _go_wrapper[is_wrapperId].elements[is_optionId] && _go_wrapper[is_wrapperId].elements[is_optionId].serverSpecific === true)
				ls_serverCode = go_self.Ikariam.serverCode;
				
			if(_go_options[is_wrapperId] && (_go_options[is_wrapperId][is_optionId] || _go_options[is_wrapperId][is_optionId] == false)) {
				if(ls_serverCode.length > 0)
					return _go_options[is_wrapperId][is_optionId][ls_serverCode];
				
				return _go_options[is_wrapperId][is_optionId];
			}
			
			go_self.con.warn('Options.getOption: Option with id "' + is_wrapperId + '_' + is_optionId + '" not defined.');
			return null;
		};
		
		/**
		 * Set the stored value of an option.
		 * 
		 * @instance
		 * 
		 * @param	{String}				is_wrapperId
		 *   Id of the wrapper of the option element.
		 * @param	{String}				is_optionId
		 *   Id of the option element.
		 * @param	{(String|int|boolean)}	im_value
		 *   The value to store.
		 */
		this.setOption = function(is_wrapperId, is_optionId, im_value) {
			var ls_serverCode = _go_wrapper[is_wrapperId].elements[is_optionId].serverSpecific === true ? go_self.Ikariam.serverCode : '';
			
			if(_go_options[is_wrapperId] && (_go_options[is_wrapperId][is_optionId] || _go_options[is_wrapperId][is_optionId] == false)) {
				if(ls_serverCode.length > 0)
					_go_options[is_wrapperId][is_optionId][ls_serverCode] = im_value;
				else
					_go_options[is_wrapperId][is_optionId] = im_value;
			} else {
				go_self.con.warn('Options.setOption: Option with id "' + is_wrapperId + '_' + is_optionId + '" not yet defined. Value "' + im_value + '" not stored.');
			}
			
			_saveOptions(true);
		};
		
		/*----------------------------------------*
		 * Register the show option panel handler *
		 *----------------------------------------*/
		
		// Register the option handler to show the options in the option panel.
		go_self.RefreshHandler.add(['options', 'optionsAccount', 'optionsNotification', 'optionsFacebook'], 'showOptionPanel', _showOptionPanel);
		
		/*-------------------------------*
		 * Add the option panel options. *
		 *-------------------------------*/
		
		this.addWrapper('optionPanelOptions', go_self.Language.$('core.optionPanel.section.optionPanelOptions.title'));
		this.addHTML('exportOptions', 'optionPanelOptions', 'links', { thisReference: go_self, callback: _exportOptions });
		this.addHTML('importOptions', 'optionPanelOptions', 'links', { thisReference: go_self, callback: _importOptions });
		this.addHTML('resetOptions', 'optionPanelOptions', 'links', { thisReference: go_self, callback: _resetOptions });
		
		/*---------------------------------------------------------------------*
		 * Types for documentation purposes (e.g. callback functions, objects) *
		 *---------------------------------------------------------------------*/
		
		/**
		 * Callback to get the value of an option from the element.
		 * 
		 * @callback	IkariamCore~Options~GetOption
		 * 
		 * @private
		 * @inner
		 * 
		 * @param	{String}	elementId
		 *   The id of the element which option should be retrieved.
		 * 
		 * @return	{(String|int|boolean)}
		 *   The value of the option.
		 */
		
		/**
		 * Options for the generic <code>_addElement</code> function.
		 * 
		 * @typedef	IkariamCore~Options~AddElementOptions
		 * 
		 * @private
		 * @inner
		 * 
		 * @mixes	IkariamCore~Options~DefaultElementOptions
		 * 
		 * @property	{?*}								[createOptions]	- Options to pass to the create element function.
		 * @property	{?(String|int|boolean)}				[defaultValue]	- Default value of the option. Needed to enable loading of stored option!
		 * @property	{?IkariamCore~Options~GetOption}	[saveCallback]	- Callback to get the value of an option from the element.
		 */
		
		/**
		 * Callback to create an option element.
		 * 
		 * @callback	IkariamCore~Options~CreateCallback
		 * 
		 * @private
		 * @inner
		 * 
		 * @param	{Element}				parentTable
		 *   The parent table of the option element.
		 * @param	{String}				elementId
		 *   The id of the option element.
		 * @param	{(String|int|boolean)}	value
		 *   The value of the option element.
		 * @param	{*}						options
		 *   Options needed to create this option element.
		 */
		
		/**
		 * Callback if the value of an option is changed.
		 * 
		 * @callback	IkariamCore~Options~ChangeCallback
		 * 
		 * @param	{(String|int|boolean)}	newValue
		 *   The new value of the option.
		 * @param	{(String|int|boolean)}	oldValue
		 *   The old value of the option.
		 */
		
		/**
		 * Default options for elements.
		 * 
		 * @typedef	{Object}	IkariamCore~Options~DefaultElementOptions
		 * 
		 * @property	{?boolean}								[serverSpecific=false]	- If the option should be stored for each server specific and not global for all servers. Not changable during replacement!
		 * @property	{?IkariamCore~Options~ChangeCallback}	[changeCallback]		- Callback if the value of an option is changed.
		 * @property	{?int}									[position=array.length]	- Position of the element in the element array. Not changable during replacement!
		 * @property	{?boolean}								[replace=false]			- Replace the element with the same name if it has the same type.
		 */
		
		/**
		 * Options for text fields.
		 * 
		 * @typedef	{Object}	IkariamCore~Options~TextFieldOptions
		 * 
		 * @mixes	IkariamCore~Options~DefaultElementOptions
		 * 
		 * @property	{?int}							[maxLength]	- The maximum length of the input text.
		 * @property	{?IkariamCore~myGM~CssStyles}	[style]		- Special styles to be applied to the element.
		 */
		
		/**
		 * Options for text areas.
		 * 
		 * @typedef	{Object}	IkariamCore~Options~TextAreaOptions
		 * 
		 * @mixes	IkariamCore~Options~DefaultElementOptions
		 * 
		 * @property	{?IkariamCore~myGM~CssStyles}	[style]	- Special styles to be applied to the element.
		 */
		
		/**
		 * Callback to run after setting the HTML string. Can also be used to create the HTML content.
		 * 
		 * @callback	IkariamCore~Options~HtmlCreateCallback
		 * 
		 * @param	{Element}	parent
		 *   The parent element of the custom html.
		 */
		
		/**
		 * Options for custom html.
		 * 
		 * @typedef	{Object}	IkariamCore~Options~HtmlOptions
		 * 
		 * @property	{?String}									[html]					- HTML string to add to the wrapper.
		 * @property	{?IkariamCore~Options~HtmlCreateCallback}	[callback]				- Callback to run after setting the HTML string. Can also be used to create the HTML content.
		 * @property	{?*}										[thisReference]			- Reference to an object which should be referenced by <code>this</code> in the callback as it is not possible to use some objects. (e.g. go_self)
		 * @property	{?int}										[position=array.length]	- Position of the element in the element array. Not changable during replacement!
		 * @property	{?boolean}									[replace=false]			- Replace the element with the same name if it has the same type.
		 */
	}
	
	/**
	 * Handler for options the user can set / change.
	 * 
	 * @instance
	 * 
	 * @type	IkariamCore~Options
	 */
	this.Options = new Options();