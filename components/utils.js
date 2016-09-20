var utils = (function()
{
    var Utils = {};

    var log = require("./logger.js");

    Utils.getChannel = function(channel)
    {
        if(app.isDebug === true)
        {
            return app.DebugSettings.debugChannel;
        }
        else
        {
            return channel;
        }
    };

    Utils.sendMessage = function(bot, channel, msg)
    {
        bot.sendMessage(Utils.getChannel(channel), msg);
    };

    Utils.sendFile = function(bot, channel, path, filename, msg)
    {
        bot.sendFile(Utils.getChannel(channel), path, filename, msg);
    };

    Utils.bold = function(text)
    {
        return "**" + text + "**";
    };

    Utils.underline = function(text)
    {
        return "__" + text + "__";
    };

    Utils.cursive = function(text)
    {
        return "_" + text + "_";
    };

    Utils.strikeout = function(text)
    {
        return "~~" + text + "~~";
    };

    Utils.codeBlock = function(text, multiline)
    {
        var md = "`";
        if(multiline === true)
        {
            md = "```";
        }

        return md + text + md;
    };

    Utils.msgIsFromTextChannel = function(msg)
    {
        return !msg.channel.isPrivate && msg.channel.hasOwnProperty("server");
    };

    Utils.getUserFromId = function(server, id)
    {
        for(var i = 0; i < server.members.length; i++)
        {
            var user = server.members[i];

            if(user.id === id)
            {
                return user;
            }
        }

        return null;
    };

    Utils.getChannelIdFromName = function(server, name)
    {
        for(var i = 0; i < server.channels.length; i++)
        {
            var channel = server.channels[i];

            if(channel.name === name)
            {
                return channel.id;
            }
        }

        return -1;
    };

    Utils.getChannelNameFromId = function(server, id)
    {
        for(var i = 0; i < server.channels.length; i++)
        {
            var channel = server.channels[i];

            if(channel.id === id)
            {
                return channel.name;
            }
        }

        return null;
    };

    Utils.getChannelFromMessage = function(bot, msg, suffix)
    {
        suffix = suffix.trim();
        if(suffix === null || suffix === "")
        {
            utils.sendMessage(bot, msg.channel, "Please specify a channel.");
            return;
        }

        var channelId = null;

        if(suffix[0] === "<" && suffix[suffix.length - 1] === ">")
        {
            channelId = suffix.substring(1, suffix.length - 1);
        }
        else
        {
            if(suffix[0] === "#")
            {
                suffix = suffix.substring(1);
            }

            channelId = Utils.getChannelIdFromName(msg.channel.server, suffix);
        }

        if(channelId.length > 0  && channelId[0] === "#")
        {
            channelId = channelId.substring(1);
        }

        return channelId;
    };

    Utils.escapeRegExp = function(string)
    {
        return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
    };

    Utils.containsWord = function(string, word)
    {
        var content = Shared.escapeRegExp(string);

        //return new RegExp('(?:[^.\w]|^|^\\W+)?' + word + '(?:[^.\w]|\\W(?=\\W+|$)|$)?').test(content);
        //return new RegExp(".*?(?:^|\s).*?(" + word + "[^\s$]*).*?").test(content);
        return new RegExp("\\b" + word + "\\b", "g").test(content);
    };

    Utils.isFile = function(path)
    {
        var fullPath = __dirname + "/../" + path;
        log.debug(fullPath);
        var fs = require('fs');
        try
        {
            fs.accessSync(fullPath, fs.R_OK);
            return true;
        }
        catch(e)
        {
            return false;
        }
    };

    return Utils;
}());

module.exports = utils;
