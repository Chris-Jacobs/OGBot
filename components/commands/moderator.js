var moderatorCommands = (function()
{
    var Commands = {};

    var log = require("../logger.js");
    var utils = require("../utils.js");
    var BotCommand = require("../../models/command.js");
    var Permissions = BotCommand.CommandPermissions;

    Commands["ignore-channel"] = {
        usage: "",
        description: "Tells the bot to listen for commands on the current channel."
        cooldown: 0,
        permission: Permissions.MODERATOR,
        deleteAfterExecute: true,
        process: function(discordServer, bot, msg)
        {
            //TODO
            throw "Not Yet Implemented";
        }
    };

    Commands.logs = {
        usage: "[channel] [yyyy-mm-dd]",
        description: "Gets the log files for given channel and date.",
        cooldown: 0,
        permission: Permissions.MODERATOR,
        deleteAfterExecute: false,
        process: function(discordServer, bot, msg, suffix)
        {
            var moment = require("moment");
            var split = suffix.split(" ");

            if(split.length < 2)
            {
                //invalid command usage
                utils.sendMessage(bot, msg.channel, "Invalid usage of command.");
                return;
            }

            var channelString = split[0];
            var dateString = split[1];

            var channelName = utils.getChannelNameFromId(msg.channel.server, utils.getChannelFromMessage(bot, msg, channelString));

            if(channelName === null)
            {
                utils.sendMessage(bot, msg.channel, "Channel is invalid.");
                return;
            }

            var parsedDate = moment(dateString, "YYYY-MM-DD");

            if(!parsedDate.isValid())
            {
                utils.sendMessage(bot, msg.channel, "Not a valid date.");
                return;
            }

            var logsPath = "storage/logs/";
            logsPath += msg.channel.server.name + "_" + msg.channel.server.id + "/";
            var filename = msg.channel.name + "_" + parsedDate.format("YYYY-MM-DD") + ".txt";
            logsPath += filename;

            if(utils.isFile(logsPath))
            {
                try
                {
                    utils.sendFile(bot, msg.channel, logsPath, filename, "");
                }
                catch(e)
                {
                    log.error("Unable to send file " + logsPath + "\n" + e.stack);
                }
            }
            else
            {
                utils.sendMessage(bot, msg.channel, "Couldn't find log file for given channel and date.");
            }
        }
    };

    Commands.mainchannel = {
        usage: "[channel]",
        description: "Sets the main channel for this server.",
        cooldown: 0,
        permission: Permissions.MODERATOR,
        deleteAfterExecute: false,
        process: function(discordServer, bot, msg, suffix)
        {
            var channelId = utils.getChannelFromMessage(bot, msg, suffix);

            if(channelId === null)
            {
                utils.sendMessage(bot, msg.channel, "Channel is invalid.");
                return;
            }

            discordServer.mainChannel = channelId;
            discordServer.save(function()
            {
                utils.sendMessage(bot, msg.channel, "Successfully updated the main channel.");
            });
        }
    };

    Commands.modchannel = {
        usage: "[channel]",
        description: "Sets the moderator channel for this server. This channel is user for command like !report or to notify if a user changed his/her username.",
        cooldown: 0,
        permission: Permissions.MODERATOR,
        deleteAfterExecute: false,
        process: function(discordServer, bot, msg, suffix)
        {
            var channelId = utils.getChannelFromMessage(bot, msg, suffix);

            if(channelId === null)
            {
                utils.sendMessage(bot, msg.channel, "Channel is invalid.");
                return;
            }

            discordServer.modChannel = channelId;
            discordServer.save(function()
            {
                utils.sendMessage(bot, msg.channel, "Successfully updated the mod channel.");
            });
        }
    };

    Commands.ruletext = {
        usage: "[rules]",
        description: "Sets the rules for the server."
        cooldown: 0,
        permission: Permissions.MODERATOR,
        deleteAfterExecute: true,
        process: function(discordServer, bot, msg, suffix)
        {
            //TODO
            throw "Not Yet Implemented";
        }
    };

    Commands["unignore-channel"] = {
        usage: "",
        description: "Tells the bot to not listen for commands on the current channel."
        cooldown: 0,
        permission: Permissions.MODERATOR,
        deleteAfterExecute: true,
        process: function(discordServer, bot, msg)
        {
            //TODO
            throw "Not Yet Implemented";
        }
    };

    Commands.welcomemsg = {
        usage: "[channel]",
        description: "Sets the moderator channel for this server. This channel is user for command like !report or to notify if a user changed his/her username.",
        cooldown: 0,
        permission: Permissions.MODERATOR,
        deleteAfterExecute: false,
        process: function(discordServer, bot, msg, suffix)
        {
            discordServer.welcomeMessage = suffix.trim();
            discordServer.save(function()
            {
                utils.sendMessage(bot, msg.channel, "Successfully updated the welcome message.");
            });
        }
    };

    return Commands;
}());

module.exports = moderatorCommands;
