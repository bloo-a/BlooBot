const Discord = require("discord.js");

exports.run = (client, message, args) => {
  const embed = new Discord.RichEmbed()
    .setTitle("Kick")
    .setColor("#86FFF2")
    .setDescription("Kick a user\n**Parameters:**")
    .addField("User",
              "The user to be kicked", true)
    .addField("Reason",
              "The reason for kick", true);

  message.channel.send({embed});
};
