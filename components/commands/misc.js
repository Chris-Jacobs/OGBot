var miscCommands = (function()
{
    var Commands = {};

    var qs = require("querystring");
    var request = require("request");
    var Imgflipper = require("imgflipper");

    var log = require("../logger.js");
    var utils = require("../utils.js");
    var BotCommand = require("../../models/command.js");
    var Permissions = BotCommand.CommandPermissions;

    var giphy_config = {
        "api_key": "dc6zaTOxFJmzC",
        "rating": "pg-13",
        "url": "http://api.giphy.com/v1/gifs/random",
        "permission": ["NORMAL"]
    };

    //https://api.imgflip.com/popular_meme_ids
    var memeKeys = {
    	"brace": 61546,
    	"mostinteresting": 61532,
    	"fry": 61520,
    	"onedoesnot": 61579,
    	"yuno": 61527,
    	"success": 61544,
    	"allthethings": 61533,
    	"doge": 8072285,
    	"drevil": 40945639,
    	"skeptical": 101711,
    	"notime": 442575,
    	"yodawg": 101716
    };

    Commands.flipcoin = {
        usage: "",
        description: "",
        cooldown: 10,
        permission: Permissions.EVERYONE,
        deleteAfterExecute: true,
        process: function(discordServer, bot, msg)
        {
            //TODO
            throw "Not Yet Implemented";

            var text = "Flipping a coin ...";
            utils.sendMessage(bot, msg.channel, text);

            setTimeout(function()
            {
                var rnd = Math.floor(Math.random() * 2);
                var coinText = "It's ";

                if(rnd === 0)
                {
                    coinText += "heads!";
                }
                else
                {
                    coinText += "tails!";
                }

                utils.sendMessage(bot, msg.channel, coinText);
            }, 1500);
        }
    };

    Commands.gif = {
        usage: "",
        description: "",
        cooldown: 10,
        permission: Permissions.EVERYONE,
        deleteAfterExecute: true,
        process: function(discordServer, bot, msg, suffix)
        {
            var params = {
                "api_key": Shared.giphy_config.api_key,
                "rating": Shared.giphy_config.rating,
                "format": "json",
                "limit": 1
            };
            var query = qs.stringify(params);
            var tags = suffix.split(" ");

            if (tags !== null)
        	{
                query += "&tag=" + tags.join("+");
            }

            request(Shared.giphy_config.url + "?" + query, function (error, response, body)
            {
                if (error || response.statusCode !== 200)
        		{
                    log.error("Error trying to get giphy gif: " + body);
                    log.error(error);
                }
                else
        		{
                    try
        			{
                        var responseObj = JSON.parse(body);
                        utils.sendMessage(bot, msg.channel, "http://media.giphy.com/media/" + responseObj.data.id + "/giphy.gif [Tags: " + (tags !== "" ? tags : "Random GIF") + "]");
                    }
                    catch(err)
        			{
                        utils.sendMessage(bot, msg.channel, "Invalid tags, try something different. [Tags: " + (tags ? tags : "Random GIF") + "]");
                    }
                }
            });
        }
    };

    Commands.meme = {
        usage: "",
        description: "",
        cooldown: 20,
        permission: Permissions.EVERYONE,
        deleteAfterExecute: false,
        process: function(discordServer, bot, msg, suffix)
        {
            //TODO
            throw "Not Yet Implemented";

            var tags = msg.content.split("\"");
            var memetype = tags[0].split(" ")[1];
            var imgflipper = new Imgflipper(shared.authDetails.imgflip_username, shared.authDetails.imgflip_password);
            imgflipper.generateMeme(shared.meme[memetype], tags[1]?tags[1]:"", tags[3]?tags[3]:"", function(err, image)
            {
                utils.sendMessage(bot, msg.channel, image);
            });
        }
    };

    Commands.rolldice = {
        usage: "",
        description: "",
        cooldown: 10,
        permission: Permissions.EVERYONE,
        deleteAfterExecute: true,
        process: function(discordServer, bot, msg, suffix)
        {
            //TODO
            throw "Not Yet Implemented";

            var sides = 6;

            if(suffix !== "" && !isNaN(suffix))
            {
                sides = parseInt(suffix);
                sides = sides < 2 ? 2 : sides;
                sides = sides > 1000000 ? 1000000 : sides;
            }

            var text = "Rolling a die ...";
            bot.sendMessage(msg.channel, text);

            setTimeout(function()
            {
                var rnd = Math.floor(Math.random() * sides) + 1;
                var diceText = "Rolled " + rnd;

                bot.sendMessage(msg.channel, diceText);
            }, 3000);
        }
    };

    return Commands;
}());

module.exports = miscCommands;
