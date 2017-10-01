const Discord = require("discord.js");

exports.run = (client, message, args) => {
  if (message.content == "~demod"){
    const embed = new Discord.RichEmbed()
      .setTitle("Demod")
      .setColor("#86FFF2")
      .setDescription("Removes a users mod role\n**Parameters:**")
      .addField("User",
                "The user to be demodded", true);
    message.channel.send({embed});
  }
  else {
    let member = message.mentions.members.first();
    let membername = member.user.username;
    let modRole = message.guild.roles.find("name", "BlooBot's Daddy");

    member.removeRole(modRole.id);
    const embed = new Discord.RichEmbed()
      .setTitle('Demodded '+membername)
      .setDescription(membername + " is no longer a Mod!")
      .setColor("#CE1126");
    message.channel.send({embed});
  }
};
