var commandHandler = (function()
{
    var CommandHandler = {};

    var log = require("./logger.js");
    var moment = require("moment");
    var utils = require("./utils.js");
    var database = require("./database.js");
    var commands = require("./command-list.js");

    var cooldowns = {};

    CommandHandler.processMessage = function(bot, msg)
    {
        //Check if admin?
        //Check if msg.author has permission to execute command --> in command listener moderator role || owner
        //TODO check if msg.author is ignored in server

        if(msg.author.id !== bot.user.id && msg.content[0] === "!" && utils.msgIsFromTextChannel(msg))
        {
            var cmdText = msg.content.split(" ")[0].substring(1);
	        var suffix = msg.content.substring(cmdText.length + 2);

            database.getServer(msg.channel.server.id, function(server)
            {
                if(server === null)
                {
                    log.error(msg.channel.server.name + " doesn't exist in the database");
                    return;
                }

                /*************************/
                /*Check if command exists*/
                /*************************/
                if(commands[cmdText])
                {
                    if(server.commands[cmdText] && server.commands[cmdText].enabled === false)
                    {
                        log.info("[" + cmdText + "] command on " + msg.channel.server.name + " is on disabled.");
                        sendMessage(bot, msg.channel, "This command is currently not enabled. Ask a moderator if you want to change this.");
                    }
                    else if(isOnCooldown(commands[cmdText], cmdText, msg))
                    {
                        log.info("[" + cmdText + "] command from " + msg.author.username + " is on cooldown.");
                        sendMessage(bot, msg.channel, msg.author + " , this command is still on cooldown for you.")
                    }
                    else
                    {
                        log.info("Processing [" + cmdText + "] command from " + msg.author.username + ".");
                        try
                        {
                            if(typeof commands[cmdText].process === "function")
                            {
                                commands[cmdText].process(server, bot, msg, suffix);
                                log.info(log.styleMessage("Processed", "green") + " [" + cmdText + "] command from " + msg.author.username + ".");
                                if(commands[cmdText].deleteAfterExecute === true)
                                {
                                    bot.deleteMessage(msg);
                                }
                                setCooldown(cmdText, msg.channel.server.id, msg.author.id)
                            }
                            else
                            {
                                log.error("Command [" + cmdText + "] has no process function");
                            }
                        }
                        catch(e)
                        {
                            log.error("Failed to process [" + cmdText + "] command from " + msg.author.username + ".\n" + e.stack);

                            if(app.isDebug)
                            {
                                //...
                            }
                        }
                    }
                }
                /*******************************************/
                /*Check if command is custom server command*/
                /*******************************************/
                else if(server.customCommands[cmdText])
                {
                    try
                    {
                        log.info("Found custom command [" + cmdText + "] for server " + server.name);

                        if(server.customCommands[cmdText].enabled === false)
                        {
                            log.info("[" + cmdText + "] command on " + msg.channel.server.name + " is disabled.");
                            sendMessage(bot, msg.channel, "This command is currently not enabled. Ask a moderator if you want to change this.");
                        }
                        else if(isOnCooldown(server.customCommands[cmdText], cmdText, msg))
                        {
                            log.info("[" + cmdText + "] command from " + msg.author.username + " is on cooldown.");
                            sendMessage(bot, msg.channel, msg.author + " , this command is still on cooldown for you.");
                        }
                        else
                        {
                            sendMessage(bot, msg.channel, server.customCommands[cmdText].text);
                            log.info(log.styleMessage("Processed", "green") + " [" + cmdText + "] custom command from " + msg.author.username + " on " + msg.channel.server.name + ".");
                        }
                    }
                    catch(e)
                    {
                        log.error("Failed to execute custom command [" + cmdText + "] for server " + server.name + "\n" + e.stack);
                    }
                }
            });
        }
    };

    function isOnCooldown(command, cmdText, msg)
    {
        //Check if command is on cooldown
        if(command.cooldown > 0 && cooldowns[cmdText] && cooldowns[cmdText][msg.channel.server.id] && cooldowns[cmdText][msg.channel.server.id][msg.author.id])
        {
            var lastCalled = moment(cooldowns[cmdText][msg.channel.server.id][msg.author.id]);
            var now = moment();
            var difference = now.diff(lastCalled, "seconds");

            if(difference < command.cooldown)
            {
                return true;
            }
            else
            {
                delete cooldowns[cmdText][msg.channel.server.id][msg.author.id]
                return false;
            }
        }
        else
        {
            return false;
        }
    }

    function setCooldown(cmdText, serverId, userId)
    {
        var userCooldown = {};
        userCooldown[userId] = moment();

        if(!cooldowns[cmdText])
        {
            var serverCooldown = {};
            serverCooldown[serverId] = userCooldown;

            cooldowns[cmdText] = serverCooldown;
        }
        else if(!cooldowns[cmdText][serverId])
        {
            cooldowns[cmdText][serverId] = userCooldown;
        }
        else
        {
            cooldowns[cmdText][serverId][userId] = moment();
        }
    }

    function sendMessage(bot, channel, message)
    {
        utils.sendMessage(bot, channel, message);
    }

    CommandHandler.getCommandCount = function()
    {
        return Object.keys(commands).length;
    };

    return CommandHandler;
}());

module.exports = commandHandler;
