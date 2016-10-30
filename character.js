/**
 * Gets an instance from an array of instances
 */
function getInstance (id, instances) {
  for (var i = 0, len = instances.length; i < len; i++) {
    if (instances[i].id === id) {
      return instances[i];
    }
  }
  return false;
}

/**
 * Character constructor
 */
function Character(id, name) {
  this.id = id;
  this.name = name;
  this.runtimeInstance = undefined;
}

Character.instances = [];

Character.activeInstances = [];

/**
 * Creates a character instance
 */
Character.create = function create (id, name) {
  var instance = new Character(id, name);
  this.instances.push(instance);
  return instance;
};

/**
 * Gets a character instance
 */
Character.get = function get (characterId) {
  return getInstance(characterId, this.instances);
};

/**
 * Gets a character instance by name
 */
Character.getByName = function getByName (name) {
  for (var i = 0, len = this.instances.length; i < len; i++) {
    if (this.instances[i].name === name) {
      return this.instances[i];
    }
  }
  return false;
};

/**
 * Gets aall character names
 */
Character.getNames = function getNames () {
  var results = [];
  for (var i = 0, len = this.instances.length; i < len; i++) {
    results.push(this.instances[i].name);
  }
  return results;
};

/**
 * Returns a characters face by name.  If the name doesn't exist, return the default face frame.
 */
Character.prototype.getFace = function getFace (faceName) {
  var faces = Face.getFaces(this.id);
  for (var i = 0, len = faces.length; i < len; i++) {
    if (faces[i].name === faceName) {
      return faces[i];
    }
  }
  return new Face(null, faceName, this.characterId, 1);
};

/**
 * Gets other characters by the proximity of this one
 */
Character.prototype.getByProximity = function getByProximity (distance) {
  var result = [];
  var invDistance = -distance;

  for (var i = 0, len = Character.activeInstances.length; i < len; i++) {
    if(!Character.activeInstances[i].runtimeInstance) {
      continue;
    }

    var distX = Character.activeInstances[i].runtimeInstance.x - this.runtimeInstance.x;
    if(distX < distance && distX > invDistance) {
      var distY = Character.activeInstances[i].runtimeInstance.y - this.runtimeInstance.y;
      if(distX < distance && distX > invDistance) {
        result.push(Character.activeInstances[i]);
      } 
    }
  }

  return result;
};


/**
 * Returns all faces of a character
 */
Character.prototype.getFaces = function getFaces () {
  return Face.getFaces(this.id);
};

/**
 * Gets the current valid dialog for this character.
 */
Character.prototype.getDialogs = function getDialog () {
  return Dialog.process(this.id);
};