var HERO_ACTION_LENGTH = 9;
var ACTION_DISTANCE = 175;

var Hero = {
  actions: [],

  /**
   *
   */
  changeActions: function changeHeroActions (character) {
    var inRange = character.getByProximity(ACTION_DISTANCE);
    var dialogs;
    var newActions = [];

    for (var i = 0, len = inRange.length; i < len; i++) {
      // Go through all in range dialogs to evaulate if they are valid
      dialogs = Dialog.process(inRange[i].id, true);

      // Populate new hero actions as long as the dialog is unique
      for(var k = 0, kLen = dialogs.length; k < kLen; k++) {
        newActions.push(dialogs[k]);
      }
    }

    var changed = false;
    for(i = 0; i < HERO_ACTION_LENGTH; i++) {
      if(newActions[i] !== this.actions[i]) {
        this.actions = newActions;
        return true;
      }
    }

    return false;
  },

  /**
   *
   */
  doAction: function doAction (index, instance) {
    var dialog = this.actions[index];
    if(dialog) {
      Dialog.process(dialog);
      if (this.changeActions(instance.character)) {
        instance.heroActionsChanged = true;
      }
    }
  },

  /**
   *
   */
  setInstance: function setInstance (hero) {
    hero.lastDialogCheck = 0;
    hero.currentDialogId = null;
    hero.dialogState = null;
    hero.lastDialogId = null;
    hero.lastChoice = null;
    hero.heroActionsChanged = false;

    jQuery(document).keyup(
      (function (self) {
        return function(info) {
          self.onKeyUp(info);
        };
      })(hero)
    );
  }
};