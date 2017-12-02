const Discord = require("discord.js");

exports.run = (client, message, args) => {
  if (message.content == "~kick"){
    const embed = new Discord.RichEmbed()
      .setTitle("Kick")
      .setColor("#86FFF2")
      .setDescription("Kick a user\n**Parameters:**")
      .addField("User",
                "The user to be kicked", true)
      .addField("Reason",
                "The reason for kick", true);
    message.channel.send({embed});
  }
  else {
    let member = message.mentions.members.first();
    let reason = message.content.split(/\s+/g).slice(2).join(" ");
    let membername = member.user.username;
    if (member.id == message.guild.owner.id || member.id == process.env.botID){
      message.channel.send("*Nice try asshole*");
    }
    else {
      member.kick(reason);
      const embed = new Discord.RichEmbed()
        .setTitle('Kicked '+membername)
        .setColor("#CE1126")
        .setDescription('**Reason:** '+reason);
      message.channel.send({embed});
    }
  }
};
