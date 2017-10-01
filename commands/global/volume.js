const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const config = require("../../config.json");
const ytdl = require("ytdl-core");
const request = require("request");
const getyoutubeID = require("get-youtube-id");
const fetchVideoInfo = require("youtube-info");
const http = require('http');
const express = require('express');
const app = express();

app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

exports.run = (client, message, args, guild) => {
  let voiceChannel = message.member.voiceChannel;
  if (!guild.isPlaying) return message.reply("Im not playing anything");
  if (!voiceChannel) return message.reply('You are not in a voice channel');
  if (!message.member.voiceChannel || !voiceChannel.connection) return message.reply('You need to be in the bot\'s voice channel to change volume');
  if (args[1]>=0 || args[1]<=100){
    try {
      message.guild.voiceConnection.dispatcher.setVolume(args/100);
      return message.reply('Volume set to `'+args+'%`');
    }
    catch (err) {
      console.error(err);
      return message.reply('Unable to set volume');
    }
  }
  else {
    message.reply(', You know youre meant to give me a volume right?');
  }
};

function getID(str, callback) {
  if (str.includes('youtube.com')) {
    callback(getYouTubeID(str));
  }
  else {
    search_video(str, (id) => {
      callback(id);
    });
  }
}

function search_video(query, callback) {
  request("https://www.googleapis.com/youtube/v3/search?part=id&type=video&q=" + encodeURIComponent(query) + "&key=" + process.env.yt_api_key, (error, response, body) => {
    if (error) return message.reply('There was an error searching the requested song ' + message.author.toString());
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
          return;
        }, 2500);
      }
      else {
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
