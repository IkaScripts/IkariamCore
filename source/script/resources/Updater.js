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
		var _gb_manualUpdate = false;
		
		/**
		 * Types for entries in update history.
		 * 
		 * @private
		 * @inner
		 * 
		 * @default ['feature', 'change', 'bugfix', 'language', 'core']
		 * 
		 * @type	string[]
		 */ 
		var _ga_updateHistoryEntryTypes = ['feature', 'change', 'bugfix', 'language', 'core'];
	
		/**
		 * Compares two versions and returns if there is a new version.
		 * 
		 * @private
		 * @inner
		 * 
		 * @param	{string}	is_versionOld
		 *   The old version number.
		 * @param	{string}	is_versionNew
		 *   The new version number.
		 * @param	{int}		ii_maxPartsToCompare
		 *   The number of parts to compare at most. (optional, default "compare all parts")
		 *
		 * @return	{boolean}
		 *   If a new version is available.
		 */
		var _newerVersion = function(is_versionOld, is_versionNew, ii_maxPartsToCompare) {
			var rb_newVersion = false;
	
			is_versionOld += '';
			is_versionNew += '';
	
			var la_versionOldParts = is_versionOld.split('.');
			var la_versionNewParts = is_versionNew.split('.');
	
			var li_biggerNumberOfParts = la_versionOldParts.length > la_versionNewParts.length ? la_versionOldParts.length : la_versionNewParts.length;
	
			if(!ii_maxPartsToCompare || ii_maxPartsToCompare < 1) {
				ii_maxPartsToCompare = li_biggerNumberOfParts + 1;
			}
	
			for(var i = 0; i < li_biggerNumberOfParts; i++) {
				var li_versionPartOld = parseInt(la_versionOldParts[i] || 0);
				var li_versionPartNew = parseInt(la_versionNewParts[i] || 0);
	
				if(li_versionPartOld < li_versionPartNew) {
					rb_newVersion = true;
					break;
				} else if(li_versionPartOld > li_versionPartNew || i == ii_maxPartsToCompare - 1) {
					rb_newVersion = false;
					break;
				}
			}
	
			return rb_newVersion;
		};
		
		/**
		 * Extract the update history from the metadata.
		 * 
		 * @private
		 * @inner
		 * 
		 * @param	{string[]}	io_metadata
		 *   Array with the formated metadata.
		 *
		 * @return	{mixed[]}
		 *   The extracted update history.
		 */
		var _extractUpdateHistory = function(io_metadata) {
			var ro_updateHistory = {};
	
			for(var i = 0; i < io_metadata['history'].length; i++) {
				// Get the information from the update history data.
				var la_history_entry = io_metadata['history'][i].match(/^(\S+)\s+(\S+)\s+(.*)$/);
				
				var ls_version		= la_history_entry[1];
				var ls_type			= la_history_entry[2];
				var ls_type_trimmed	= ls_type.IC.trim(':').toLowerCase();
				var ls_info			= la_history_entry[3];
	
				if(!ro_updateHistory[ls_version]) {
					ro_updateHistory[ls_version] = {};
				}
				
				if(ls_type_trimmed == 'release') {
					ro_updateHistory[ls_version]['release'] = ls_info;
				} else if(_ga_updateHistoryEntryTypes.indexOf(ls_type_trimmed) > -1) {
					if(!ro_updateHistory[ls_version][ls_type_trimmed]) {
						ro_updateHistory[ls_version][ls_type_trimmed] = new Array(ls_info);
					} else {
						ro_updateHistory[ls_version][ls_type_trimmed].push(ls_info);
					}
				} else {
					if(!ro_updateHistory[ls_version]['other']) {
						ro_updateHistory[ls_version]['other'] = new Array(ls_type + " " + ls_info);
					} else {
						ro_updateHistory[ls_version]['other'].push(ls_type + " " + ls_info);
					}
				}
			}
	
			// Return the update history.
			return ro_updateHistory;
		};
		
		/**
		 * Format the update history using some HTML codes.
		 * 
		 * @private
		 * @inner
		 * 
		 * @param	{mixed[]}	io_updateHistory
		 *   The update history.
		 *
		 * @return	{string}
		 *   The formated update history.
		 */
		var _formatUpdateHistory = function(io_updateHistory) {
			var rs_formattedUpdateHistory = '';
			
			for(var ls_version in io_updateHistory) {
				if(Object.prototype.hasOwnProperty.call(io_updateHistory, ls_version)) {
					rs_formattedUpdateHistory += '<h2>v' + ls_version + '</h2><span class="smallFont">' + io_updateHistory[ls_version]['release'] + '</span></small><br><table class="' + go_self.myGM.prefix + 'updateTable"><tbody>';
		
					for(var ls_type in io_updateHistory[ls_version]) {
						if(Object.prototype.hasOwnProperty.call(io_updateHistory[ls_version], ls_type) && ls_type != 'release') {
							rs_formattedUpdateHistory += '<tr><td class="' + go_self.myGM.prefix + 'updateDataType">' + go_self.Language.$('core.update.possible.type.' + ls_type) + '</td><td class="' + go_self.myGM.prefix + 'updateDataInfo"><ul>';
			
							for(var i = 0 ; i < io_updateHistory[ls_version][ls_type].length; i++) {
								rs_formattedUpdateHistory += '<li>' + io_updateHistory[ls_version][ls_type][i] + '</li>';
							}
			
							rs_formattedUpdateHistory += '</ul></td></tr>';
						}
					}
		
					rs_formattedUpdateHistory += '</tbody></table><br>';
				}
			}
	
			return rs_formattedUpdateHistory;
		};
		
		/**
		 * Show the update information panel.
		 * 
		 * @private
		 * @inner
		 * 
		 * @param	{mixed[]}	io_metadata
		 *   Array with formated metadata
		 */
		var _showUpdateInfo = function(io_metadata) {
			var lo_updateHistory = _extractUpdateHistory(io_metadata);
	
			var lo_notificationText = {
				header:		go_self.Language.$('core.update.possible.header'),
				bodyTop:	go_self.Language.$('core.update.possible.text', ['<a href="https://greasyfork.org/scripts/' + go_script.id + '" target="_blank" >' + go_script.name + '</a>', go_script.version, io_metadata.version]) + '<br>&nbsp;&nbsp;<b><u>' + go_self.Language.$('core.update.possible.history') + '</u></b>',
				bodyBottom:	_formatUpdateHistory(lo_updateHistory),
				confirm:	go_self.Language.$('core.update.possible.button.install'),
				abort:		go_self.Language.$('core.update.possible.button.hide')
			};
	
			var lo_notificationCallback = {
				confirm:	function() { go_self.win.top.location.href = 'https://greasyfork.org/scripts/' + go_script.id + '/code/' + go_script.id + '.user.js'; },
				abort:		function() { go_self.myGM.setValue('updater_hideUpdate', io_metadata.version + ''); }
			};
	
			go_self.myGM.notification(lo_notificationText, lo_notificationCallback);
		};
	
		/**
		 * Format the given metadata.
		 * 
		 * @private
		 * @inner
		 * 
		 * @param	{string}	is_metadata
		 *   The metadata to format.
		 *
		 * @return	{string[]}
		 *   The formatted metadata as array.
		 */
		var _formatMetadata = function(is_metadata) {
			var rs_metadata = new Array();
	
			// Extract the tags from the metadata.
			var ls_innerMetadata = is_metadata.match(/\/\/ ==UserScript==((.|\n|\r)*?)\/\/ ==\/UserScript==/)[0];
	
			if(ls_innerMetadata) {
				// Extract all tags.
				var la_metadata_entries = ls_innerMetadata.match(/\/\/ @(.*?)(\n|\r)/g);
	
				for(var i = 0; i < la_metadata_entries.length; i++) {
					// Extract the data from the tag.
					var la_metadata_entry = la_metadata_entries[i].match(/\/\/ @(.*?)\s+(.*)/);
	
					if(!rs_metadata[la_metadata_entry[1]]) {
						rs_metadata[la_metadata_entry[1]] = new Array(la_metadata_entry[2]);
					} else {
						rs_metadata[la_metadata_entry[1]].push(la_metadata_entry[2]);
					}
				}
			}
	
			return rs_metadata;
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
			// Send a request to the script hosting server to get the metadata of the script to check if there is a new update.
			var lb_notPossible = go_self.myGM.xhr({
					method: 'GET',
					url: 'https://greasyfork.org/scripts/' + go_script.id + '/code.meta.js',
					headers: {'User-agent': 'Mozilla/5.0', 'Accept': 'text/html'},
					onload: function(io_response) {
						var lo_metadata = _formatMetadata(io_response.responseText);
						
						if(_newerVersion(go_script.version, lo_metadata.version, go_self.Options.getOption('updateOptions', 'updateNotifyLevel')) && (go_self.myGM.getValue('updater_hideUpdate', go_script.version) != lo_metadata.version || _gb_manualUpdate)) {
							_showUpdateInfo(lo_metadata);
						} else if(_gb_manualUpdate)	{
							var lo_notificationText = {
								header:	go_self.Language.$('core.update.noNewExists.header'),
								body:	go_self.Language.$('core.update.noNewExists.text', ['<a href="https://greasyfork.org/scripts/' + go_script.id + '" target="_blank" >' + go_script.name + '</a>', go_script.version])
							};
	
							go_self.myGM.notification(lo_notificationText);
						}
					}
				});
			
			if(lb_notPossible && lb_notPossible == true) {
				go_self.Options.setOption('updateOptions', 'updateInterval', 2419200);

				var lo_notificationText = {
					header:	go_self.Language.$('core.update.notPossible.header'),
					body:	go_self.Language.$('core.update.notPossible.text', ['<a href="https://greasyfork.org/scripts/' + go_script.id + '" target="_blank" >' + go_script.name + '</a>', go_script.version])
				};

				go_self.myGM.notification(lo_notificationText);
			}
		};
		
		/**
		 * Search manually for updates. Forces to search for updates. Even shows a popup if no new update is available.
		 * 
		 * @instance
		 */
		this.doManualUpdate = function() {
			_gb_manualUpdate = true;
			go_self.Updater.checkForUpdates();
			go_self.myGM.setValue('updater_lastUpdateCheck', (new Date()).getTime() + '');
		};
		
		/**
		 * Set the possible entries for update history entries. "release" for the release date and "other" 
		 * for all entries which are not known will be stipped as they are default. Translations have to be 
		 * provided as translation in <code>core.update.possible.type.typeName</code>
		 * 
		 * @instance
		 * 
		 * @param	{string[]}	ia_updateHistoryEntryTypes
		 *   The array with the update history entries to set.
		 */
		this.setUpdateHistoryEntryTypes = function(ia_updateHistoryEntryTypes) {
			['release', 'other'].forEach(function(is_toStrip) {
				var li_index = ia_updateHistoryEntryTypes.indexOf('release');
				if(li_index !== -1)
					ia_updateHistoryEntryTypes.IC.remove(li_index);
			});
			
			_ga_updateHistoryEntryTypes = ia_updateHistoryEntryTypes;
		};
		
		/*------------------------*
		 * Add the updater styles *
		 *------------------------*/
		
		go_self.myGM.addStyle(
				"." + go_self.myGM.prefix + "updateTable			{ border-collapse: separate; border-spacing: 2px; } \
				 ." + go_self.myGM.prefix + "updateDataType			{ width: 100px; padding: 5px 0px 5px 5px; border: 1px solid #D2A860; } \
				 ." + go_self.myGM.prefix + "updateDataInfo			{ width: 300px; padding: 5px 5px 5px 20px; border: 1px solid #D2A860; } \
				 ." + go_self.myGM.prefix + "updateDataInfo ul li	{ list-style: disc outside none; }",
				'updater', true
			);
		
		/*----------------------*
		 * Register the options *
		 *----------------------*/
		
		var _ga_updateIntervalOpts = new Array(
				{ value: -1,		name: go_self.Language.$('core.optionPanel.section.update.label.interval.option.never')	},
				{ value: 3600,		name: go_self.Language.$('core.optionPanel.section.update.label.interval.option.hour')	},
				{ value: 43200,		name: go_self.Language.$('core.optionPanel.section.update.label.interval.option.hour12') },
				{ value: 86400,		name: go_self.Language.$('core.optionPanel.section.update.label.interval.option.day')	},
				{ value: 259200,	name: go_self.Language.$('core.optionPanel.section.update.label.interval.option.day3')	},
				{ value: 604800,	name: go_self.Language.$('core.optionPanel.section.update.label.interval.option.week')	},
				{ value: 1209600,	name: go_self.Language.$('core.optionPanel.section.update.label.interval.option.week2')	},
				{ value: 2419200,	name: go_self.Language.$('core.optionPanel.section.update.label.interval.option.week4')	}
			);
		
		var _ga_updateNotifyLevelOpts = new Array(
				{ value: 0,	name: go_self.Language.$('core.optionPanel.section.update.label.notifyLevel.option.all')	},
				{ value: 1,	name: go_self.Language.$('core.optionPanel.section.update.label.notifyLevel.option.major')	},
				{ value: 2,	name: go_self.Language.$('core.optionPanel.section.update.label.notifyLevel.option.minor')	},
				{ value: 3,	name: go_self.Language.$('core.optionPanel.section.update.label.notifyLevel.option.patch')	}
			);
		
		var _searchUpdates = function(ie_parent) {
			var ls_updateLink = this.Language.$('core.optionPanel.section.update.label.manual', [go_script.name]);
			this.myGM.addElement('a', ie_parent, { 'href': 'javascript:;', 'innerHTML': ls_updateLink, 'click': go_self.Updater.doManualUpdate });
		};
		
		go_self.Options.addWrapper('updateOptions', go_self.Language.$('core.optionPanel.section.update.title'), 1);
		go_self.Options.addSelect('updateInterval', 'updateOptions', 'generalOptions', 3600, go_self.Language.$('core.optionPanel.section.update.label.interval.description'), _ga_updateIntervalOpts, {});
		go_self.Options.addSelect('updateNotifyLevel', 'updateOptions', 'generalOptions', 0, go_self.Language.$('core.optionPanel.section.update.label.notifyLevel.description'), _ga_updateNotifyLevelOpts, {});
		go_self.Options.addHTML('manualUpdateLink', 'updateOptions', 'manualUpdate', { thisReference: go_self, callback: _searchUpdates });
		
		/*-------------------------------------*
		 * Check automatically for new updates *
		 *-------------------------------------*/
		
		setTimeout(function() {
			var li_lastCheck	= go_self.myGM.getValue('updater_lastUpdateCheck', 0);
			var li_millis		= (new Date()).getTime();
			var li_diff			= li_millis - li_lastCheck;
			var li_interval		= go_self.Options.getOption('updateOptions', 'updateInterval') * 1000;
		
			if(li_interval > 0 && li_diff > li_interval) {
				_gb_manualUpdate = false;
				go_self.Updater.checkForUpdates();

				go_self.myGM.setValue('updater_lastUpdateCheck', li_millis + '');
			}
		}, 0);
	}
	
	/**
	 * Updater to check for updates.
	 * 
	 * @instance
	 * 
	 * @type	IkariamCore~Updater
	 */
	this.Updater = new Updater();