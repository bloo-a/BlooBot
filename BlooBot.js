const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const config = require("./config.json");
const ytdl = require("ytdl-core");
const request = require("request");
const getyoutubeID = require("get-youtube-id");
const fetchVideoInfo = require("youtube-info");

let music = {};

fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    let eventFunction = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    // super-secret recipe to call events with all their proper arguments *after* the `client` var.
    client.on(eventName, (...args) => eventFunction.run(client, ...args));
  });
});


client.on("error", (e) => console.error(e));
client.on("warn", (e) => console.warn(e));
client.on("debug", (e) => console.info(e));
client.login(config.token);


client.on("ready", () => {
  console.log("I am ready!");
  client.user.setGame("with Bloo");
  console.log(`Ready to serve on ${client.guilds.size} servers, for ${client.users.size} users.`);
});


//command handler
client.on("message", (message) => {
  if (message.author.bot) return;
  if(message.content.indexOf(config.prefix) !== 0) return;
  if(!message.channel.isPrivate){
    let modRole = message.guild.roles.find("name", "BlooBot's Daddy");
    let guild = music[message.guild.id];
      if (!guild) guild = music[message.guild.id] = {
        queue: [],
        skippers: [],
        skipReq: 0,
        isPlaying: false
    };
    //owner commands
    if (message.author.id == config.ownerID){
      const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
      const command = args.shift().toLowerCase();

      try {
        let commandFile = require(`./commands/owner/${command}.js`);
        commandFile.run(client, message, args, guild);
      } catch (err) {
        console.error(err);
      }
    }
    //mod commands
    else if (message.member.roles.has(modRole.id)) {
      const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
      const command = args.shift().toLowerCase();

      try {
        let commandFile = require(`./commands/mod/${command}.js`);
        commandFile.run(client, message, args, guild);
      } catch (err) {
        console.error(err);
      }
    }
    else {
      const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
      const command = args.shift().toLowerCase();

      try {
        let commandFile = require(`./commands/global/${command}.js`);
        commandFile.run(client, message, args, guild);
      } catch (err) {
        console.error(err);
      }
    }
  }
  else {
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    try {
      let commandFile = require(`./commands/help/${command}.js`);
      commandFile.run(client, message, args);
    } catch (err) {
      console.error(err);
    }
  }
});

//reply array
client.on("message", (message) => {
  let msg = message.content.toLowerCase();
  if (message.author.bot) return;
  let responseObject = {
  "gn": "Good Night!",
  "good night": "Good Night!",
  "berg": "Fuck you Berg!",
  "pong!": "Shut the fuck up you're not funny",
  "make me mod": "*no*"
  };
  if(responseObject[msg]) {
    message.channel.send(responseObject[msg]);
  }
});


client.on("guildMemberAdd", (member) => {
  console.log(`New User "${member.user.username}" has joined "${member.guild.name}"` );
  member.guild.defaultChannel.send(`Welcome to Bloo's Asylum ${member.user.toString()}!`);
});
