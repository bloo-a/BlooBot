const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const ytdl = require("ytdl-core");
const config = require("./config.json");
const request = require("request");
const getyoutubeID = require("get-youtube-id");
const fetchVideoInfo = require("youtube-info");

exports.run = (client, message, args, guild) => {
  let song = args.join(' ');
  if (!guild || !guild.isPlaying || !message.guild.voiceConnection) return message.reply('No songs are in queue');
  if (!message.member.voiceChannel || message.member.voiceChannel.id !== message.guild.voiceConnection.channel.id) return message.reply('You need to be in the bot\'s voice channel to skip');
  if (guild_config.skippers.includes(message.author.id)) return message.reply(' You\'ve already voted to skip');
  if (message.author.id == config.ownerID){
    skip_song(message);
    message.reply('Skipped');
  }
  else {
    guild.skippers.push(message.author.id);
    if (guild.skippers.length >= Math.floor(message.member.voiceChannel.members.size - 1) / 2) {
      skip_song(message);
      message.reply('Skipped');
    }
    else {
      message.reply(` Your skip has been added. You need ${Math.ceil((msg.member.voiceChannel.members.size - 1) / 2) - guild_config.skippers.length} more votes to skip.`);
    }
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
  request("https://www.googleapis.com/youtube/v3/search?part=id&type=video&q=" + encodeURIComponent(query) + "&key=" + config.yt_api_key, (error, response, body) => {
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
