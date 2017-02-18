/**
	 * Debugging console.<br>
	 * Available commands:<br>
	 * <code>assert, clear, count, debug, dir, dirxml, error, exception, group, groupCollapsed, groupEnd,
	 * info, log, logTimeStamp, profile, profileEnd, table, time, timeEnd, timeStamp, trace, warn</code><br>
	 * <br>
	 * The console is deactivated by the Ikariam page but with the script {@link //@SCRIPT_LINK_RESCUE_CONSOLE@// Rescue Console} you can use it.
	 * 
	 * @instance
	 * 
	 * @type	console
	 */
	this.con = (function() {
		// Wrapper for console functions.
		var lo_consoleWrapper = {};
		
		// Set the console to the "rescued" debugConsole.
		var lo_originalConsole = go_self.win.debugConsole;
		
		// Define all console tags.
		var la_tags = ['assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error', 'exception',
						'group', 'groupCollapsed', 'groupEnd', 'info', 'log', 'logTimeStamp', 'profile',
						'profileEnd', 'table', 'time', 'timeEnd', 'timeStamp', 'trace', 'warn'];
		
		var lo_counters	= {};
		var lo_timers	= {};
		
		// Define the backup functions.
		var lo_selfDefinedFunctions = {
			assert: function(im_toCheck, im_toLog) {
				if(im_toCheck === false || im_toCheck === 0 || im_toCheck === null || im_toCheck === undefined) {
					go_self.con.error(im_toLog || 'Assertion Failure');
				}
			},
			count: function(is_name) {
				if(!lo_counters[is_name] === true)
					lo_counters[is_name] = 0;
				
				lo_counters[is_name]++;
				
				go_self.con.log(is_name + ': ' + lo_counters[is_name]);
			},
			debug: function() {
				go_self.con.log.apply(arguments);
			},
			error: function() {
				go_self.con.log.apply(arguments);
			},
			exception: function() {
				go_self.con.log.apply(arguments);
			},
			info: function() {
				go_self.con.log.apply(arguments);
			},
			logTimeStamp: function(iv_name) {
				go_self.con.log((new Date()).IC.format('HH:mm:ss.SSS') + ' ' + iv_name);
			},
			time: function(is_name) {
				go_self.con.info(is_name + ': timer started');
				lo_timers[is_name] = new Date();
			},
			timeEnd: function(is_name) {
				var ld_now = new Date();
				var li_timeElapsed = ld_now.getMilliseconds() - lo_timers[is_name].getMilliseconds();
				
				delete	lo_timers[is_name];
				
				go_self.con.info(is_name + ': ' + li_timeElapsed + 'ms');
			},
			warn: function() {
				go_self.con.log.apply(arguments);
			}
		};
		
		for(var i = 0; i < la_tags.length; i++) {
			var ls_key = la_tags[i];
			
			if(go_settings.debug) {
				// If available in console: use console; else: use backup function if available.
				if(lo_originalConsole[ls_key]) {
					lo_consoleWrapper[ls_key] = lo_originalConsole[ls_key];
				} else if(lo_selfDefinedFunctions[ls_key]) {
					lo_consoleWrapper[ls_key] = lo_selfDefinedFunctions[ls_key];
				}
			}
			
			// If the function is not set yet, set it to an empty function.
			if(!lo_consoleWrapper[ls_key]) {
				lo_consoleWrapper[ls_key] = function() { return; };
			}
		}
		
		return lo_consoleWrapper;
	})();