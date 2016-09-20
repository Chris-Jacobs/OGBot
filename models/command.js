var command = (function()
{
    function Command(options)
    {
        this.name = options.name || null;
        this.description = options.description || "";
        this.usage = options.usage || "";
        this.cooldown = defaultFor(options.cooldown, 0);
        this.permission = options.permission || [];
        this.deleteAfterExecute = options.deleteAfterExecute === true;
        this.aliases = options.aliases || [];
    }

    function defaultFor(value, defaultVal)
    {
        return typeof value !== "undefined" ? value : defaultVal;
    }

    return Command;
}());

var CommandPermissions = {
    EVERYONE: "everyone",
    MODERATOR: "moderator",
    ADMIN: "admin"
};

exports.Command = command;
exports.CommandPermissions = CommandPermissions;
