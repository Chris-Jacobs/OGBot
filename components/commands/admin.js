var adminCommands = (function()
{
    var Commands = {};

    var log = require("../logger.js");
    var utils = require("../utils.js");
    var BotCommand = require("../../models/command.js");
    var Permissions = BotCommand.CommandPermissions;

    Commands.debug = {
        usage: "[flag]",
        description: "Gets the log files for given channel and date.",
        cooldown: 0,
        permission: Permissions.ADMIN,
        deleteAfterExecute: true,
        process: function(discordServer, bot, msg, suffix)
        {
            if(suffix === "true")
            {
                app.isDebug = true;
                log.important("Running in debug mode!");
                utils.sendMessage(bot, msg.channel, "Now running in debug mode.");
            }
            else
            {
                app.isDebug = false;
                log.important("No longer running in debug mode!");
                utils.sendMessage(bot, msg.channel, "No longer running in debug mode.");
            }
        }
    };

    Commands.disable = {
        usage: "",
        description: "Disables the bot."
        cooldown: 0,
        permission: Permissions.ADMIN,
        deleteAfterExecute: true,
        process: function(discordServer, bot, msg)
        {
            //TODO
            throw "Not Yet Implemented";
        }
    };

    Commands.enable = {
        usage: "",
        description: "Enables the bot."
        cooldown: 0,
        permission: Permissions.ADMIN,
        deleteAfterExecute: true,
        process: function(discordServer, bot, msg)
        {
            //TODO
            throw "Not Yet Implemented";
        }
    };

    Commands.idle = {
        usage: "",
        description: "Sets the status of the bot to idle."
        cooldown: 0,
        permission: Permissions.ADMIN,
        deleteAfterExecute: true,
        process: function(discordServer, bot, msg)
        {
            //TODO
            throw "Not Yet Implemented";
        }
    };

    Commands.online = {
        usage: "",
        description: "Sets the status of the bot to online."
        cooldown: 0,
        permission: Permissions.ADMIN,
        deleteAfterExecute: true,
        process: function(discordServer, bot, msg)
        {
            //TODO
            throw "Not Yet Implemented";
        }
    };

    Commands.servers = {
        usage: "",
        description: "Returns all the servers the bot is a member of."
        cooldown: 0,
        permission: Permissions.ADMIN,
        deleteAfterExecute: true,
        process: function(discordServer, bot, msg)
        {
            //TODO
            throw "Not Yet Implemented";
        }
    };

    Commands.uptime = {
        usage: "",
        description: "Gets the time the bot has been running since the last restart."
        cooldown: 0,
        permission: Permissions.ADMIN,
        deleteAfterExecute: true,
        process: function(discordServer, bot, msg)
        {
            //TODO
            throw "Not Yet Implemented";
        }
    };

    Commands.userid = {
        usage: "[user]",
        description: "Gets id of the given user."
        cooldown: 0,
        permission: Permissions.ADMIN,
        deleteAfterExecute: true,
        process: function(discordServer, bot, msg, suffix)
        {
            //TODO
            throw "Not Yet Implemented";
        }
    };

    return Commands;
}());

module.exports = adminCommands;
