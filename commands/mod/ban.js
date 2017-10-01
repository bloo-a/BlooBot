const Discord = require("discord.js");
const config = require("../../config.json");

exports.run = (client, message, args) => {
  if (message.content == "~ban"){
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
  }
  else {
    let member = message.mentions.members.first();
    let reason = message.content.split(/\s+/g).slice(3).join(" ");
    let duration = message.content.split(/\s+/g)[2];
    let membername = member.user.username;
    if (member.id == process.env.ownerID || member.id == process.env.botID){
      message.channel.send("*Nice try asshole*");
    }
    else {
      member.ban(reason);
      const embed = new Discord.RichEmbed()
        .setTitle('Banned '+membername)
        .setColor("#CE1126")
        .setDescription('Duration: '+ ms(ms(duration), {long: true}) + '\n**Reason:** '+reason);
      message.channel.send({embed});

      setTimeout(function(){
        member.unban();
        message.channel.send(member.user.displayName + ", is no longer banned");
      }, ms(duration));
    }
  }
};
