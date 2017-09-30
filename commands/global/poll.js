const Discord = require("discord.js");
const config = require("../../config.json");

exports.run = (client, message, args) => {
  let newargs = args.join(" ").split(";");
  if (message.content == "~poll"){
    const embed = new Discord.RichEmbed()
      .setTitle("Poll")
      .setColor("#86FFF2")
      .setDescription("Creates a poll (PARAMATERS MUST BE SEPERATED BY \";\")\n**Parameters:**")
      .addField("Query",
                "The Query you have", true)
      .addField("Option1",
                "Your first option", true)
      .addField("Option2",
                "Your second option", true);
    message.channel.send({embed});
  }
  let query = newargs[0];
  let options = newargs.slice(1);
  if (!newargs[1]){
    const embed = new Discord.RichEmbed()
      .setTitle("Poll")
      .setAuthor("Created by: " + message.author.username, message.author.displayAvatarURL)
      .setColor("#5722FF")
      .setDescription(query);
    message.channel.send({embed})
      .then(function (message) {
              message.react("✅");
              message.react("❌");
      })
      .catch(function() {
              //Something
      });
  }
  else{
    const embed = new Discord.RichEmbed()
      .setTitle("Poll")
      .setColor("#5722FF")
      .setAuthor("Created by: " + message.author.username, message.author.displayAvatarURL)
      .setDescription(query)
      .addField("Option 🇦",
                options[0], true)
      .addField("Option 🇧",
                options[1], true);
    message.channel.send({embed})
      .then(function (message) {
              message.react("🇦");
              message.react("🇧");
      })
      .catch(function() {
              //Something
      });
  }
};
