const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const ytdl = require("ytdl-core");
const request = require("request");
const getyoutubeID = require("get-youtube-id");
const fetchVideoInfo = require("youtube-info");
let music = {};

exports.run = (client, message, args, guild) => {
  let song = args.join(' ');
  if (message.content == "~play"){
    const embed = new Discord.RichEmbed()
      .setTitle("Play")
      .setColor("#86FFF2")
      .setDescription("Play a song in your voice channel\n**Parameters:**")
      .addField("Song",
                "Either a link or the name to a song to be played", true);
    message.channel.send({embed});
  }
  if (!message.member.voiceChannel) return message.reply(message.author.toString() + ", you're not in a voice channel.");
  if (!song) return message.reply(message.author.toString() + ", you did not queue a song");
  if (guild.isPlaying) {
    getID(song, id => {
    if (!id) return message.reply('Unable to play song');

    ytdl.getInfo(id, (err, info) => {
    if (err) return message.reply('Unable to play song');
    if (info.formats.some(format => format.live)) return message.reply('Unable to play live streams');
    message.delete();
    guild.queue.push({
      info, requester: message.member
    });
    message.reply(`***${info.title}*** has been added to the queue!`);
    });
    });
  }
  else {
    guild.isPlaying = true;
    getID(song, id => {
    if (!id) return message.reply('Unable to play song');

    ytdl.getInfo(id, (err, info) => {
    if (err) return message.reply('Unable to play song');
    if (info.formats.some(format => format.live)) return message.reply('Unable to play live streams');
    message.delete();
    playMusic(guild, message);
    });
    });
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
