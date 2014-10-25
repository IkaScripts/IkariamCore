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
		this.__defineGetter__('view', function() {
			var ls_viewId = go_self.myGM.$('body').id;
			
			if(ls_viewId == 'worldmap_iso')
				return 'world';
			
			if(ls_viewId == 'island')
				return 'island';
			
			if(ls_viewId == 'city')
				return 'town';
			
			return '';
		});
		
		/**
		 * Returns the names of all possible views (world, island, town).
		 * 
		 * @instance
		 * 
		 * @return	{string[]}
		 *   All possible view names.
		 */
		this.__defineGetter__('viewNames', function() {
			return ['world', 'island', 'town'];
		});
		
		/**
		 * Returns the names of all possible resources (wood, wine, marble, glass, sulfur).
		 * 
		 * @instance
		 * 
		 * @return	{string[]}
		 *   All possible resource names.
		 */
		this.__defineGetter__('resourceNames', function() {
			return ['wood', 'wine', 'marble', 'glass', 'sulfur'];
		});
		
		/**
		 * Returns a code consisting of the server id and the country code.<br>
		 * Structure: <code><country-code>_<server-id></code><br>
		 * 
		 * @instance
		 * 
		 * @return	{string}
		 *   The code.
		 */
		this.__defineGetter__('serverCode', function() {
			var la_code = top.location.host.match(/^s([0-9]+)-([a-zA-Z]+)\.ikariam\.gameforge\.com$/);
			
			if(!!la_code)
				return la_code[2] + '_' + la_code[1];
			
			return 'undefined';
		});
		
		/**
		 * Parses a string number to an int value.
		 * 
		 * @instance
		 * 
		 * @param	{string}	is_text
		 *   The number to format.
		 *
		 * @return	{int}
		 *   The formatted value.
		 */
		this.getInt = function(is_text) {
			var ls_text = is_text + '';
			return parseInt(ls_text.replace(/(\.|,)/g, ''));
		};
		
		/**
		 * Formats a number to that format that is used in Ikariam.
		 *
		 * @param	{int}					ii_number
		 *   The number to format.
		 * @param	{boolean || boolean[]}	im_addColor
		 *   If the number should be coloured. (optional, if not set, a color will be used for negative and no color will be used for positive numbers)<br>
		 *   Value: boolean || { positive: boolean, negative: boolean } (both, positive / negative are optional)
		 * @param	{boolean}				ib_usePlusSign
		 *   If a plus sign should be used for positive numbers.
		 * 
		 * @return	{string}
		 *   The formated number.
		 */
		this.formatToIkaNumber = function(ii_number, im_addColor, ib_usePlusSign) {
			var rs_text = ii_number + '';
	
			// Set a seperator every 3 digits from the end.
			rs_text = rs_text.replace(/(\d)(?=(\d{3})+\b)/g, '$1' + go_self.Language.$('settings.kiloSep'));
	
			if(ii_number < 0 && !(im_addColor == false || (im_addColor && im_addColor.negative == false))) {
				rs_text = '<span class="red bold">' + rs_text + '</span>';
			}
	
			if(ii_number > 0) {
				rs_text = (ib_usePlusSign ? '+' : '') + rs_text;
	
				if(!!(im_addColor == true || (im_addColor && im_addColor.positive == true))) {
					rs_text = '<span class="green bold">' + rs_text + '</span>';
				}
			}
	
			return rs_text;
		};
		
		/**
		 * Shows a hint to the user (desktop).
		 * 
		 * @instance
		 * 
		 * @param	{string}	is_located
		 *   The location of the hint. Possible are all advisors, a clicked element or a committed element.
		 * @param	{string}	is_type
		 *   The type of the hint. Possible is confirm, error, neutral or follow the mouse.
		 * @param	{string}	is_text
		 *   The hint text.
		 * @param	{string}	is_bindTo
		 *   The JQuery selector of the element the tooltip should be bound to.
		 * @param	{boolean}	ib_isMinimized
		 *   If the message is minimized (only used if type = followMouse).
		 */
		this.showTooltip = function(is_located, is_type, is_text, is_bindTo, ib_isMinimized) {
			// Get the message location.
			var li_location = -1;
			switch(is_located) {
				case 'cityAdvisor':
					li_location = 1;
				  break;
	
				case 'militaryAdvisor':
					li_location = 2;
				  break;
	
				case 'researchAdvisor':
					li_location = 3;
				  break;
	
				case 'diplomacyAdvisor':
					li_location = 4;
				  break;
	
				case 'clickedElement':
					li_location = 5;
				  break;
	
				case 'committedElement':
					li_location = 6;
				  break;
			}
	
			// Get the message type.
			var li_type = -1;
			switch(is_type) {
				case 'confirm':
					li_type = 10;
				  break;
	
				case 'error':
					li_type = 11;
				  break;
	
				case 'neutral':
					li_type = 12;
				  break;
	
				case 'followMouse':
					li_type = 13;
				  break;
			}
			
			go_self.ika.controller.tooltipController.bindBubbleTip(li_location, li_type, is_text, null, is_bindTo, ib_isMinimized);
		};
		
		/**
		 * Creates new checkboxes in ikariam style and adds them to a parent.
		 * 
		 * @instance
		 * 
		 * @param	{element}	ie_parent
		 *   The parent of the new checkboxes.
		 * @param	{mixed[]}	ia_cbData
		 *   An array containing the data (id, label, checked) of each checkbox.
		 */
		this.addCheckboxes = function(ie_parent, ia_cbData) {
			go_self.myGM.addCheckboxes(ie_parent, ia_cbData);
			
			// Replace the checkboxes for better appearance.
			go_self.ika.controller.replaceCheckboxes();
		};
		
		/**
		 * Creates a new radio button group in ikariam style and adds it to a parent table.
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
			go_self.myGM.addRadios(ie_parentTable, is_name, im_checked, ia_options, is_labelText);
			
			// Replace the radiobuttons for better appearance.
			go_self.ika.controller.replaceCheckboxes();
		};
		
		/**
		 * Creates a new select field in ikariam style and adds it to a parent table.
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
			go_self.myGM.addSelect(ie_parentTable, is_id, im_selected, ia_options, is_labelText);
			
			// Replace the dropdown for better appearance.
			go_self.ika.controller.replaceDropdownMenus();
		};
	}
	
	/**
	 * Ikariam specific functions like converting a number from Ikariam format to int.
	 * 
	 * @instance
	 * 
	 * @type	IkariamCore~Ikariam
	 */
	this.Ikariam = new Ikariam();