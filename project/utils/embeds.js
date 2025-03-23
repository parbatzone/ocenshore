const { EmbedBuilder } = require('discord.js');

function createWelcomeEmbed(member) {
  return new EmbedBuilder()
    .setColor('#3498db')
    .setTitle(`Welcome ${member.user.username}!`)
    .setDescription(`We're happy to have you in ${member.guild.name}!`)
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
    .addFields(
      { name: 'Member Count', value: `You are our ${member.guild.memberCount}th member!` },
      { name: 'Getting Started', value: 'Please check out our rules and introduction channels.' }
    )
    .setTimestamp()
    .setFooter({ text: `ID: ${member.id}` });
}

function createInfractionEmbed(user, reason, punishment, moderator) {
  return new EmbedBuilder()
    .setColor('#e74c3c')
    .setTitle(`Infraction: ${punishment}`)
    .addFields(
      { name: 'User', value: user.tag, inline: true },
      { name: 'UserID', value: user.id, inline: true },
      { name: 'Punishment', value: punishment, inline: true },
      { name: 'Reason', value: reason },
      { name: 'Signed by', value: moderator.tag }
    )
    .setTimestamp();
}

function createSessionEmbed(status, details = {}) {
  const embed = new EmbedBuilder()
    .setColor(status === 'started' ? '#2ecc71' : '#e74c3c')
    .setTitle(`Session ${status.charAt(0).toUpperCase() + status.slice(1)}`)
    .setTimestamp();
  
  if (status === 'started') {
    embed.addFields(
      { name: 'Started by', value: details.user.tag },
      { name: 'Expected Duration', value: details.duration || 'Not specified' },
      { name: 'Session Type', value: details.type || 'Regular Session' }
    );
  } else {
    embed.addFields(
      { name: 'Ended by', value: details.user.tag },
      { name: 'Duration', value: details.duration || 'Not calculated' },
      { name: 'Notes', value: details.notes || 'No notes provided' }
    );
  }
  
  return embed;
}

function createCustomEmbed(title, description, color, fields = [], image = null) {
  const embed = new EmbedBuilder()
    .setColor(color || '#3498db')
    .setTitle(title)
    .setDescription(description)
    .setTimestamp();
  
  if (fields.length) {
    embed.addFields(...fields);
  }
  
  if (image) {
    embed.setImage(image);
  }
  
  return embed;
}

function createSetupSuccessEmbed(welcomeChannel, sessionsChannel) {
  return new EmbedBuilder()
    .setColor('#2ecc71')
    .setTitle('Setup Completed')
    .setDescription('Bot configuration has been updated successfully!')
    .addFields(
      { name: 'Welcome Channel', value: welcomeChannel ? `<#${welcomeChannel.id}>` : 'Not configured', inline: true },
      { name: 'Sessions Channel', value: sessionsChannel ? `<#${sessionsChannel.id}>` : 'Not configured', inline: true }
    )
    .setTimestamp();
}

module.exports = {
  createWelcomeEmbed,
  createInfractionEmbed,
  createSessionEmbed,
  createCustomEmbed,
  createSetupSuccessEmbed
};
