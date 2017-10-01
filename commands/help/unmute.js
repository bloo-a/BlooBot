const Discord = require("discord.js");

exports.run = (client, message, args) => {
  const embed = new Discord.RichEmbed()
  .setTitle("Unmute")
  .setColor("#86FFF2")
  .setDescription("Unmute a muted user in a text or voice channel\n**Parameters:**")
  .addField("User",
            "The user to be unmuted", true);
  message.channel.send({embed});
};
