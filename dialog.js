/**
 * Dialog constructor
 */
function Dialog(id, characterId, faceId, type, needFlags, onFlagCheck, onChoices, content, choices, onComplete, setFlags, nextId, actionText) {
  this.id = id;
  this.characterId = characterId;
  this.faceId = faceId;
  this.type = type;
  this.needFlags = needFlags;
  this.onFlagCheck = onFlagCheck;
  this.onChoices = onChoices;
  this.content = content;
  this.choices = choices;
  this.onComplete = onComplete;
  this.setFlags = setFlags;
  this.nextId = nextId;
  this.actionText = actionText;
}

Dialog.instances = [];
Dialog.flags = {};

/**
 * Creates a dialog instance
 */
Dialog.create = function create (id, characterId, faceId, type, needFlags, onFlagCheck, onChoices, content, choices, onComplete, setFlags, nextId, actionText) {
  var instance = new Dialog(id, characterId, faceId, type, needFlags, onFlagCheck, onChoices, content, choices, onComplete, setFlags, nextId, actionText);
  this.instances.push(instance);
  return instance;
};

/**
 * Gets a dialog instance
 */
Dialog.get = function get (dialogId) {
  return getInstance(dialogId, this.instances);
};

/*
## Dialog logic flow

```
Interact with Dialog Generator
     |
     v
Gather all dialogs for that UID and do the following for each until the first match is made
     |
     v
Check if needFlags is fulfilled
     |
     +--> false? --> fail
     |
     v
If onFlagCheck is set, execute
     |
     +--> false? --> fail
     |
     v
If onChoices is set, execute
     |
     +-> string? --> populate choices with string
     |
     v
Display content (one pipe at a time), character, and face
     |
     +--> pipe remaining > 0? --> display next pipe on next action
     |
     +--> choices set? --> display choices
     |
     v
If onComplete is set, execute
     |
     v
If setFlags is set, set them
*/

/**
 * Gets the most valid dialog for a character.
 */
Dialog.process = function process (characterId, check) {
  var dialogs = [];
  var character;
  var list;

  if(characterId instanceof Dialog) {
    // Execute a specific dialog
    character = Character.get(characterId.characterId);
    list = [characterId];
    check = false;
  } else {
    // Check all possible dialogs
    character = Character.get(characterId);
    list = this.instances;
  }

  var trigger = character.runtimeInstance.runtime.trigger;

  for (var i = 0, len = list.length; i < len; i++) {
    // Don't check dialog that aren't associated with the character
    if(list[i].characterId !== character.id) {
      continue;
    }

    var dialog = list[i];

    if(dialog.needFlags.length > 0) {
      var pass = true;

      // Check if all needFlags pass
      for (var j = 0, jLen = dialog.needFlags.length; j < jLen; j++) {
        // Loop through all need flags

        if (dialog.needFlags[j][0] === '-') {
          if (Dialog.flags[dialog.needFlags[j].substr(1)] === true) {
            // The needed flag was true, fail the check
            pass = false;
            break;
          }
        } else if (Dialog.flags[dialog.needFlags[j]] === undefined || Dialog.flags[dialog.needFlags[j]] === false || Dialog.flags[dialog.needFlags[j]] === null) {
          // The needed flag was not true, fail the check
          pass = false;
          break;
        }
      }
      
      if (!pass) {
        continue;
      }
    }

    if (dialog.onFlagCheck) {
      // The onFlagCheck event is set
      if (trigger(dialog.onFlagCheck, character.runtimeInstance)) {
        // The onFlag check failed, bail on this dialog
        continue;
      }
    }

    if (dialog.onChoices) {
      // The onChoices event is set
      var result = trigger(dialog.onChoices, character.runtimeInstance);
      if(result) {
        dialog.choices = result.split('|');
      }
    }

    // Display text code

    if (!check && dialog.onComplete) {
      // The onComplete event is set
      trigger(dialog.onComplete, character.runtimeInstance);
    }

    if (!check && dialog.setFlags.length > 0) {
      // Set flags
      for (var k = 0, len3 = dialog.setFlags.length; k < len3; k++) {
        // Loop through all need flags
        if(dialog.setFlags[k][0] === '!') {
          var flag = dialog.setFlags[k].substr(1);
          Dialog.flags[flag] = !Dialog.flags[flag];
        } else if(dialog.setFlags[k][0] === '-') {
          Dialog.flags[dialog.setFlags[k].substr(1)] = false;
        } else {
          Dialog.flags[dialog.setFlags[k]] = true;
        }
      }
    }

    // The dialog is rendered, leave the loop
    dialogs.push(dialog);
  }
  return dialogs;
};

function flagCheck(flag, value) {
  if(flag[0] === '!') {
    var flagText = flag.substr(1);
    Dialog.flags[flagText] = !Dialog.flags[flagText];
  } else if(dialog.setFlags[k][0] === '-') {
    Dialog.flags[dialog.setFlags[k].substr(1)] = false;
  } else {
    Dialog.flags[dialog.setFlags[k]] = true;
  }
}

/**
 *
 */
function loadFromJson (data) {
  var i;
  var len;

  for(i = 0, len = data.characters.length; i < len; i++) {
    // id, name
    Character.create(data.characters[i].id, data.characters[i].name);
  }

  for(i = 0, len = data.faces.length; i < len; i++) {
    // id, name, characterId, frameId
    Face.create(data.faces[i].id, data.faces[i].name, data.faces[i].characterId, data.faces[i].frameId); 
  }

  for(i = 0, len = data.dialogs.length; i < len; i++) {
    // (id, characterId, faceId, needFlags, onFlagCheck, onChoices, text, choices, onComplete, setFlags, nextId
    Dialog.create(data.dialogs[i].id, data.dialogs[i].characterId, data.dialogs[i].faceId, data.dialogs[i].type, data.dialogs[i].needFlags, data.dialogs[i].onFlagCheck, data.dialogs[i].onChoices, data.dialogs[i].content, data.dialogs[i].choices, data.dialogs[i].onComplete, data.dialogs[i].setFlags, data.dialogs[i].nextId, data.dialogs[i].actionText);
  }

  Dialog.flags = data.flags;
}