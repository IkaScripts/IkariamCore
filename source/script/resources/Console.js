/**
	 * Debugging console. For more information about commands that are available for the Firebug console see {@link http://getfirebug.com/wiki/index.php/Console_API Firebug Console API}.<br>
	 * Available commands:<br>
	 * <code>assert, clear, count, debug, dir, dirxml, error, exception, group, groupCollapsed, groupEnd,
	 * info, log, profile, profileEnd, table, time, timeEnd, timeStamp, trace, warn</code><br>
	 * <br>
	 * The console is deactivated by the Ikariam page but with the script {@link @SCRIPT_LINK_RESCUE_CONSOLE@ Rescue Console} you can use it.
	 * 
	 * @instance
	 * 
	 * @type	console
	 */
	this.con = (function() {
		// Set the console to the "rescued" debugConsole.
		var lo_console = go_self.win.debugConsole;
		
		if(!go_settings.debug || !lo_console) {
			lo_console = {};
		}
		
		// Define all Firebug tags.
		var la_tags = ['assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error', 'exception',
						'group', 'groupCollapsed', 'groupEnd', 'info', 'log', 'profile', 'profileEnd',
						'table', 'time', 'timeEnd', 'timeStamp', 'trace', 'warn'];
		
		var lo_counters	= {};
		var lo_timers	= {};
		
		// Define the backup functions.
		var lo_selfDefinedFunctions = {
			assert: function(im_toCheck, im_toLog) {
				if(im_toCheck === false || im_toCheck === 0 || im_toCheck === null || im_toCheck === undefined) {
					this.error(im_toLog || 'Assertion Failure');
				}
			},
			count: function(is_name) {
				if(!lo_counters[is_name] === true)
					lo_counters[is_name] = 0;
				
				lo_counters[is_name]++;
				
				this.log(is_name + ': ' + lo_counters[is_name]);
			},
			debug: function() {
				this.log.apply(arguments);
			},
			error: function() {
				this.log.apply(arguments);
			},
			exception: function() {
				this.log.apply(arguments);
			},
			info: function() {
				this.log.apply(arguments);
			},
			time: function(is_name) {
				lo_timers[is_name] = new Date();
			},
			timeEnd: function(is_name) {
				var ld_now = new Date();
				var li_timeElapsed = ld_now.getMilliseconds() - lo_timers[is_name].getMilliseconds();
				
				delete	lo_timers[is_name];
				
				this.info(is_name + ': ' + li_timeElapsed + 'ms');
			},
			timeStamp: function(iv_name) {
				this.log((new Date()).IC.format('HH:mm:ss.SSS') + ' ' + iv_name);
			},
			warn: function() {
				this.log.apply(arguments);
			}
		};
		
		for(var i = 0; i < la_tags.length; i++) {
			var ls_key = la_tags[i];
			
			// If the function is not set yet, set it to the backup function or an empty function.
			if(!lo_console[ls_key]) {
				if(!go_settings.debug && lo_selfDefinedFunctions[ls_key]) {
					lo_console[ls_key] = lo_selfDefinedFunctions[ls_key];
				} else {
					lo_console[ls_key] = function() { return; };
				}
			}
		}
		
		return lo_console;
	})();