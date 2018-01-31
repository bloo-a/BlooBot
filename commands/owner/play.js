const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const config = require("./config.json");
const ytdl = require("ytdl-core");
const request = require("request");
const getyoutubeID = require("get-youtube-id");
const fetchVideoInfo = require("youtube-info");
const ffmpeg = require('ffmpeg');
let music = {};

exports.run = (client, message, args, guild) => {
  let song = args.join(' ');
  if (!message.member.voiceChannel) return message.channel.send('You are currently not in a voice channel');
  if (guild.isPlaying) {
   getID(song, id => {
      if (!id) return message.channel.send('Unable to extract video.');
      ytdl.getInfo(id, (err, info) => {
         if (err) return message.channel.send('Hmm..there was an error extracting that video.');
         if (info.formats.some(format => format.live)) return message.channel.send('Not supporting live stream at this time.');
         message.delete();
            guild.queue.push({
               info, requester: message.member
         });
         let totaltime = guild.queue.map(a => a.info.length_seconds).reduce((arg1, arg2) => arg1+arg2);
         let totalminutes = Math.floor(totaltime / 60);
         let totalseconds = totaltime - totalminutes * 60;
         let songtime = info.length_seconds;
         let songminutes = Math.floor(songtime / 60);
         let songseconds = songtime - songminutes * 60;
         const embed = new Discord.RichEmbed()
           .setTitle(`**${info.title}**`)
           .setColor("#800080")
           .setAuthor(`Added by ${message.author}`, `${message.author.displayAvatarURL}`)
           .setThumbnail(`${info.thumbnail}`)
           .addField("Queue Position",
                     `${guild.queue.array().length}`, true)
           .addField("Time untill playing",
                     `${totalminutes}:${totalseconds}`, true)
           .addField("Duration",
                     `${songminutes}:${songseconds}`, true);

         message.channel.send({embed});
      });
   });

  }
  else {
  guild.isPlaying = true;
  message.channel.send(`Searching for \`${song}\``);
   getID(song, id => {
   if (!id) return message.channel.send(' unable to extract video');
      ytdl.getInfo(id, (err, info) => {
      if (err) return message.channel.send('Hmm..there was an error extracting that video.');
      if (info.formats.some(format => format.live)) return message.channel.send('Not supporting live stream at this time.');
         message.delete();
              guild.queue.push({
               info, requester: message.member
         });
         playMusic(guild, message);
      });
   });
 }
};

function getID(str, callback) {
  if (str.includes('youtube.com')) {
    callback(getyoutubeID(str));
  }
  else {
    search_video(str, (id) => {
      callback(id);
    });
  }
}

function search_video(query, callback) {
  request("https://www.googleapis.com/youtube/v3/search?part=id&type=video&q=" + encodeURIComponent(query) + "&key=" + config.yt_api_key, (error, response, body) => {
    if (error) return message.channel.send('There was an error searching the requested song ' + message.author.toString());
    try {
      const json = JSON.parse(body);
      callback(json.items[0].id.videoId);
    }
    catch (e) {
      callback(null);
    }
  });
}

function playMusic(guild, message) {
          const voiceChannel = message.member.voiceChannel;

          voiceChannel.join().then(connection => {
              guild.skippers = [];
              const stream = ytdl.downloadFromInfo(guild.queue[0].info, {
                  filter: 'audioonly'
              });
              message.channel.send(`Now playing: **${guild.queue[0].info.title}** as requested by ${guild.queue[0].requester.displayName}`);
              const dispatcher = connection.playStream(stream);
              dispatcher.on('error', console.log);
              dispatcher.on('debug', console.log);
              dispatcher.on('end', () => {
                  guild.queue.shift();
                  if (guild.queue.length === 0) {
                      guild.isPlaying = false;
                      setTimeout(() => {
                          voiceChannel.leave();
                          return message.channel.send('Queue is empty. Queue up some more tunes!');
                      }, 2500);
                  } else {
                      setTimeout(() => {
                          playMusic(guild, message);
                      }, 500);
                  }
              });
          });
      }

function skip_song(message) {
  message.guild.voiceConnection.dispatcher.end();
}
