const {  ButtonBuilder, ButtonStyle, EmbedBuilder  } = require('discord.js');
const { Pagination } = require("@acegoal07/discordjs-pagination");

function fgoProfileEmbed(user, data, image) {
  const embed = new EmbedBuilder();
  embed.setTitle("FGO Profile for " + user.username);
  embed.setDescription("\u200b");
  embed.setThumbnail(user.displayAvatarURL());
  embed.addFields(
    { name: 'IGN', value: data.name || "Not Provided" },
    { name: 'Friend ID', value: data.id || "Not Provided" },
  );
  if (image) embed.setImage(image);
  return embed;
}

function fgoProfiles(user, data, message, timeout, editedprofile) {
  const pagination = new Pagination();
  const buttons = [];
  const pages = [];
  
  buttons.push(new ButtonBuilder().setCustomId('prev')
  .setStyle(ButtonStyle.Secondary)
  .setEmoji('◀️'));
  buttons.push(new ButtonBuilder().setCustomId('next')
  .setStyle(ButtonStyle.Secondary)
  .setEmoji('▶️'));

  for(let i = 1; i < 7; i++)
  {
    let img = null;    
    try {
      if(eval(`data.support${i}`)) img = eval(`data.support${i}`); 
    } catch (exceptionVar) {
      console.error(`[CATCH] fgoProfiles no image found for support${i} `+ exceptionVar+''.red);
    } finally {
      if(i == 1 || img || editedprofile) pages.push(fgoProfileEmbed(user, data, img));
    }
  }
  
  pagination.setPortal(message);
  pagination.setPageList(pages);
  pagination.setButtonList(buttons);
  pagination.setTimeout(timeout); //900000
  if(editedprofile) pagination.setProgressBar();
  pagination.paginate();
}

module.exports = { fgoProfiles, fgoProfileEmbed };