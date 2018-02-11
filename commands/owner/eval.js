const Discord = require("discord.js");
const config = require("./config.json");

exports.run = (client, message, args) => {
  if(message.author.id !== config.ownerID) return;
  try {
      const code = args.join(" ");
      let evaled = eval(code);

      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled);

      message.channel.send(clean(evaled), {code:"xl"});
    } catch (err) {
      message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
};
