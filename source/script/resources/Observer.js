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
		var _go_MutationObserver = MutationObserver || WebKitMutationObserver;
		
		/**
		 * If the MutationObserver can be used or if an workaround must be used.
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	boolean
		 */ 
		var _gb_canUseObserver = !!_go_MutationObserver;
		
		/**
		 * List to store the created observers.
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	MutationObserver[]
		 */
		var _go_observerList = {};
		
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
		 * @param	{string}	is_id
		 *   The id to store the observer.
		 * @param	{element}	ie_target
		 *   The target to observe.
		 * @param	{mixed[]}	io_options
		 *   Options for the observer. All possible options can be found here: {@link https://developer.mozilla.org/en-US/docs/DOM/MutationObserver#MutationObserverInit MutationObserver on MDN}
		 * @param	{function}	if_callback
		 *   The callback for the observer.<br>
		 *   Signature: <code>function(mutations : MutationRecord) : void</code>
		 * @param	{function}	if_noMutationObserverCallback
		 *   The callback if the use of the observer is not possible and DOMAttrModified / DOMSubtreeModified is used instead.<br>
		 *   Signature: <code>function() : void</code>
		 */
		this.add = function(is_id, ie_target, io_options, if_callback, if_noMutationObserverCallback) {
			var lo_observer;
			
			if(!!ie_target) {
				// If the MutationObserver can be used, do so.
				if(_gb_canUseObserver) {
					var lo_optionsCloned = cloneInto(io_options, go_self.win);
					
					lo_observer = new _go_MutationObserver(if_callback);
					lo_observer.observe(ie_target, io_options);
					
					if(!_go_observerList[is_id]) {
						_go_observerList[is_id] = lo_observer;
					} else {
						go_self.con.warn('Observer.add: Id "' + is_id + '" already used for observer, please choose another one!');
					}
				
				// Otherwise use the event listener.
				} else {
					if(io_options.attributes) {
						ie_target.addEventListener('DOMAttrModified', if_noMutationObserverCallback, false);
					}
					
					if(io_options.characterData || io_options.childList || io_options.subtree) {
						ie_target.addEventListener('DOMSubtreeModified', if_noMutationObserverCallback, false);
					}
				}
			} else {
				go_self.con.warn('Observer.add: Observer target not defined! id: ' + is_id);
			}
		};
		
		/**
		 * Removes the observer given by the id. If the use of MutationObserver is not possible, this function can not be used.
		 * 
		 * @instance
		 * 
		 * @param	{string}	is_id
		 *   The id of the observer to remove.
		 */
		this.remove = function(is_id) {
			// If the observer is set.
			if(_gb_canUseObserver && _go_observerList[is_id]) {
				var lo_observer = _go_observerList[is_id];
				lo_observer.disconnect();
				
				delete _go_observerList[is_id];
			} else if(!_gb_canUseObserver) {
				go_self.con.warn('Observer.remove: It is not possible to use MutationObservers so Observer.remove can not be used.');
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
	this.Observer = new Observer();