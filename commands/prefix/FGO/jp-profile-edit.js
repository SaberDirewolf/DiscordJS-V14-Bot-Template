const { EmbedBuilder } = require('discord.js');
const util = require("../../../utility/util.js");
const timeout = 30000;

module.exports = {
    config: {
        name: "jp-profile-edit",
        description: "Save or edit your FGO JP Profile. **Format:**\n"+
        "jp-profile-edit <IGN> | <Friend ID> | <Support Images> | <Privacy>\n\n"+
        "**__IGN__** Your IGN. Format: `name: IGN`\n\n"+
        "**__Friend ID__** Your Friend ID. Format: `id: FriendID`\n\n"+
        "**__Support#__** The image link showing your support list to corresponding profile page. Format: `support1: <Image Link>`. You can also upload the image along with the command. Can upload up to 6 images at once or use `support1` through `support6`.\n\n"+
        "**__Privacy__** Privacy Setting for your profile. Format: `privacy: true/false`. If set to `false`, everyone can use command to see your profile. Optional, default to true\n\n",
        usage: "jp-profile-edit name: Test | id: 123,456,789 | support1: [image link] | support2: [image link] | | support3: [image link]"
    },
    permissions: ['SendMessages'],
    owner: false,
    run: async (client, message, args, prefix, config, db) => {
        args = args.join(' ');
        const attachments = message.attachments;
        if (args || attachments.at(0)) {
            db.get(`fgoProfile_Jp_${message.author.id}`).then(profile => {
                if (profile) profile = JSON.parse(profile);
                else profile = {};
                let modified = false;
                let ignoreAttachments = false;
                args = args.match(/((?:name)|(?:id)|(?:support)|(?:support1)|(?:support2)|(?:support3)|(?:support4)|(?:support5)|(?:support6)|(?:privacy)) ?: ?[^\|]+/gi);
                if (args) {
                args.forEach(item => {
                    item = item.split(':');
                    item[0] = item[0].toLowerCase().trim();
                    item[1] = item.slice(1).join(':').trim();
                    if (item[0] == "support") item[0] = "support1";
                    profile[item[0]] = item[1];
                    modified = true;
                    if (item[0] == "privacy") {
                    if (item[1] == "false") profile.privacy = false;
                    else profile.privacy = true;
                    }
                    else if (item[0] == ("support1"||"support2"||"support3"||"support4"||"support5"||"support6")) ignoreAttachments = true;
                });
                }
                if(attachments.at(0) && !ignoreAttachments) {
                for(let i = 0; i < 6; i++)
                {
                    if(attachments.at(i)){
                    eval(`profile.support${i+1} = attachments.at(${i}).url`);
                    }
                }
                modified = true;
                }
                if (modified) {
                    const logmsg = '[JP-PROFILE-EDIT] by ' + message.author.id + ' modified with ' + profile;
                    console.log(logmsg.brightGreen);
                    db.set(`fgoProfile_Jp_${message.author.id}`, JSON.stringify(profile)).then(() => {
                        message.channel.send('Profile saved successfully');
                        util.fgoProfiles(message.author, profile, message, timeout, true);
                    });
                } else message.channel.send(`Error: No argument provided. Please consult \`${prefix}help jp-profile-edit\` for more information.`);
            });
        } else {
            message.channel.send(`Error: No argument provided. Please consult \`${prefix}info jp-profile-edit\` for more information.`);
        }
    },
};