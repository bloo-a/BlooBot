const Discord = require("discord.js");
const ms = require("ms");
const fs = require("fs");

exports.run = (client, message, args) => {
  if (message.content == "~mute"){
    const embed = new Discord.RichEmbed()
    .setTitle("Mute")
    .setColor("#86FFF2")
    .setDescription("Mute a user in a text channel\n**Parameters:**")
    .addField("User",
              "The user to be muted", true)
    .addField("Duration",
              "The duration of the mute", true)
    .addField("Reason",
              "The reason for the mute", true);
    message.channel.send({embed});
  }
  else {
    let member = message.mentions.members.first();
    let args = message.content.split(/\s+/g);
    let duration = args[2];
    let reason = args.slice(3).join(" ");
    let membername = member.user.username;
    let muteRole = message.guild.roles.find("name", "Muted");
    if (member.id == process.env.ownerID || member.id == process.env.botID){
      message.channel.send("*Nice try asshole*");
    }
    else{
      member.addRole(muteRole.id);
      const embed = new Discord.RichEmbed()
        .setTitle('Muted '+membername)
        .setColor("#CE1126")
        .setDescription('Duration: '+ ms(ms(duration), {long: true}) + '\n**Reason:** '+reason);
      message.channel.send({embed});

      setTimeout(function(){
        member.removeRole(muteRole.id);
        message.channel.send(member.user.toString() + ", You are no longer muted!");
      }, ms(duration));
    }
  }
};
