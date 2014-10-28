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
		 * <code>_go_callbacks = {<br>
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
		var _go_callbacks = {};
		
		/**
		 * Handles the call of the callback functions for the actualisation.
		 * 
		 * @private
		 * @inner
		 */
		var _handleActualisation = function() {
			// Run the callbacks for every reload.
			if(_go_callbacks['*']) {
				go_self.myGM.forEach(_go_callbacks['*'], function(is_key, if_callback) {
					if_callback();
				});
			}
			
			// If the script was already executed on this popup.
			var lb_isAlreadyExecutedPopup	= !!go_self.myGM.$('#' + go_self.myGM.prefix + 'alreadyExecutedPopup');
			var le_popup					= go_self.myGM.$('.templateView');
	
			if(le_popup && !lb_isAlreadyExecutedPopup) {
				// Run the callbacks for every popup opening.
				if(_go_callbacks['%']) {
					go_self.myGM.forEach(_go_callbacks['%'], function(is_key, if_callback) {
						if_callback();
					});
				}
				
				go_self.myGM.addElement('input', go_self.myGM.$('.mainContent', le_popup), { 'id': 'alreadyExecutedPopup', 'type': 'hidden' });
				
				var ls_popupId = le_popup ? le_popup.id.replace('_c', '') : '';
				
				if(_go_callbacks[ls_popupId]) {
					go_self.myGM.forEach(_go_callbacks[ls_popupId], function(is_key, if_callback) {
						if_callback();
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
		 * @param	{MutationRecord}	la_mutations
		 *   All recorded mutations.
		 */
		var _callback = function(la_mutations) {
			la_mutations.forEach(function(io_mutation) {
				if(io_mutation.target.getAttribute('style').search(/display: none/i) != -1) {
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
		 * @param	{event}	io_event
		 *   The called event.
		 */
		var _callbackNoMutationObserver = function(io_event) {
			if(io_event.attrChange == MutationEvent.MODIFICATION) {
				if(io_event.attrName.IC.trim() == 'style' && io_event.newValue.search(/display: none/i) != -1) {
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
		 * @param	{string||string[]}	im_popupId
		 *   The id(s) of the popup(s) where the callback schould be called (without '_c' at the end).<br>
		 *   Set to '*' for calling at every actualisation, not just popups. Set to '%' for calling on every popup.
		 * @param	{string}			is_callbackId
		 *   The id of the callback. This must be unique for a popup.
		 * @param	{function}			if_callback
		 *   The callback which should be called.<br>
		 *   Signature: <code>function() : void</code>
		 */
		this.add = function(im_popupId, is_callbackId, if_callback) {
			if(Array.isArray(im_popupId) === true) {
				for(var i = 0; i < im_popupId.length; i++) {
					this.add(im_popupId[i], is_callbackId, if_callback);
				}
				
				return;
			}
			
			if(!_go_callbacks[im_popupId]) {
				_go_callbacks[im_popupId] = {};
			}
			
			if(!_go_callbacks[im_popupId][is_callbackId]) {
				_go_callbacks[im_popupId][is_callbackId] = if_callback;
			} else {
				go_self.con.warn('RefreshHandler.add: Id set "' + im_popupId + '|' + is_callbackId + '" already used for observer, please choose another one!');
			}
		};
		
		/**
		 * Removes a popup handler.
		 * 
		 * @instance
		 * 
		 * @param	{string||string[]}	im_popupId
		 *   The id(s) of the popup(s) where the callback was called (without '_c' at the end).
		 *   Set to '*' for callbacks on every actualisation, not just popups. Set to '%' for callbacks on every popup.
		 * @param	{string}			is_callbackId
		 *   The id of the callback. This must be unique for a popup.
		 */
		this.remove = function(im_popupId, is_callbackId) {
			if(Array.isArray(im_popupId) === true) {
				for(var i = 0; i < im_popupId.length; i++) {
					this.remove(im_popupId[i], is_callbackId);
				}
				
				return;
			}
			
			if(_go_callbacks[im_popupId] && _go_callbacks[im_popupId][is_callbackId]) {
				delete	_go_callbacks[im_popupId][is_callbackId];
			}
		};
		
		/*----------------------------------------------------*
		 * Register the observer and handle popups on startup *
		 *----------------------------------------------------*/
		
		// Add the observer for the popups.
		go_self.Observer.add('actualisationHandler', go_self.myGM.$('#loadingPreview'), { attributes: true, attributeFilter: ['style'] }, _callback, _callbackNoMutationObserver);
		
		// Execute the handler on popups which are shown on startup.
		setTimeout(_handleActualisation, 1000);
	}
	
	/**
	 * Handler for functions that should run on ikariam popups.
	 * 
	 * @instance
	 * 
	 * @type	IkariamCore~RefreshHandler
	 */
	this.RefreshHandler = new RefreshHandler();