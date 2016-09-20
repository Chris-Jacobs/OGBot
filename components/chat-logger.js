var chatLogger = (function()
{
    var ChatLogger = {};

    var log = require("./logger.js");
    var utils = require("./utils.js");
    var moment = require("moment");

    var localLogs = {};
    var lastFlush = {};

    ChatLogger.disableFlush = false;

    ChatLogger.saveMessageToLogs = function(msg, callback)
    {
        if(!utils.msgIsFromTextChannel(msg))
        {
            return;
        }

        var serverIdentifier = msg.channel.server.name + "_" + msg.channel.server.id;
        var channelIdentifier = msg.channel.channel.name + "_" + moment().format("YYYY-MM-DD");

        if(!localLogs[serverIdentifier])
        {
            localLogs[serverIdentifier] = {};

            localLogs[serverIdentifier][channelIdentifier] = [];
        }

        if(!localLogs[serverIdentifier][channelIdentifier])
        {
            localLogs[serverIdentifier][channelIdentifier] = [];
        }

        if(!lastFlush[serverIdentifier + "_" + channelIdentifier])
        {
            lastFlush[serverIdentifier + "_" + channelIdentifier] = moment();
        }

        var chatLog = moment().format("DD-MM-YYYY HH:mm:ss") + "\r\n";
        chatLog += msg.author.username + "#" + msg.author.discriminator + " (id: " + msg.author.id + ")\r\n";
        chatLog += msg.cleanContent + "\r\n\r\n";

        localLogs[serverIdentifier][channelIdentifier].push(chatLog);

        var lastFlushCalled = moment(lastFlush[serverIdentifier + "_" + channelIdentifier]);
        var now = moment();
        var minuteDifference = now.diff(lastFlushCalled, "minutes");
        var dayDifference = now.diff(lastFlushCalled, "days");

        if(!ChatLogger.disableFlush && (localLogs[serverIdentifier][channelIdentifier].length > 100 || minuteDifference >= 10 || dayDifference >= 1))
        {
            try
            {
                log.debug("Flushing logs to file");
                flushToFile(serverIdentifier, channelIdentifier, localLogs[serverIdentifier][channelIdentifier].join(""), callback);
                delete lastFlush[serverIdentifier + "_" + channelIdentifier];
                delete localLogs[serverIdentifier][channelIdentifier];
            }
            catch(e)
            {
                log.error("Error while trying to flush logs to file.\n" + e.stack);
            }
        }
        else if(typeof callback === "function")
        {
            callback();
        }
    };

    //TODO setup flush task (auto flush every 10 minutes or so?)

    ChatLogger.flushToFile = function(server, channel, chatLog, callback)
    {
        var moment = require("moment");

        var logsPath = "../storage/logs/";
        logsPath += server + "/";
        logsPath += channel + ".txt";

        appendToLogs(logsPath, chatLog, function(err)
        {
            if(err)
            {
                log.error("Error trying to append chat log general.\n" + err);
            }
            else
            {
                log.info("Successfully saved " + logsPath + ".");
            }

            if(typeof callback === "function")
            {
                callback();
            }
        });
    };

    function appendToLogs(path, content, callback)
    {
        var mkdirp = require("mkdirp");
        var fs = require("fs");
        var getDirName = require('path').dirname;

        mkdirp(getDirName(path), function(err)
        {
            if(err)
            {
                return callback(err);
            }

            fs.appendFile(path, content, callback);
        });
    }

    return ChatLogger;
}());

module.exports = chatLogger;
