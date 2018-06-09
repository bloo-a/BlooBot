const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const config = require("./config.json");
const request = require("request");
const Enmap = require('enmap');
const EnmapLevel = require('enmap-level');

const tableSource = new EnmapLevel({name: "alias"});
client.alias = new Enmap({provider: tableSource});

let music = {};

// client.get('/db', function (request, response) {
//   pg.connect(config.DATABASE_URL, function(err, client, done) {
//     client.query('SELECT * FROM test_table', function(err, result) {
//       done();
//       if (err)
//        { console.error(err); response.send("Error " + err); }
//       else
//        { response.render('pages/db', {results: result.rows} ); }
//     });
//   });
// });

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
  client.user.setPresence({ game: { name: 'with Bloo', type: 0 } });
  console.log(`Ready to serve on ${client.guilds.size} servers, for ${client.users.size} users.`);
});


//command handler
client.on("message", (message) => {
  if (message.author.bot) return;
  if (message.content.startsWith("~~")) return;
  if(message.content.indexOf(config.prefix) !== 0) return;
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
      const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
      const command = args.shift().toLowerCase();

      try {
        let commandFile = require(`./commands/owner/${command}.js`);
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
});

//reply array
client.on("message", (message) => {
  let msg = message.content.toLowerCase();
  if (message.author.bot) return;
  if(client.alias.get(msg)) {
    message.channel.send(client.alias.get(msg).response);
  }
  if (msg.toLowerCase() == "e"){
    message.react("🇪");
  }
});
