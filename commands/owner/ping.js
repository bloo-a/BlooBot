exports.run = (client, message, args) => {
      message.channel.send("pong! `"+ Math.round(client.ping) + "ms`");
};
