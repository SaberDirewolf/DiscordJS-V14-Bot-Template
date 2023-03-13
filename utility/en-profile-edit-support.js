const { EmbedBuilder } = require('discord.js');
const util = require("../../../utility/util.js")
const page = 1;

module.exports = {
    config: {
        name: `en-profile-edit-support-${page}`,
        description: `Upload support to FGO EN Profile Page ${page} with direct attachment or a URL.`,
        usage: `en-profile-edit-support-${page} URL: [URL]`
    },
    permissions: ['SendMessages'],
    owner: false,
    run: async (client, message, args, prefix, config, db) => {
        args = args.join(' ');
        const attachments = message.attachments;
        if (args || attachments.at(0)) {
            db.get(`fgoProfile_En_${message.author.id}`).then(profile => {
                if (profile) profile = JSON.parse(profile);
                else profile = {};
                let modified = false;
                let ignoreAttachments = false;
                args = args.match(/((?:url)) ?: ?[^\|]+/gi);
                if (args) {
                args.forEach(item => {
                    item = item.split(':');
                    item[0] = item[0].toLowerCase().trim();
                    item[1] = item.slice(1).join(':').trim();
                    if (item[0] == "url") item[0] = `support${page}`;
                    profile[item[0]] = item[1];
                    modified = true;
                    if (item[0] == (`support${page}`)) ignoreAttachments = true;
                });
                }
                if(attachments.at(0) && !ignoreAttachments) {
                    eval(`profile.support${page} = attachments.at(0).url`);
                    modified = true;
                }
                if (modified) {
                    const logmsg = `[EN-PROFILE-EDIT-SUPPORT-${page}] by ` + message.author.id + ' modified with:';
                    console.log(logmsg.brightGreen);
                    console.log(profile);
                    db.set(`fgoProfile_En_${message.author.id}`, JSON.stringify(profile)).then(() => {
                        message.channel.send('Profile saved successfully');
                        util.fgoProfiles(message.author, profile, message, config.EditProfileView.TIMEOUT, true);
                    });
                } else message.channel.send(`Error: No argument provided. Please consult \`${prefix}info en-profile-edit-support-${page}\` for more information.`);
            });
        } else {
            message.channel.send(`Error: No argument provided. Please consult \`${prefix}info en-profile-edit-support-${page}\` for more information.`);
        }
    },
};