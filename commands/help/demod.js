const Discord = require("discord.js");
const config = require("../../config.json");

exports.run = (client, message, args) => {
  const embed = new Discord.RichEmbed()
    .setTitle("Demod")
    .setColor("#86FFF2")
    .setDescription("Removes a users mod role\n**Parameters:**")
    .addField("User",
              "The user to be demodded", true);
  message.channel.send({embed});
};
