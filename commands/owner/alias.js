const Discord = require("discord.js");
const fs = require("fs");
const Enmap = require('enmap');
const EnmapLevel = require('enmap-level');

exports.run = (client, message, args) => {
  let newargs = args.join(" ").split(";");
  if (message.content == "~alias"){
    const embed = new Discord.RichEmbed()
      .setTitle("Alias")
      .setColor("#86FFF2")
      .setDescription("Makes the bot reply to certain keywords (PARAMATERS MUST BE SEPERATED BY \";\")\n**Parameters:**")
      .addField("Keyword",
                "The key word", true)
      .addField("Response",
                "The message to be sent", true);
    message.channel.send({embed});
  }
  else {
    let key = newargs[0];
    let response = newargs[1];
    client.alias.set(key, response);
    message.channel.send(`Alias \`${key}\` has been created`);
  }
};
