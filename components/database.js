var database = (function()
{
    var DatabaseController = {};

    var DiscordServer = require("../models/discord-server.js");
    var log = require("./logger.js");
    var Datastore = require("nedb"),
        db = new Datastore({
            filename: "./storage/opticbot.db",
            autoload: true
        });

    var init = (function()
    {
        db.ensureIndex({fieldName: "key", unique: true}, function(err)
        {
            if(err !== null)
            {
                log.error("Failed to create index on fieldname 'key'");
            }
            else
            {
                log.debug("Successfully created a unique index on fieldname 'key'");
            }
        });
    }());

    DatabaseController.addServer = function(server, callback)
    {
        log.info("Adding server with key: " + server.key);
        db.insert(server, function(err, newServer)
        {
            if(typeof callback === "function")
            {
                if(err !== null)
                {
                    log.error("Error trying to add server to database:\n" + err);
                }
                else
                {
                    log.info("Added new server to database (key: " + server.key + ")");
                    callback(newServer);
                }
            }
        });
    };

    DatabaseController.removeServer = function(key, callback)
    {
        log.info("Removing server with key: " + key);
        db.remove({key: server.key}, {}, function(err, numRemoved)
        {
            if(typeof callback === "function")
            {
                callback();
            }
        });
    };

    DatabaseController.getServer = function(key, callback)
    {
        db.findOne({key: key}, function(err, server)
        {
            if(typeof callback === "function")
            {
                if(server !== null)
                {
                    var discordServer = new DiscordServer(server);
                    callback(discordServer);
                }
                else
                {
                    callback(server);
                }
            }
        });
    };

    DatabaseController.updateServer = function(server, callback)
    {
        log.info("Updating server with key: " + server.key);
        db.update({key: server.key}, server, {}, function(err, numReplaced)
        {
            if(typeof callback === "function")
            {
                if(err !== null)
                {
                    log.error(err);
                    callback("failed");
                }
                else
                {
                    callback(server);
                }
            }
        });
    };

    return DatabaseController;
}());

module.exports = database;
