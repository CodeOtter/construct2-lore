/**
 * Face constructor
 */
function Face(id, name, characterId, frameId) {
  this.id = id;
  this.name = name;
  this.characterId = characterId;
  this.frameId = frameId;
}

Face.instances = [];

/**
 * Creates a face instance
 */
Face.create = function create (id, name, characterId, frameId) {
  var instance = new Face(id, name, characterId, frameId);
  this.instances.push(instance);
  return instance;
};

/**
 * Gets a face instance
 */
Face.get = function get (faceId) {
  return getInstance(faceId, this.instances);
};

/**
 * Gets all faces by character
 */
Face.getFaces = function getFace (characterId) {
  var result = [];
  for (var i = 0, len = instances.length; i < len; i++) {
    if (instances[i].characterId === characterId) {
      result.push(instances[i]);
    }
  }
  return result;
};