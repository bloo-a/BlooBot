const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");

const owners = [config.ownerID1, config.ownerID2];

client.on("error", (e) => console.error(e));
client.on("warn", (e) => console.warn(e));
client.on("debug", (e) => console.info(e));

client.login(config.token);

client.on("ready", () => {
  console.log("I am ready!");
  client.user.setGame("with Bloo");
  console.log(`Ready to serve on ${client.guilds.size} servers, for ${client.users.size} users.`);
});


//owner commands
client.on("message", (message) => {
  // Exit and stop if it's not there
  if (!message.content.startsWith(config.prefix) || message.author.bot) return;
  if (!owners.includes(message.author.id)) return;
  if (message.content.startsWith(config.prefix + "admintest")) {
    message.channel.send("hi admin");
  }
  //commands start here

});

//role commands
client.on("message", (message) => {
  // Exit and stop if it's not there
  if (!message.content.startsWith(config.prefix) || message.author.bot) return;
  if(!message.member.roles.has(config.role)) return;
  if (message.content.startsWith(config.prefix + "modtest")) {
    message.channel.send("hi daddy");
  }
  //commands start here

});



//global commands
client.on("message", (message) => {
  // Exit and stop if it's not there
  if (!message.content.startsWith(config.prefix) || message.author.bot) return;

  //commands start here
  if (message.content.startsWith(config.prefix + "ping")) {
    message.channel.send("pong!");
  }
  if (message.content.startsWith(config.prefix + "test")) {
    message.channel.send("shut the fuck up");
  }
});


client.on("guildMemberAdd", (member) => {
  console.log(`New User "${member.user.username}" has joined "${member.guild.name}"` );
  member.guild.defaultChannel.send(`Welcome "${member.user.username}"!`);
});
