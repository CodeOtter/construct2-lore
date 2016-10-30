function GetBehaviorSettings()
{
	return {
		name: 'Lore',
		id: 'Lore',
		version: '1.0',
		description: 'Adds dialog features to an entity.',
		author:	'CodeOtter',
		'help url':	'http://www.github.com/codeotter',
		dependency: 'character.js;face.js;dialog.js;hero.js',
		category:	'Game Design',
		type: 'object'
	};
}

//////////////////////////////////////////////////////////////
// Conditions
AddCondition(0, 0, "Is action available", "", "{my} has action available", "True when action is available.", "ActionAvailable");
AddCondition(1, 0, "Has started action", "", "{my} has started action", "True when action is available.", "HasStartedAction");
AddCondition(2, 0, "Has ended action", "", "{my} has ended action", "True when action is available.", "HasEndedAction");
AddCondition(3, 0, "Has iterated action", "", "{my} has iterated action", "True when action is available.", "HasIteratedAction");
AddNumberParam("Choice index", "Choose the choice index.");
AddNumberParam("Dialog ID", "Choose the Dialog ID to look for."); 
AddCondition(4, 0, "Has made choice", "", "{my} has made a choice", "True when action makes a certain choice at a specific action event.", "HasMadeChoice");

//AddCmpParam("Comparison", "Choose the way to compare the current speed.");
//AddNumberParam("Speed", "The speed, in pixels per second, to compare the current speed to.");
//AddCondition(1, 0, "Compare speed", "", "{my} speed {0} {1}", "Compare the current speed of the object.", "CompareSpeed");

//////////////////////////////////////////////////////////////
// Actions

AddAction(0, 0, 'Engage action', 'Action', 'Engages in Action with the target', 'EngageAction');

AddStringParam("Flag", "The name of the flag to set");
AddComboParamOption("True");
AddComboParamOption("False");
AddComboParam("State", "Set the flag to true or false.");
AddAction(1, 0, 'Set flag', 'Action', 'Sets a flag', 'SetFlag');

/*

AddAction(0, 0, "Stop", "", "Stop {my}", "Set the speed to zero.", "Stop");
AddAction(1, 0, "Reverse", "", "Reverse {my}", "Invert the direction of motion.", "Reverse");

AddComboParamOption("Stop ignoring");
AddComboParamOption("Start ignoring");
AddComboParam("Input", "Set whether to ignore the controls for this movement.");
AddAction(2, 0, "Set ignoring input", "", "{0} {my} user input", "Set whether to ignore the controls for this movement.", "SetIgnoreInput");

AddNumberParam("Speed", "The new speed of the object to set, in pixels per second.");
AddAction(3, 0, "Set speed", "", "Set {my} speed to <i>{0}</i>", "Set the object's current speed.", "SetSpeed");

AddNumberParam("Max Speed", "The new maximum speed of the object to set, in pixels per second.");
AddAction(4, 0, "Set max speed", "", "Set {my} maximum speed to <i>{0}</i>", "Set the object's maximum speed.", "SetMaxSpeed");

AddNumberParam("Acceleration", "The new acceleration of the object to set, in pixels per second per second.");
AddAction(5, 0, "Set acceleration", "", "Set {my} acceleration to <i>{0}</i>", "Set the object's acceleration.", "SetAcceleration");

AddNumberParam("Deceleration", "The new deceleration of the object to set, in pixels per second per second.");
AddAction(6, 0, "Set deceleration", "", "Set {my} deceleration to <i>{0}</i>", "Set the object's deceleration.", "SetDeceleration");

AddComboParamOption("Left");
AddComboParamOption("Right");
AddComboParamOption("Up");
AddComboParamOption("Down");
AddComboParam("Control", "The movement control to simulate pressing.");
AddAction(7, 0, "Simulate control", "", "Simulate {my} pressing {0}", "Control the movement by events.", "SimulateControl");

AddComboParamOption("Disabled");
AddComboParamOption("Enabled");
AddComboParam("State", "Set whether to enable or disable the behavior.");
AddAction(8, 0, "Set enabled", "", "Set {my} <b>{0}</b>", "Set whether this behavior is enabled.", "SetEnabled");

AddNumberParam("Vector X", "The X component of motion to set, in pixels per second.");
AddAction(9, 0, "Set vector X", "", "Set {my} vector X to <b>{0}</b>", "Set the X component of motion.", "SetVectorX");

AddNumberParam("Vector Y", "The Y component of motion to set, in pixels per second.");
AddAction(10, 0, "Set vector Y", "", "Set {my} vector Y to <b>{0}</b>", "Set the Y component of motion.", "SetVectorY");
*/
//////////////////////////////////////////////////////////////
// Expressions

AddExpression(0, ef_variadic_parameters, "Get Action Text", "", "ActionText", "The action text for the Hero Action at a specific 0-based index.");
AddExpression(1, ef_variadic_parameters, "Get flag", "", "GetFlag", "Gets a flag.");

/*
AddExpression(0, ef_return_number, "Get flag", "", "Speed", "The current object speed, in pixels per second.");
AddExpression(1, ef_return_number, "Get max speed", "", "MaxSpeed", "The maximum speed setting, in pixels per second.");
AddExpression(2, ef_return_number, "Get acceleration", "", "Acceleration", "The acceleration setting, in pixels per second per second.");
AddExpression(3, ef_return_number, "Get deceleration", "", "Deceleration", "The deceleration setting, in pixels per second per second.");
AddExpression(4, ef_return_number, "Get angle of motion", "", "MovingAngle", "The current angle of motion, in degrees.");
AddExpression(5, ef_return_number, "Get vector X", "", "VectorX", "The current X component of motion, in pixels per second.");
AddExpression(6, ef_return_number, "Get vector Y", "", "VectorY", "The current Y component of motion, in pixels per second.");
*/
ACESDone();

// Property grid properties for this plugin
var property_list = [
	new cr.Property(ept_text, 'Character', '', 'The character name for this entity', "")
];
	
// Called by IDE when a new behavior type is to be created
function CreateIDEBehaviorType()
{
	return new IDEBehaviorType();
}

// Class representing a behavior type in the IDE
function IDEBehaviorType()
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
}

// Called by IDE when a new behavior instance of this type is to be created
IDEBehaviorType.prototype.CreateInstance = function CreateInstance (instance)
{
	return new IDEInstance(instance, this);
};

// Class representing an individual instance of an object in the IDE
function IDEInstance(instance, type)
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
	
	// Save the constructor parameters
	this.instance = instance;
	this.type = type;
	
	// Set the default property values from the property table
	this.properties = {};
	
	for (var i = 0; i < property_list.length; i++) {
		this.properties[property_list[i].name] = property_list[i].initial_value;
	}
}

// Called by the IDE after all initialization on this instance has been completed
IDEInstance.prototype.OnCreate = function OnCreate () {};

// Called by the IDE after a property has been changed
IDEInstance.prototype.OnPropertyChanged = function OnPropertyChanged (property_name)
{
	// Set initial value for "default controls" if empty (added r51)
	/*
	if (property_name === "Default controls" && !this.properties["Default controls"]) {
		this.properties["Default controls"] = "Yes";
	}
	*/
};