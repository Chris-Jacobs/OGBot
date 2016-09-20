var logger = (function()
{
    var Logger = {};

    var moment = require("moment");
    var chalk = require("chalk"),
        c = new chalk.constructor({
            enabled: true
        });

    Logger.info = function(msg)
    {
        console.log(prependDebugTag(getTimeStamp() + c.white(msg)));
    };

    Logger.important = function(msg)
    {
        console.log(prependDebugTag(getTimeStamp() + c.blue.underline.bgWhite(msg)));
    };

    Logger.warn = function(msg)
    {
        console.log(prependDebugTag(getTimeStamp() + c.yellow(msg)));
    };

    Logger.error = function(msg)
    {
        console.log(prependDebugTag(getTimeStamp() + c.red(msg)));
    };

    Logger.debug = function(msg)
    {
        if(app.isDebug === true)
        {
            console.log(c.green.bgBlack("[DEBUG]") + getTimeStamp() + c.green(msg));
        }
    }

    function getTimeStamp()
    {
        var timestamp = moment();

        return c.white.bgBlack("[" + timestamp.format("DD-MM-YYYY HH:mm:ss.SSS") + "]: ");
    }

    Logger.styleMessage = function()
    {
        var styledMessage = "";

        for(var i = 0; i < arguments.length; i++)
        {
            if(i === 0)
            {
                styledMessage = arguments[i];
            }
            else
            {
                var style = arguments[i];
                if(typeof c[style] === "function")
                {
                    styledMessage = c[style](styledMessage);
                }
            }
        }

        return styledMessage;
    };

    function prependDebugTag(msg)
    {
        if(app.isDebug === true)
        {
            return c.green.bgBlack("[DEBUG]") + msg;
        }
        else
        {
            return msg;
        }
    }

    return Logger;
}());

module.exports = logger;
