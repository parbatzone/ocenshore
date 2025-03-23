const { Events } = require('discord.js');

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag} (ID: ${client.user.id})`);
  },
};

// ===== events/guildMemberAdd.js =====
const { Events } = require('discord.js');
const { createWelcomeEmbed } = require('../utils/embeds');
const { getGuildSettings } = require('../utils/config');

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member) {
    try {
      // Get guild settings
      const guildSettings = await getGuildSettings(member.guild.id);
      
      // Send DM to new member
      await member.send({
        content: `Welcome to ${member.guild.name}, ${member.user.username}! We're glad to have you here. Please read our rules and enjoy your stay!`
      });
      
      // Send message to welcome channel if configured
      if (guildSettings.welcomeChannelId) {
        const welcomeChannel = member.guild.channels.cache.get(guildSettings.welcomeChannelId);
        if (welcomeChannel) {
          const welcomeEmbed = createWelcomeEmbed(member);
          await welcomeChannel.send({ embeds: [welcomeEmbed] });
        }
      }
    } catch (error) {
      console.error('Error in guildMemberAdd event:', error);
    }
  },
};