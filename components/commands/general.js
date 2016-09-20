var generalCommands = (function()
{
    var Commands = {};

    var log = require("../logger.js");
    var utils = require("../utils.js");
    var BotCommand = require("../../models/command.js");
    var Permissions = BotCommand.CommandPermissions;

    Commands.help = {
        usage: "",
        description: "",
        cooldown: 60,
        permission: Permissions.EVERYONE,
        deleteAfterExecute: true,
        process: function(discordServer, bot, msg)
        {

        }
    };

    Commands.ping = {
        usage: "",
        description: "",
        cooldown: 20,
        permission: Permissions.MODERATOR,
        deleteAfterExecute: false,
        process: function(discordServer, bot, msg)
        {
            utils.sendMessage(bot, msg.channel, "pong!");
        }
    }

    return Commands;
}());

module.exports = generalCommands;
