var redditWatcher = (function()
{
    var RedditWatcher = {};

    var log = require("./logger.js");
    var utils = require("./utils.js");
    var Rockets = require("rockets");
    var client = new Rockets();

    var bot = null;
    var channel = null;

    var subreddit = "opticgaming";//todo implement as array
    var baseRedditUrl = "http://reddit.com"
    var baseCommentUrl = baseRedditUrl + "/r/" + subreddit + "/comments/"

    RedditWatcher.setChannel = function(channelid)
    {
        channel = channelid;
    };

    RedditWatcher.start = function(discordBot)
    {
        if((typeof discordBot === "undefined" || discordBot === null) && bot === null)
        {
            log.error("Trying to start connection without the bot being set.");
            throw "Bot is not set.";
        }

        bot = discordBot;

        setUpEventListeners();
        // Initiate the client's socket connection.
        client.connect();
    };

    RedditWatcher.stop = function()
    {
        client.disconnect();
    }

    function setUpEventListeners()
    {
        // Register events on the client.
        client.on("connect", function()
        {
            var include = {
                subreddit: subreddit
            };

            var exclude = {
            };

            // Subscribe to the 'comments' and 'posts' channels.
            client.subscribe("posts", include, exclude);
            client.subscribe("comments", include, exclude);
        });

        client.on("comment", function(comment)
        {
            // Do something using the comment data.
            var text = utils.bold(utils.underline("New Comment:")) +
                        "\nAuthor: " + comment.data.author +
                        "\nBody: " + comment.data.body +
                        "\nLink: " + getCommentUrl(comment.data.subreddit, comment.data.link_id, comment.data.link_title, comment.data.id);
            log.debug(text);
            bot.sendMessage(channel, text);
        });

        client.on("post", function(post)
        {
            // Do something using the post data.
            var text = utils.bold(utils.underline("New Post:")) +
                        "\nAuthor: " + post.data.author +
                        "\nTitle: " + post.data.title +
                        "\nLink: " + getPostUrl(post.data.permalink);
            log.debug(text);
            bot.sendMessage(channel, text);
        });

        client.on("error", function(err)
        {
            log.error(err);
        });

        client.on("disconnect", function()
        {
            log.important("Reddit Watcher disconnected!");
            client.reconnect();
        });
    }

    function getCommentUrl(subreddit, linkId, linkTitle, commentId)
    {
        if(linkId.lastIndexOf("t3_", 0) === 0)
        {
            linkId = linkId.substr(3);
        }

        if(commentId.lastIndexOf("t1_", 0) === 0)
        {
            commentId = commentId.substr(3);
        }

        if(typeof linkTitle !== "undefined")
        {
            if(linkTitle.length > 20)
            {
                linkTitle = linkTitle.substr(0, 20);
            }
            linkTitle = linkTitle.replace(/ /g, "_").replace("[", "").replace("]", "").toLowerCase();
        }
        else
        {
            linkTitle = "title";
        }

        return encodeURI(baseRedditUrl + "/r/" + subreddit + "/comments/" + linkId + "/" + linkTitle + "/" + commentId);
    }

    function getPostUrl(permaLink)
    {
        return encodeURI(baseRedditUrl + permaLink);
    }

    return RedditWatcher;
}());

module.exports = redditWatcher;
