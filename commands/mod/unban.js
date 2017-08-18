const Discord = require("discord.js");

exports.run = (client, message, args) => {
  if (message.content == "~unban"){
    const embed = new Discord.RichEmbed()
      .setTitle("Unban")
      .setColor("#86FFF2")
      .setDescription("Unban a user\n**Parameters:**")
      .addField("User",
                "The user to be unbanned", true);

    message.channel.send({embed});
  }
  else {
    let member = message.content.split(/\s+/g)[1];
    let membername = member.user.username;
    member.unban();
    const embed = new Discord.RichEmbed()
      .setTitle('Unbanned '+membername)
      .setColor("#CE1126")
      .setDescription(membername+ " is no longer banned");
    message.channel.send({embed});
  }
};
