var server = (function()
{
    function Server(object)
    {
        this.key = object.key || null;
        this.name = object.name || null;
        this.adminRole = object.adminRole || null;
        this.mainChannel = object.mainChannel || null;
        this.modChannel = object.modChannel || null;
        this.commands = object.commands || {};
        this.customCommands = object.customCommands || {};
        this.ignoredPeople = object.ignoredPeople || [];
        this.welcomeMessage = object.welcomeMessage || null;
        this.rules = object.rules || [];
    }

    Server.prototype.save = function(callback)
    {
        var database = require("../components/database.js");
        var that = this;

        database.getServer(that.key, function(server)
        {
            if(server === null)
            {
                database.addServer(that, callback);
            }
            else
            {
                database.updateServer(that, callback);
            }
        });
    };

    Server.prototype.enableCommand = function(command)
    {
        _enableCommand(this, command, true);
    };

    Server.prototype.disableCommand = function(command)
    {
        _enableCommand(this, command, false);
    };

    function _enableCommand(server, command, flag)
    {
        if(server.commands.hasOwnProperty(command))
        {
            server.commands[command].enabled = flag
        }
    }

    Server.prototype.setCommandCooldown = function(command, cooldown)
    {
        if(server.commands.hasOwnProperty(command))
        {
            server.commands[command].cooldown = cooldown;
        }
    };

    Server.prototype.setCommandPermission = function(command, roles)
    {
        if(server.commands.hasOwnProperty(command))
        {
            server.commands[command].permission = roles;
        }
    };

    Server.prototype.subscribeToSubreddit = function()
    {
        //TODO
        throw "Not Yet Implemented";
    };

    Server.prototype.unsubscribeFromSubreddit = function()
    {
        //TODO
        throw "Not Yet Implemented";
    };

    Server.prototype.ignorePerson = function(userId)
    {
        //TODO
        throw "Not Yet Implemented";
    };

    Server.prototype.unignorePerson = function(userIs)
    {
        //TODO
        throw "Not Yet Implemented";
    };

    return Server;
}());

module.exports = server;
