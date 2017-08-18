const Discord = require("discord.js");
const config = require("../../config.json");

exports.run = (client, message, args) => {
  if (message.content == "~mod"){
    const embed = new Discord.RichEmbed()
      .setTitle("Mod")
      .setColor("#86FFF2")
      .setDescription("Gives a user a mod role\n**Parameters:**")
      .addField("User",
                "The user to be modded", true);
    message.channel.send({embed});
  }
  else {
    let member = message.mentions.members.first();
    let membername = member.user.username;
    let modRole = message.guild.roles.find("name", "BlooBot's Daddy");
    var hereRole = message.guild.roles.get('name', 'here');

    member.addRole(modRole.id);
    const embed = new Discord.RichEmbed()
      .setTitle('Modded '+membername)
      .setDescription(membername + " is now a Mod!")
      .setColor("#CE1126");
    message.channel.send({embed});
  }
};
