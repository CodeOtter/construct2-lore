var nullDialog = {
	actionText: ""
};
var DIALOG_JSON_PATH = 'dialog.json';

// ECMAScript 5 strict mode

assert2(cr, "cr namespace not created");
assert2(cr.behaviors, "cr.behaviors not created");

/////////////////////////////////////
// Behavior class

/**
 *
 */
cr.behaviors.Lore = function(runtime)
{
	this.runtime = runtime;
};

$.ajax({
	async: false,
	url: DIALOG_JSON_PATH
}).done(function dialogReceived(data) {
	loadFromJson(data);

	/**
	 *
	 */
	(function start() {
		"use strict";

		var LoreProto = cr.behaviors.Lore.prototype;
			
		/////////////////////////////////////
		// Behavior type class

		/**
		 *
		 */
		LoreProto.Type = function Type (behavior, objtype)
		{
			this.behavior = behavior;
			this.objtype = objtype;
			this.runtime = behavior.runtime;
		};

		/**
		 *
		 */
		LoreProto.Type.prototype.onCreate = function onCreate () {};

		/////////////////////////////////////
		// Behavior instance class

		/**
		 *
		 */
		LoreProto.Instance = function Instance (type, inst)
		{
			this.type = type;
			this.behavior = type.behavior;
			this.inst = inst;				// associated object instance to modify
			this.runtime = type.runtime;
		};
		
		var InstanceProto = LoreProto.Instance.prototype;

		/**
		 *
		 */
		InstanceProto.onCreate = function onCreate ()
		{
			// Attach a Character instance to this entity
			this.character = Character.getByName(this.properties[0]);

			if(!this.character) {
				return;
			}

			this.character.runtimeInstance = this.inst;

			// Only bind keyboard events via jQuery if default controls are in use
			if (!this.runtime.isDomFree) {
				if (this.character.id === 1) {
					Hero.setInstance(this);
				} else {
					Character.activeInstances.push(this.character);
				}
			} 
		};

		/**
		 *
		 */
		InstanceProto.onDestroy = function onDestroy () {
			// Detach a Character instance to this entity
			this.character.runtimeInstance = null;
			
			// Only bind keyboard events via jQuery if default controls are in use
			if (!this.runtime.isDomFree) {
				if (this.character.id === 1) {
					jQuery(document).off('keyup', this.onKeyUp);
				} else {
					Character.activeInstances.splice(Character.activeInstances.indexOf(this.character), 1);
				}
			}
		};

		/**
		 *
		 */
		InstanceProto.onKeyUp = function onKeyUp (info)
		{
			switch (info.which) {
				case 49: Hero.doAction(0, this); break;
				case 50: Hero.doAction(1, this); break;
				case 51: Hero.doAction(2, this); break;
				case 52: Hero.doAction(3, this); break;
				case 53: Hero.doAction(4, this); break;
				case 54: Hero.doAction(5, this); break;
				case 55: Hero.doAction(6, this); break;
				case 56: Hero.doAction(7, this); break;
				case 57: Hero.doAction(8, this); break;
			}
		};

		/**
		 *
		 */
		InstanceProto.onWindowBlur = function onWindowBlur () {};

		/**
		 *
		 */
		InstanceProto.tick = function tick () {		
			// Only do dialog checks for a hero's location
			if (this.character.id !== 1) {
				return;
			}

			this.lastDialogCheck += this.runtime.getDt(this.inst);

			if (this.lastDialogCheck > 0.1666) {
				// Only check for dialog events 6 times a second
				this.lastDialogCheck = 0;
				if (Hero.changeActions(this.character)) {
					this.heroActionsChanged = true;
				}
			}
		};
		
		/**BEGIN-PREVIEWONLY**/

		/**
		 *
		 */
		InstanceProto.getDebuggerValues = function getDebuggerValues (propsections) {
			var character = Character.getByName(this.character);
			var dialogIds = 'NONE';

			if (character) {
				dialogs = Dialog.process(character.id, true);

				if (dialogs.length > 0) {
					var dialogsIds = [];
					for (var i = 0, len = dialogs.length; i < len; i++) {
						dialogIds.push(dialogs[i].id);
					}
					dialogIds = dialogIds.join(',');
				}
			}

			propsections.push({
				"title": this.type.name,
				"properties": [
					{"name": "Character", "value": this.character},
					{"name": "Next Dialog", "value": dialogIds},
				]
			});
		};

		/**
		 *
		 */
		InstanceProto.onDebugValueEdited = function onDebugValueEdited (header, name, value)
		{
			switch (name) {
				case 'Character':
					this.character = value;
				break;
				default: break;
			}
		};
		/**END-PREVIEWONLY**/

		//////////////////////////////////////
		// Conditions

		/**
		 *
		 */
		function Cnds() {}


		/**
		 *
		 */
		Cnds.prototype.ActionAvailable = function ActionAvailable ()
		{
			var result = this.heroActionsChanged;
			if(result) {
				this.heroActionsChanged = false;
			}
			return result;
		};

		/**
		 *
		 */
		Cnds.prototype.HasStartedAction = function HasStartedAction ()
		{
			return false;
		};

		/**
		 *
		 */
		Cnds.prototype.HasEndedAction = function HasEndedAction ()
		{
			return false;
		};

		/**
		 *
		 */
		Cnds.prototype.HasIteratedAction = function HasIteratedAction ()
		{
			return false;
		};

		/**
		 *
		 */
		Cnds.prototype.HasMadeChoice = function HasMadeChoice ()
		{
			return false;
		};

		LoreProto.cnds = new Cnds();

		//////////////////////////////////////
		// Actions

		/**
		 *
		 */
		function Acts() {}

		/**
		 *
		 */
		Acts.prototype.EngageAction = function EngageAction (target) {

		};

		/**
		 *
		 */
		Acts.prototype.SetFlag = function SetFlag (flag, state) {
			Dialog.flag[flag] = (state === 'true' ? true : false);
		};

		LoreProto.acts = new Acts();

		//////////////////////////////////////
		// Expressions

		/**
		 *
		 */
		function Exps() {}

		/**
		 *
		 */
		Exps.prototype.ActionText = function ActionText (ret, index) {
			ret.set_string((Hero.actions[index] || nullDialog).actionText);
		};

		/**
		 *
		 */
		Exps.prototype.GetFlag = function GetFlag (ret, flag) {
			ret.set_int(Dialog.flag[flag] === true ? 1 : 0);
		};

		LoreProto.exps = new Exps();
	}());
});