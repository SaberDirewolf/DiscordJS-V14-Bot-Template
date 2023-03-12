const { EmbedBuilder } = require('discord.js');
const util = require("../../../utility/util.js")

module.exports = {
    config: {
        name: "jp-profile", // Name of Command
        description: "Get your saved FGO Profile (JP version)", // Command Description
        usage: "jp-profile [USER ID# Optional. The bot will show another player's profile if this argument is provided]" // Command usage
    },
    permissions: ['SendMessages'], // User permissions needed
    owner: false, // Owner only?
    run: async (client, message, args, prefix, config, db) => {
        let player = message.author.id;
        if (args = args.join(' ')) {
        let mentionID = args.match(/(?:<@!?)?(\d+)/);
        if (mentionID) player = mentionID[1];
            else player = "";
        }
        const logmsg = '[JP-PROFILE] invoked by ' + message.author.id;
        Promise.all([db.get(`fgoProfile_Jp_${player}`), client.users.fetch(player)]).then((profile) => {
        if (profile[0]) {
            profile[0] = JSON.parse(profile[0]);
            if (!profile.privacy || !args) {
                util.fgoProfiles(profile[1], profile[0], message, 6000, false);
            }
            else message.channel.send(`This player has set his privacy setting to true, thus the profile cannot be displayed`);
        } else if (args) message.channel.send(`Cannot find profile of provided player. Please recheck your arguments and try again`);
        else message.channel.send(`Profile not found, please use \`${prefix}jp-profile-edit\` to create one`);
        }).catch(console.log(logmsg.brightGreen));
    },
};