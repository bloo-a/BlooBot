const Discord = require("discord.js");

exports.run = (client, message, args) => {
  if (message.content == "~contract"){
    const embed = new Discord.RichEmbed()
      .setTitle("Contract")
      .setColor("#86FFF2")
      .setDescription("Creates a contract with someone\n**Parameters:**")
      .addField("User",
                "The user you wish to make a contract with", true)
      .addField("Description",
                "The description of the contract", true);
    message.channel.send({embed});
  }
  let member = message.mentions.members.first();
  if (!member) return;
  let desc = message.content.split(/\s+/g).slice(2).join(" ");
  message.channel.send(member.user.toString() + ", A contract was sent to you by " + message.author.toString() + "!");
  const embed = new Discord.RichEmbed()
    .setAuthor("for" + member.user.displayName, "https://i.imgur.com/lm8s41J.png")
    .setTitle("Contract")
    .setColor("#478244")
    .setDescription(desc);
  message.channel.send({embed});
};
