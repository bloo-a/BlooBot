const Discord = require("discord.js");
const config = require("../../config.json");

exports.run = (client, message, args) => {
  if (message.content == "~unmute"){
    const embed = new Discord.RichEmbed()
    .setTitle("Unmute")
    .setColor("#86FFF2")
    .setDescription("Unmute a muted user in a text or voice channel\nParameters:")
    .addField("User",
              "The user to be unmuted", true);
    message.channel.send({embed});
  }
  else {
    let member = message.mentions.members.first();
    let membername = member.user.username;
    let muteRole = message.guild.roles.find("name", "Muted");

    member.removeRole(muteRole.id);
    member.setMute(false);
    message.channel.send(member.user.toString() + ", You are no longer muted!");
  }
};
