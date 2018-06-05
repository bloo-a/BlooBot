const Discord = require("discord.js");
const fs = require("fs");
const Enmap = require('enmap');
const EnmapLevel = require('enmap-level');

exports.run = (client, message, args) => {
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
    if (args[0] == "add"){
      let newargs = args.slice(1).join(" ").split(";");
      let key = newargs[0];
      let response = newargs[1];
      client.alias.set(key, response);
      message.channel.send(`Alias \`${key}\` has been created`);
    }
    if (args[0] == "del" || args[0] == "delete" || args[0] == "remove" || args[0] == "rem"){
      let key = args[1];
      client.alias.delete(key);
      message.channel.send(`Alias \`${key}\` has been deleted`);
    }
    if (args[0] == "list"){
      var keys = client.alias.keyArray();
      var responses = client.alias.array();
      let list = `\`\`\`\n`;
      for (var i = 0; i < keys.length; i++) {
        list += `${keys[i]} : ${responses[i]}\n`;
      }
      list += `\`\`\``;
      message.channel.send(`List of __**${keys.length}**__ aliases`);
      message.channel.send(list);
    }
  }
};
