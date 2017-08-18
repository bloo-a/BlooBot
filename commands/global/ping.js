exports.run = (client, message, args) => {
    message.channel.send("pong!"+ client.ping).catch(console.error);
};
