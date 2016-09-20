var app = (function()
{
    var App = {};

    var log = require("./components/logger.js");

    var startTime = Date.now();

    App.isDebug = false;
    App.DebugSettings = require("./config/debug.json");

    App.init = function()
    {
        log.info("Started");

        if(process.argv.length >= 3 && process.argv[2] === "--debug")
        {
			App.isDebug = true;
            log.debug("Running in debug mode.");
        }

        startBot();
    };

    App.exit = function(level)
    {
        if(level === 1)
            log.error("Stopping Bot because of an error")
        else
            log.info("Stopping bot");

        if(isNaN(level))
            level = 0;

        process.exit(level);
    };

    function startBot()
    {
        var opticBot = require("./opticbot.js");
        opticBot.login();
    }

    App.getUptime = function()
    {
        var moment = require("moment");

        return moment().diff(moment(startTime));
    };

    return App;
}());

global.app = app;

app.init();
//opticDrive.findFile("ddt");




/*database.getServer("123", function(server)
{
    log.info(JSON.stringify(server));
    var testServer = server;
    testServer.commands.push({
        name: "newCommand",
        enabled: true,
        cooldown: 20
    });

    log.info("-----------------");
    log.info(JSON.stringify(testServer));
    log.info("-----------------");

    database.updateServer(testServer, function(server)
    {
        if(server === "failed")
        {
            log.error("Failed to update server with key " + testServer.key);
        }
        else
        {
            database.getServer("123", function(server)
            {
                log.info("---------------------");
                log.important(JSON.stringify(server));
            });
        }
    });
});*/

//opticBot.login();
