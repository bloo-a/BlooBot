const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const ytdl = require("ytdl-core");
const request = require("request");
const getyoutubeID = require("get-youtube-id");
const fetchVideoInfo = require("youtube-info");
const pg = require("pg");

let music = {};

app.get('/db', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM test_table', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.render('pages/db', {results: result.rows} ); }
    });
  });
});

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
client.login(process.env.token);


client.on("ready", () => {
  console.log("I am ready!");
  client.user.setPresence({ game: { name: 'with Bloo', type: 0 } });
  console.log(`Ready to serve on ${client.guilds.size} servers, for ${client.users.size} users.`);
});


//command handler
client.on("message", (message) => {
  if (message.author.bot) return;
  if (message.content.startsWith("~~")) return;
  if(message.content.indexOf(process.env.prefix) !== 0) return;
  if(message.channel.type != "dm"){
    let modRole = message.guild.roles.find("name", "BlooBot's Daddy");
    let guild = music[message.guild.id];
      if (!guild) guild = music[message.guild.id] = {
        queue: [],
        skippers: [],
        skipReq: 0,
        isPlaying: false
    };
    //owner commands
    if (message.author.id == message.guild.owner.id){
      const args = message.content.slice(process.env.prefix.length).trim().split(/ +/g);
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
      const args = message.content.slice(process.env.prefix.length).trim().split(/ +/g);
      const command = args.shift().toLowerCase();

      try {
        let commandFile = require(`./commands/mod/${command}.js`);
        commandFile.run(client, message, args, guild);
      } catch (err) {
        console.error(err);
      }
    }
    else {
      const args = message.content.slice(process.env.prefix.length).trim().split(/ +/g);
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
    const args = message.content.slice(process.env.prefix.length).trim().split(/ +/g);
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
  if (message.content.startsWith("!")) {
    if (message.channel.id != process.env.musicchannel) {
      message.delete();
      message.channel.send(`*This is a wierd looking music channel ${message.author.toString()},* please use ${message.guild.channels.get(process.env.musicchannel).toString()}`);
    }
  }
});


client.on("guildMemberAdd", (member) => {
  console.log(`New User "${member.user.username}" has joined "${member.guild.name}"` );
  member.guild.defaultChannel.send(`Welcome to Bloo's College ${member.user.toString()}!`);
  let regRole = member.guild.roles.find("name", "Students");
  member.addRole(regRole.id);
});

client.on("guildCreate", (guild) => {
  guild.owner.send("Thank you for adding me to your server!\n\nThere are a bunch of features that are not added by default:\nModerator commands\nMusic command containment\n\nIf you would like to enable them, just type `~AllowMods` or `~AllowContainment`");
});
