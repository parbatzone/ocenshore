const { SlashCommandBuilder } = require('discord.js');
const { startSession, endSession, getActiveSessions } = require('../utils/sessions');
const { getGuildSettings } = require('../utils/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('session')
    .setDescription('Manage sessions')
    .addSubcommand(subcommand =>
      subcommand
        .setName('start')
        .setDescription('Start a new session')
        .addStringOption(option => option.setName('type').setDescription('Type of session').setRequired(true))
        .addStringOption(option => option.setName('duration').setDescription('Expected duration (e.g. 1 hour)').setRequired(false))
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('end')
        .setDescription('End an active session')
        .addStringOption(option => option.setName('id').setDescription('Session ID').setRequired(false))
        .addStringOption(option => option.setName('notes').setDescription('Notes about the session').setRequired(false))
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('list')
        .setDescription('List all active sessions')
    ),
  
  async execute(interaction) {
    // Check if sessions channel is configured
    const guildSettings = await getGuildSettings(interaction.guild.id);
    if (!guildSettings.sessionsChannelId) {
      await interaction.reply({ 
        content: 'The sessions channel has not been configured yet. Please use `/setup` to set it up.', 
        ephemeral: true 
      });
      return;
    }

    const subcommand = interaction.options.getSubcommand();
    
    if (subcommand === 'start') {
      const type = interaction.options.getString('type');
      const duration = interaction.options.getString('duration') || 'Not specified';
      
      const sessionId = await startSession(interaction, type, duration);
      
      await interaction.reply({ 
        content: `Session started! ID: \`${sessionId}\``, 
        ephemeral: true 
      });
    } 
    else if (subcommand === 'end') {
      const sessions = getActiveSessions(interaction.guild.id);
      let sessionId = interaction.options.getString('id');
      
      // If no ID provided and there's only one active session, use that one
      if (!sessionId && sessions.length === 1) {
        sessionId = sessions[0].id;
      } else if (!sessionId) {
        await interaction.reply({ 
          content: 'Please specify a session ID. Use `/session list` to see active sessions.', 
          ephemeral: true 
        });
        return;
      }
      
      const notes = interaction.options.getString('notes') || 'No notes provided';
      const success = await endSession(interaction, sessionId, notes);
      
      if (success) {
        await interaction.reply({ 
          content: `Session \`${sessionId}\` has been ended.`, 
          ephemeral: true 
        });
      } else {
        await interaction.reply({ 
          content: `No active session found with ID \`${sessionId}\`.`, 
          ephemeral: true 
        });
      }
    }
    else if (subcommand === 'list') {
      const sessions = getActiveSessions(interaction.guild.id);
      
      if (sessions.length === 0) {
        await interaction.reply({ 
          content: 'No active sessions found.', 
          ephemeral: true 
        });
        return;
      }
      
      const sessionList = sessions.map(session => {
        const duration = Math.floor((new Date() - session.startTime) / 60000); // in minutes
        return `**ID:** \`${session.id}\`\n**Type:** ${session.type}\n**Started by:** ${session.user.tag}\n**Duration:** ${duration} minutes\n`;
      }).join('\n');
      
      await interaction.reply({ 
        content: `**Active Sessions:**\n\n${sessionList}`, 
        ephemeral: true 
      });
    }
  },
};