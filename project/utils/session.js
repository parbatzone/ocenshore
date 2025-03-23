const { createSessionEmbed } = require('./embeds');
const { getGuildSettings } = require('./config');

const activeSessions = new Map();

async function startSession(interaction, type, duration) {
  const sessionId = Date.now().toString();
  const sessionData = {
    id: sessionId,
    guildId: interaction.guild.id,
    startTime: new Date(),
    user: interaction.user,
    type: type,
    duration: duration
  };
  
  activeSessions.set(sessionId, sessionData);
  
  // Get guild settings
  const guildSettings = await getGuildSettings(interaction.guild.id);
  
  if (guildSettings.sessionsChannelId) {
    const sessionsChannel = interaction.guild.channels.cache.get(guildSettings.sessionsChannelId);
    if (sessionsChannel) {
      const sessionEmbed = createSessionEmbed('started', {
        user: interaction.user,
        duration: duration,
        type: type
      });
      
      const message = await sessionsChannel.send({ embeds: [sessionEmbed] });
      sessionData.messageId = message.id;
      activeSessions.set(sessionId, sessionData);
    }
  }
  
  return sessionId;
}

async function endSession(interaction, sessionId, notes) {
  const sessionData = activeSessions.get(sessionId);
  if (!sessionData || sessionData.guildId !== interaction.guild.id) {
    return false;
  }
  
  const endTime = new Date();
  const duration = Math.floor((endTime - sessionData.startTime) / 60000); // in minutes
  
  // Get guild settings
  const guildSettings = await getGuildSettings(interaction.guild.id);
  
  if (guildSettings.sessionsChannelId) {
    const sessionsChannel = interaction.guild.channels.cache.get(guildSettings.sessionsChannelId);
    if (sessionsChannel) {
      const sessionEmbed = createSessionEmbed('ended', {
        user: interaction.user,
        duration: `${duration} minutes`,
        notes: notes
      });
      
      await sessionsChannel.send({ embeds: [sessionEmbed] });
    }
  }
  
  activeSessions.delete(sessionId);
  return true;
}

function getActiveSessions(guildId) {
  return Array.from(activeSessions.values()).filter(session => session.guildId === guildId);
}

module.exports = {
  startSession,
  endSession,
  getActiveSessions
};