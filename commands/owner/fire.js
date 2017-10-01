const sql = require("sqlite");
sql.open("./score.sqlite");

const Discord = require("discord.js");

exports.run = (client, message, args) => {
  if (message.content == "~fire"){
    const embed = new Discord.RichEmbed()
      .setTitle("Fire")
      .setColor("#86FFF2")
      .setDescription("Bloo's 🔥 tunes\n**Parameters:**")
      .addField("",
                "PARAMETER DESCRIPTION", true)
      .addField("PARAMETER2",
                "PARAMETER DESCRIPTION", true);
    message.channel.send({embed});
  }
};
