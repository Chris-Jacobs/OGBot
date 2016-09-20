var commandList = (function()
{
    var allCommands = {};

    var log = require("./logger.js");

    var AdminCommands = require("./commands/admin.js");
    var GeneralCommands = require("./commands/general.js");
    var MiscCommands = require("./commands/misc.js");
    var ModeratorCommands = require("./commands/moderator.js");

    function applyCommands(commands)
    {
        for(var key in commands)
        {
            if(commands.hasOwnProperty(key))
            {
                allCommands[key] = commands[key];
            }
        }
    }

    applyCommands(setCommandsSubject(AdminCommands, "admin"));
    applyCommands(setCommandsSubject(GeneralCommands, "general"));
    applyCommands(setCommandsSubject(MiscCommands, "misc"));
    applyCommands(setCommandsSubject(ModeratorCommands, "moderator"));

    function setCommandsSubject(commands, subject)
    {
        for(var key in commands)
        {
            commands[key].subject = subject;
        }

        return commands;
    }

    return allCommands;
}());

module.exports = commandList;
