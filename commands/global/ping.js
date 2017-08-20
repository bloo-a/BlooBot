exports.run = (client, message, args, guild) => {
    message.channel.send("pong! `"+ Math.round(client.ping) + "ms`");
};
