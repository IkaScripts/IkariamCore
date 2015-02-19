// ==UserScript==
// @name			@SCRIPT_NAME@
// @description		@SCRIPT_DESCRIPTION_DEFAULT@
// @namespace		@SCRIPT_NAMESPACE@
// @author			@SCRIPT_AUTHOR_NAME@
// @version			@SCRIPT_VERSION@
// @license			@SCRIPT_LICENSE@
//
// @name:de			@SCRIPT_NAME@
// @description:de	@SCRIPT_DESCRIPTION_DE@
//
// @include			http://s*.ikariam.gameforge.com/*
//
// @exclude			http://support.*.ikariam.gameforge.com/*
//
// @resource		de			@RESOURCE_LANGUAGE_URL@/de.json
// @resource		de_settings	@RESOURCE_LANGUAGE_URL@/de_settings.json
// @resource		ru			@RESOURCE_LANGUAGE_URL@/ru.json
// @resource		ru_settings	@RESOURCE_LANGUAGE_URL@/ru_settings.json
// @resource		lv			@RESOURCE_LANGUAGE_URL@/lv.json
// @resource		lv_settings	@RESOURCE_LANGUAGE_URL@/lv_settings.json
// 
// @grant			unsafeWindow
// @grant			GM_setValue
// @grant			GM_getValue
// @grant			GM_deleteValue
// @grant			GM_listValues
// @grant			GM_getResourceText
// @grant			GM_xmlhttpRequest
// ==/UserScript==

@CORE_EXTEND_NATIVE_OBJECTS@

/**
 * Instantiate a new set of core functions.<br>
 * {@link @SCRIPT_LINK_GREASY_FORK@ Script on Greasy Fork}<br>
 * {@link @SCRIPT_LINK_GITHUB@ Script on GitHub}
 * 
 * @version	@SCRIPT_VERSION@
 * @author	@SCRIPT_AUTHOR_NAME@	<@SCRIPT_AUTHOR_EMAIL@>
 * 
 * @global
 * 
 * @class
 * @classdesc	@SCRIPT_DESCRIPTION_DEFAULT@
 * 
 * @param	{String}	is_scriptVersion
 *   The version of the script using Ikariam Core.
 * @param	{int}		ii_scriptId
 *   The id of the script using Ikariam Core.
 * @param	{String}	is_scriptName
 *   The name of the script using Ikariam Core.
 * @param	{String}	is_scriptAuthor
 *   The author of the script using Ikariam Core.
 * @param	{boolean}	ib_debug
 *   If debugging is enabled.
 */
function IkariamCore(is_scriptVersion, ii_scriptId, is_scriptName, is_scriptAuthor, ib_debug) {
	/**
	 * Storage for accessing <code>this</code> as reference to IkariamCore in subfunctions. Do <b>NOT</b> delete!
	 * 
	 * @private
	 * @inner
	 * 
	 * @type	IkariamCore
	 */
	var go_self = this;
	
	/**
	 * Storage for information on the script using Ikariam Core.
	 * 
	 * @private
	 * @inner
	 * 
	 * @type Object
	 * 
	 * @property	{String}	version	- The script version.
	 * @property	{int}		id		- The script id.
	 * @property	{String}	name	- The script name.
	 * @property	{String}	author	- The script author.
	 */
	var go_script = {
		version:	is_scriptVersion,
		id:			ii_scriptId,
		name:		is_scriptName,
		author:		is_scriptAuthor
	};
	
	/**
	 * General settings like debugging switched on / off.
	 * 
	 * @private
	 * @inner
	 * 
	 * @type Object
	 * 
	 * @property	{boolean}	debug	- If debugging is enabled.
	 */
	var go_settings = {
		debug:	ib_debug
	};
	
	/**
	 * A reference to <code>window</code> / <code>unsafeWindow</code>.
	 * 
	 * @instance
	 * 
	 * @type	window
	 */
	this.win = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;
	
	/**
	 * Reference to <code>window.ikariam</code>.
	 * 
	 * @instance
	 * 
	 * @type	Object
	 */
	this.ika = this.win.ikariam;
	
	@CORE_CONSOLE@

	this.con.groupCollapsed('IkariamCore initalization ...');
	
	@CORE_MY_GM@
	
	this.con.timeStamp('IkariamCore.myGM created');
	
	@CORE_LANGUAGE@
	
	this.con.timeStamp('IkariamCore.Language created');
	
	@CORE_IKARIAM@
	
	this.con.timeStamp('IkariamCore.Ikariam created');
	
	@CORE_OBSERVER@
	
	this.con.timeStamp('IkariamCore.Observer created');
	
	@CORE_REFRESH_HANDLER@
	
	this.con.timeStamp('IkariamCore.RefreshHandler created');
	
	@CORE_OPTIONS@
	
	this.con.timeStamp('IkariamCore.Options created');
	
	@CORE_UPDATER@
	
	this.con.timeStamp('IkariamCore.Updater created');
	this.con.groupEnd();
}