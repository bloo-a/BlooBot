const Discord = require("discord.js");

exports.run = (client, message, args) => {
  const embed = new Discord.RichEmbed()
    .setTitle("Ban")
    .setColor("#86FFF2")
    .setDescription("Ban a user\n**Parameters:**")
    .addField("User",
              "The user to be banned", true)
    .addField("Duration",
              "The duration of the ban", true)
    .addField("Reason",
              "The reason for ban", true);

  message.channel.send({embed});
};
