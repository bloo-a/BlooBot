const Discord = require("discord.js");

exports.run = (client, message, args) => {
  const embed = new Discord.RichEmbed()
    .setTitle("Unban")
    .setColor("#86FFF2")
    .setDescription("Unban a user\n**Parameters:**")
    .addField("User",
              "The user to be unbanned", true);

  message.channel.send({embed});
};
