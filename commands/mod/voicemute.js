const Discord = require("discord.js");
const ms = require("ms");
const fs = require("fs");
const config = require("./config.json");

exports.run = (client, message, args) => {
  if (message.content == "~voicemute"){
    const embed = new Discord.RichEmbed()
    .setTitle("Voice Mute")
    .setColor("#86FFF2")
    .setDescription("Mute a user in a Voice channel\n**Parameters:**")
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
    let muteRole = message.guild.roles.find("name", "Voice Muted");

    if (member.id == config.ownerID || member.id == config.botID){
      message.channel.send("*Nice try asshole*");
    }
    else{
      member.setMute(true);
      const embed = new Discord.RichEmbed()
        .setTitle('Voice Muted '+membername)
        .setColor("#CE1126")
        .setDescription('Duration: '+ ms(ms(duration), {long: true}) + '\n**Reason:** '+reason);
      message.channel.send({embed});

      setTimeout(function(){
        member.setMute(false);
        message.channel.send(member.user.toString() + ", You are no longer voice muted!");
      }, ms(duration));
    }
  }
};
