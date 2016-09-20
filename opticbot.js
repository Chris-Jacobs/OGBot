var opticBot = (function()
{
    var OGBot = {};

    var log = require("./components/logger.js");
    var database = require("./components/database.js");
    var utils = require("./components/utils.js");
    var DiscordServer = require("./models/discord-server.js");
    var commandHandler = require("./components/command-handler.js");
    var chatLogger = require("./components/chat-logger.js");
    var redditWatcher = require("./components/reddit-watcher.js");
    var opticDrive = require("./components/opticgaming/optic-drive.js");

    var bot = null;
	var auth = null;

    var localLogs = {};
    var lastFlush = {};

	try
	{
        auth = require("./config/auth.json");
	}
	catch(e)
	{
		log.error("Please create an auth.json like example.auth.json in the config folder.");
		app.exit();
	}

    try
    {
    	var Discord = require("discord.js");
        bot = new Discord.Client({
            forceFetchUsers: true,
            autoReconnect: true
        });
        setUpEventListeners();
    }
    catch(e)
    {
    	log.error(e.stack);
    	log.error(process.version);
    	log.important("Please run npm install and ensure it passes with no errors!");
    	app.exit(1);
    }

    OGBot.login = function()
    {
		log.info("Connecting...");
		bot.loginWithToken(auth.botToken)
            .then(function()
            {
                log.info(log.styleMessage("OGBot", "green") + " logged in!");
            })
            .catch(function(err)
            {
                log.error("Failed to login OGBot\n" + e.stack);
            });
    };

    OGBot.logout = function()
    {
        log.info("Logging out OGBot...");
        bot.logout()
            .then(function()
            {
                log.important("OGBot logged out!");
            })
            .catch(function(err)
            {
                log.error("Failed to logout OGBot!\n" + err);
            });
    };

    function setUpEventListeners()
    {
        //invite link: https://discordapp.com/oauth2/authorize?client_id=178962986008969217&scope=bot&permissions=16886814
        bot.removeAllListeners("ready");
        bot.on("ready", function ()
        {
        	log.info("Ready to begin! Serving in " + bot.channels.length + " channels");
        	log.info("Loaded " + commandHandler.getCommandCount() + " chat commands.");

    		// Start reddit watcher
    		//redditWatcher.setChannel("150726338779545601");
    		//redditWatcher.start(bot);
        });

        bot.removeAllListeners("disconnected");
        bot.on("disconnected", function()
        {
        	log.warn("OGBot disconnected!");
        });

        bot.removeAllListeners("warn");
        bot.on("warn", function(warn)
        {
            log.warn("Discord Client warning: \n" + warn);
        });

        bot.removeAllListeners("error");
        bot.on("error", function(err)
        {
            //Mail to me?
            log.error("Discord Client error: \n" + err);
        });

        bot.removeAllListeners("message");
        bot.on("message", function(msg)
        {
            try
            {
                commandHandler.processMessage(bot, msg);

                chatLogger.saveMessageToLogs(msg);
            }
            catch(e)
            {
                log.error("Error in 'message' event\n" + e.stack);
            }
        });

        bot.removeAllListeners("messageUpdated");
        bot.on("messageUpdated", function(msg, updatedMsg)
        {
            try
            {
                //TODO
            }
            catch(e)
            {
                log.error("Error in 'messageUpdated' event\n" + e.stack);
            }
        });

        bot.removeAllListeners("messageDeleted");
        bot.on("messageDeleted", function(msg, channel)
        {
            try
            {
                //TODO
            }
            catch(e)
            {
                log.error("Error in 'messageDeleted' event\n" + e.stack);
            }
        });

        bot.removeAllListeners("serverCreated");
        bot.on("serverCreated", function(server)
        {
            //Joined new server
            try
            {
                addNewServer(server);
            }
            catch(e)
            {
                log.error("Error trying to add new server " + log.styleMessage("[" + server.name + "]", "magenta") + "\n" + e.stack);
            }
        });

        bot.removeAllListeners("presence");
        bot.on("presence", function(user, newUser)
        {
            try
            {
                notifyUserChanges(user, newUser);
            }
            catch(e)
            {
                log.error("Failed to notify server of user change:\n" + e.stack);
            }
        });

        bot.removeAllListeners("serverNewMember");
        bot.on("serverNewMember", function(server, member)
        {
            try
            {
                welcomeUser(server, member);
            }
            catch(e)
            {
                log.error("Error in 'serverNewMember' event.\n" + e.stack);
            }
        });

        bot.removeAllListeners("userBanned");
        bot.on("userBanned", function(user, server)
        {
            try
            {
                //TODO
            }
            catch(e)
            {
                log.error("Error in 'userBanned' event.\n" + e.stack);
            }
        });

        bot.removeAllListeners("userUnbanned");
        bot.on("userUnbanned", function(user, server)
        {
            try
            {
                //TODO
            }
            catch(e)
            {
                log.error("Error in 'userUnbanned' event.\n" + e.stack);
            }
        });
        /*
         * serverUpdated
         * serverDeleted

         * channelCreated
         * channelDeleted
         * channelUpdated

         * serverMemberUpdated
         */
    };

    function addNewServer(server)
    {
        var server = new DiscordServer({
            key: server.id,
            name: server.name
        });

        server.save(function(savedServer)
        {
            log.info("Successfully added new server " + log.styleMessage("[" + savedServer.name + "]", "magenta"));
        });
    }

    function notifyUserChanges(user, newUser)
    {
        if(user.username === newUser.username)
        {
            return;
        }

        var serverKeys = [];
        for(var i = 0; i < bot.servers.length; i++)
        {
            var clientServer = bot.servers[i];

            for(var j = 0; j < clientServer.members.length; j++)
            {
                var serverMember = clientServer.members[j];
                if(serverMember.id === newUser.id)
                {
                    serverKeys.push(clientServer.id);
                    break;
                }
            }
        }

        for(var x = 0; x < serverKeys.length; i++)
        {
            database.getServer(serverKeys[x], function(server)
            {
                if(server.moderationChannel !== null)
                {
                    bot.sendMessage(utils.getChannel(server.moderationChannel), newUser + " changed his/her name from " + utils.bold(user.username) + " to " + utils.bold(newUser.username));
                }
            });
        }
    }

    function welcomeUser(server, user)
    {
        database.getServer(server.id, function(dbServer)
        {
            if(dbServer === null)
            {
                log.error(server.name + " doesn't exist in the database");
                return;
            }

            if(dbServer.welcomeMessage !== null && dbServer.welcomeMessage !== "" && dbServer.mainChannel !== null && dbServer.mainChannel !== "")
            {
                utils.sendMessage(bot, dbServer.mainChannel, dbServer.welcomeMessage.replace("{{user}}", member));
            }
        });
    }

    return OGBot;
}());

module.exports = opticBot;
