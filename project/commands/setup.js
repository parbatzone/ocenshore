const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { updateGuildSettings, getGuildSettings } = require('../utils/config');
const { createSetupSuccessEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Set up bot configuration')
    .addChannelOption(option => 
      option.setName('welcome_channel')
        .setDescription('Channel for welcome messages')
        .setRequired(false)
    )
    .addChannelOption(option => 
      option.setName('sessions_channel')
        .setDescription('Channel for session updates')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  
  async execute(interaction) {
    const welcomeChannel = interaction.options.getChannel('welcome_channel');
    const sessionsChannel = interaction.options.getChannel('sessions_channel');
    
    if (!welcomeChannel && !sessionsChannel) {
      // Show current settings
      const currentSettings = await getGuildSettings(interaction.guild.id);
      const currentWelcomeChannel = currentSettings.welcomeChannelId ? 
        interaction.guild.channels.cache.get(currentSettings.welcomeChannelId) : null;
      const currentSessionsChannel = currentSettings.sessionsChannelId ? 
        interaction.guild.channels.cache.get(currentSettings.sessionsChannelId) : null;
      
      await interaction.reply({ 
        content: 'Current settings:' +
          `\nWelcome Channel: ${currentWelcomeChannel ? `<#${currentWelcomeChannel.id}>` : 'Not configured'}` +
          `\nSessions Channel: ${currentSessionsChannel ? `<#${currentSessionsChannel.id}>` : 'Not configured'}` +
          `\n\nUse \`/setup welcome_channel:#channel sessions_channel:#channel\` to update settings.`,
        ephemeral: true 
      });
      return;
    }
    
    // Update settings
    const settings = {};
    if (welcomeChannel) settings.welcomeChannelId = welcomeChannel.id;
    if (sessionsChannel) settings.sessionsChannelId = sessionsChannel.id;
    
    const success = await updateGuildSettings(interaction.guild.id, settings);
    
    if (success) {
      const embed = createSetupSuccessEmbed(welcomeChannel, sessionsChannel);
      await interaction.reply({ embeds: [embed], ephemeral: true });
    } else {
      await interaction.reply({ 
        content: 'Failed to update settings. Please try again later.', 
        ephemeral: true 
      });
    }
  },
};
