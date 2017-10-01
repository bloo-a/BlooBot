const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const ytdl = require("ytdl-core");
const request = require("request");
const getyoutubeID = require("get-youtube-id");
const fetchVideoInfo = require("youtube-info");

exports.run = (client, message, args, guild) => {
  let song = args.join(' ');
  if (!guild || !guild.isPlaying || !message.guild.voiceConnection) return message.reply('I am currently not playing anything');
  if (!message.member.voiceChannel || message.member.voiceChannel.id !== message.guild.voiceConnection.channel.id) return message.reply('You are not in the same voice channel');
  if (guild.skippers.includes(message.author.id)) return message.reply(' You\'ve already voted to skip');
  if (message.author.id == process.env.ownerID){
    skip_song(message);
    message.channel.send('**Skipped ⏩**');
  }
  else {
    guild.skippers.push(message.author.id);
    if (guild.skippers.length >= Math.floor(message.member.voiceChannel.members.size - 1) / 2) {
      skip_song(message);
      message.channel.send('**Skipped ⏩**');
    }
    else {
      message.channel.send(`**Skip?** (${guild_config.skippers.length}/${Math.ceil((msg.member.voiceChannel.members.size - 1) / 2)}`);
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
