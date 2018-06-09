const Discord = require("discord.js");
const fs = require("fs");
const Enmap = require('enmap');
const EnmapLevel = require('enmap-level');

exports.run = (client, message, args) => {
  args = args.map(x => x.toLowerCase());
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
      let key = newargs[0].toLowerCase();
      let myresponse = newargs[1];
      client.alias.set(key, {response:myresponse, author:message.author.tag});
      message.channel.send(`Alias \`${key}\` has been created`);
    }
    if (args[0] == "del" || args[0] == "delete" || args[0] == "remove" || args[0] == "rem"){
      let key = args[1];
      if (!client.alias.has(key)){
        message.channel.send(`Alias \`${key}\` does not exist`);
      }
      else{
        client.alias.delete(key);
        message.channel.send(`Alias \`${key}\` has been deleted`);
      }
    }
    if (args[0] == "list"){
      var keys = client.alias.keyArray();
      var responses = client.alias.array();
      let list = `\`\`\`yaml\n`;
      for (var i = 0; i < keys.length; i++) {
        list += `${keys[i]} : ${responses[i].response} #Created by ${responses[i].author}\n`;
      }
      list += `\`\`\``;
      message.channel.send(`List of __**${keys.length}**__ aliases`);
      message.channel.send(list);
    }
  }
};
