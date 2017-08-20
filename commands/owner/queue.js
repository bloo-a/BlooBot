const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const config = require("../../config.json");
const ytdl = require("ytdl-core");
const request = require("request");
const getyoutubeID = require("get-youtube-id");
const fetchVideoInfo = require("youtube-info");

exports.run = (client, message, args, guild) => {
  let song = args.join(' ');
  if (!guild) return message.reply('No songs in queue.');
  message.channel.send(`\`\`\`Queue:\n${guild.queue.map(a => `**${a.info.title}** as requested by **${a.requester.user.username}**`).join('\n\n') || 'No songs currently, welp.'}\`\`\``);
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
